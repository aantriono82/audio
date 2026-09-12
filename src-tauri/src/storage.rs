use serde::Serialize;
use serde_json::Value;
use std::{
    fs,
    io::Write,
    path::{Path, PathBuf},
    time::UNIX_EPOCH,
};

pub type Result<T> = std::result::Result<T, String>;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AudioEntry {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub last_modified: u64,
    pub relative_path: String,
}

pub fn audio_extension(path: &Path) -> bool {
    matches!(
        path.extension()
            .and_then(|s| s.to_str())
            .unwrap_or("")
            .to_ascii_lowercase()
            .as_str(),
        "mp3" | "wav" | "ogg" | "flac" | "m4a" | "aac" | "opus" | "aiff" | "webm"
    )
}

// Do not follow symlinks while scanning: avoids loops and leaving a selected folder.
pub fn scan(path: &Path, root: &Path, output: &mut Vec<AudioEntry>, skipped: &mut usize) {
    let Ok(metadata) = fs::symlink_metadata(path) else {
        *skipped += 1;
        return;
    };
    if metadata.is_symlink() {
        return;
    }
    if metadata.is_dir() {
        match fs::read_dir(path) {
            Ok(entries) => {
                for entry in entries {
                    match entry {
                        Ok(entry) => scan(&entry.path(), root, output, skipped),
                        Err(_) => *skipped += 1,
                    }
                }
            }
            Err(_) => *skipped += 1,
        }
    } else if metadata.is_file() && audio_extension(path) {
        output.push(AudioEntry {
            path: path.to_string_lossy().into_owned(),
            name: path
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned(),
            size: metadata.len(),
            last_modified: metadata
                .modified()
                .ok()
                .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
                .map(|t| t.as_millis() as u64)
                .unwrap_or(0),
            relative_path: path
                .strip_prefix(root)
                .unwrap_or(path)
                .to_string_lossy()
                .replace('\\', "/"),
        });
    }
}

pub fn atomic_write(path: &Path, bytes: &[u8]) -> Result<()> {
    let parent = path.parent().ok_or("Invalid storage path")?;
    fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    let mut temp = tempfile::NamedTempFile::new_in(parent).map_err(|e| e.to_string())?;
    temp.write_all(bytes).map_err(|e| e.to_string())?;
    temp.as_file().sync_all().map_err(|e| e.to_string())?;
    temp.persist(path).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn read_json(path: &Path) -> Result<Value> {
    match fs::read(path) {
        Ok(bytes) => serde_json::from_slice(&bytes).map_err(|e| format!("{}: {e}", path.display())),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(Value::Null),
        Err(e) => Err(e.to_string()),
    }
}

pub fn track_dir(root: &Path, id: &str) -> Result<PathBuf> {
    if id.len() != 36
        || !id.bytes().enumerate().all(|(i, b)| {
            if [8, 13, 18, 23].contains(&i) {
                b == b'-'
            } else {
                b.is_ascii_hexdigit()
            }
        })
    {
        return Err("Invalid track identifier".into());
    }
    Ok(root.join("library").join(id))
}

pub fn save_track(root: &Path, source: &Path, mut track: Value, cover: &[u8]) -> Result<Value> {
    let id = track["id"].as_str().ok_or("Missing track identifier")?;
    let directory = track_dir(root, id)?;
    if !audio_extension(source) || !source.is_file() {
        return Err("Not an audio file".into());
    }
    if directory.exists() {
        return Err("Track already exists".into());
    }
    fs::create_dir_all(root.join("library")).map_err(|e| e.to_string())?;
    let staging = tempfile::tempdir_in(root.join("library")).map_err(|e| e.to_string())?;
    let filename = format!(
        "audio.{}",
        source
            .extension()
            .unwrap()
            .to_string_lossy()
            .to_ascii_lowercase()
    );
    fs::copy(source, staging.path().join(&filename)).map_err(|e| e.to_string())?;
    track["audioFile"] = filename.into();
    track
        .as_object_mut()
        .ok_or("Invalid metadata")?
        .remove("nativePath");
    track.as_object_mut().unwrap().remove("coverPath");
    if !cover.is_empty() {
        fs::write(staging.path().join("cover.bin"), cover).map_err(|e| e.to_string())?;
    }
    atomic_write(
        &staging.path().join("track.json"),
        &serde_json::to_vec(&track).map_err(|e| e.to_string())?,
    )?;
    fs::rename(staging.path(), &directory).map_err(|e| e.to_string())?;
    hydrate_track(&directory, track)
}

fn hydrate_track(directory: &Path, mut track: Value) -> Result<Value> {
    let filename = track["audioFile"].as_str().ok_or("Missing audio file")?;
    if !filename.starts_with("audio.")
        || filename.contains(['/', '\\'])
        || !audio_extension(Path::new(filename))
    {
        return Err("Invalid audio file".into());
    }
    let audio = directory.join(filename);
    if !audio.is_file() {
        return Err("Audio file missing".into());
    }
    track["nativePath"] = audio.to_string_lossy().into_owned().into();
    if directory.join("cover.bin").is_file() {
        track["coverPath"] = directory
            .join("cover.bin")
            .to_string_lossy()
            .into_owned()
            .into();
    }
    Ok(track)
}

pub fn load_tracks(root: &Path) -> Result<Value> {
    let library = root.join("library");
    fs::create_dir_all(&library).map_err(|e| e.to_string())?;
    let mut tracks = Vec::new();
    let mut skipped = 0;
    for entry in fs::read_dir(&library).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let id = entry.file_name().to_string_lossy().into_owned();
        if track_dir(root, &id).is_err() {
            continue;
        }
        match read_json(&entry.path().join("track.json")).and_then(|track| {
            if track["id"].as_str() != Some(&id) {
                return Err("Track identifier mismatch".into());
            }
            hydrate_track(&entry.path(), track)
        }) {
            Ok(track) => tracks.push(track),
            Err(_) => skipped += 1,
        }
    }
    Ok(serde_json::json!({ "tracks": tracks, "skipped": skipped }))
}

#[cfg(test)]
mod tests {
    use super::*;
    const ID: &str = "01234567-89ab-cdef-0123-456789abcdef";

    #[test]
    fn imported_audio_survives_removal_of_original_and_restart() {
        let temp = tempfile::tempdir().unwrap();
        let source = temp.path().join("lagu 日本.wav");
        fs::write(&source, b"audio fixture").unwrap();
        let data = temp.path().join("data");
        save_track(
            &data,
            &source,
            serde_json::json!({"id": ID, "title": "Musik"}),
            b"cover",
        )
        .unwrap();
        fs::remove_file(source).unwrap();
        let loaded = load_tracks(&data).unwrap();
        assert_eq!(loaded["tracks"][0]["title"], "Musik");
        assert_eq!(
            fs::read(loaded["tracks"][0]["nativePath"].as_str().unwrap()).unwrap(),
            b"audio fixture"
        );
        assert_eq!(loaded["skipped"], 0);
    }

    #[test]
    fn rejects_traversal_and_does_not_overwrite_existing_track() {
        let temp = tempfile::tempdir().unwrap();
        assert!(track_dir(temp.path(), "../../outside").is_err());
        let source = temp.path().join("music.mp3");
        fs::write(&source, b"first").unwrap();
        let meta = serde_json::json!({"id": ID});
        save_track(temp.path(), &source, meta.clone(), &[]).unwrap();
        assert!(save_track(temp.path(), &source, meta, &[]).is_err());
    }

    #[test]
    fn corrupt_track_is_reported_without_losing_other_tracks() {
        let temp = tempfile::tempdir().unwrap();
        let directory = track_dir(temp.path(), ID).unwrap();
        atomic_write(&directory.join("track.json"), b"broken").unwrap();
        assert_eq!(load_tracks(temp.path()).unwrap()["skipped"], 1);
    }

    #[test]
    fn settings_are_replaced_and_corruption_is_not_silently_reset() {
        let temp = tempfile::tempdir().unwrap();
        let path = temp.path().join("settings.json");
        assert_eq!(read_json(&path).unwrap(), Value::Null);
        atomic_write(&path, br#"{"volume":0.5}"#).unwrap();
        atomic_write(&path, br#"{"volume":0.8}"#).unwrap();
        assert_eq!(read_json(&path).unwrap()["volume"], 0.8);
        atomic_write(&path, b"broken").unwrap();
        assert!(read_json(&path).is_err());
    }

    #[test]
    fn folder_scan_filters_audio_and_preserves_fingerprints() {
        let temp = tempfile::tempdir().unwrap();
        fs::create_dir(temp.path().join("Album")).unwrap();
        fs::write(temp.path().join("Album/Artist - Title.MP3"), b"audio").unwrap();
        fs::write(temp.path().join("notes.txt"), b"text").unwrap();
        let mut first = Vec::new();
        let mut second = Vec::new();
        let mut skipped = 0;
        scan(temp.path(), temp.path(), &mut first, &mut skipped);
        scan(temp.path(), temp.path(), &mut second, &mut skipped);
        assert_eq!(first.len(), 1);
        assert_eq!(first[0].last_modified, second[0].last_modified);
        assert_eq!(first[0].relative_path, "Album/Artist - Title.MP3");
    }

    #[cfg(unix)]
    #[test]
    fn scan_does_not_follow_symlinks() {
        let temp = tempfile::tempdir().unwrap();
        std::os::unix::fs::symlink(temp.path(), temp.path().join("loop")).unwrap();
        let mut entries = Vec::new();
        scan(temp.path(), temp.path(), &mut entries, &mut 0);
        assert!(entries.is_empty());
    }
}
