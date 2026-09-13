mod storage;

use serde_json::{json, Value};
use std::{fs, path::PathBuf};
use storage::Result;
use tauri::{DragDropEvent, Manager, WindowEvent};
use tauri_plugin_dialog::DialogExt;

fn data_root(app: &tauri::AppHandle) -> Result<PathBuf> {
    app.path().app_data_dir().map_err(|e| e.to_string())
}

async fn blocking<T: Send + 'static>(
    work: impl FnOnce() -> Result<T> + Send + 'static,
) -> Result<T> {
    tauri::async_runtime::spawn_blocking(work)
        .await
        .map_err(|e| e.to_string())?
}

fn authorized_audio(app: &tauri::AppHandle, path: &str) -> Result<PathBuf> {
    let path = fs::canonicalize(path).map_err(|e| e.to_string())?;
    if !app.asset_protocol_scope().is_allowed(&path)
        || !storage::audio_extension(&path)
        || !path.is_file()
    {
        return Err("File audio belum dipilih atau tidak diizinkan.".into());
    }
    Ok(path)
}

fn scan_paths(app: &tauri::AppHandle, paths: Vec<PathBuf>) -> Result<Value> {
    let mut entries = Vec::new();
    let mut skipped = 0;
    for path in paths {
        let path = fs::canonicalize(&path).map_err(|e| e.to_string())?;
        if !app.asset_protocol_scope().is_allowed(&path) {
            return Err("Folder/file belum dipilih.".into());
        }
        storage::scan(
            &path,
            path.parent().unwrap_or(&path),
            &mut entries,
            &mut skipped,
        );
    }
    entries.sort_by(|a, b| a.path.cmp(&b.path));
    entries.dedup_by(|a, b| a.path == b.path);
    // Grant only regular audio files found; never widen access to symlink targets.
    for entry in &entries {
        app.asset_protocol_scope()
            .allow_file(&entry.path)
            .map_err(|e| e.to_string())?;
    }
    Ok(json!({"entries": entries, "skipped": skipped}))
}

#[tauri::command]
async fn select_audio(app: tauri::AppHandle, folder: bool) -> Result<Value> {
    blocking(move || {
        let picker = app
            .dialog()
            .file()
            .set_title("Tambahkan musik ke Atiga Amp");
        let paths = if folder {
            picker.blocking_pick_folder().map(|p| vec![p])
        } else {
            picker
                .add_filter(
                    "Audio",
                    &[
                        "mp3", "wav", "ogg", "flac", "m4a", "aac", "opus", "aiff", "webm",
                    ],
                )
                .blocking_pick_files()
        };
        let Some(paths) = paths else {
            return Ok(Value::Null);
        };
        let paths: Vec<PathBuf> = paths
            .into_iter()
            .map(|p| p.into_path().map_err(|e| e.to_string()))
            .collect::<Result<_>>()?;
        for path in &paths {
            if path.is_dir() {
                app.asset_protocol_scope().allow_directory(path, false)
            } else {
                app.asset_protocol_scope().allow_file(path)
            }
            .map_err(|e| e.to_string())?;
        }
        let result = scan_paths(&app, paths.clone())?;
        if folder {
            storage::atomic_write(
                &data_root(&app)?.join("music-folder.json"),
                &serde_json::to_vec(&paths[0]).map_err(|e| e.to_string())?,
            )?;
        }
        Ok(result)
    })
    .await
}

#[tauri::command]
async fn scan_audio_paths(app: tauri::AppHandle, paths: Vec<PathBuf>) -> Result<Value> {
    blocking(move || scan_paths(&app, paths)).await
}

#[tauri::command]
async fn rescan_audio_folder(app: tauri::AppHandle) -> Result<Value> {
    blocking(move || {
        let folder = storage::read_json(&data_root(&app)?.join("music-folder.json"))?;
        let Some(folder) = folder.as_str() else {
            return Ok(Value::Null);
        };
        let path =
            fs::canonicalize(folder).map_err(|e| format!("Folder musik tidak tersedia: {e}"))?;
        app.asset_protocol_scope()
            .allow_directory(&path, false)
            .map_err(|e| e.to_string())?;
        scan_paths(&app, vec![path])
    })
    .await
}

#[tauri::command]
async fn read_audio_file(app: tauri::AppHandle, path: String) -> Result<tauri::ipc::Response> {
    blocking(move || {
        fs::read(authorized_audio(&app, &path)?)
            .map(tauri::ipc::Response::new)
            .map_err(|e| e.to_string())
    })
    .await
}

#[tauri::command]
async fn save_audio_track(
    app: tauri::AppHandle,
    path: String,
    track: Value,
    cover: Vec<u8>,
) -> Result<Value> {
    blocking(move || {
        storage::save_track(
            &data_root(&app)?,
            &authorized_audio(&app, &path)?,
            track,
            &cover,
        )
    })
    .await
}

#[tauri::command]
async fn load_audio_library(app: tauri::AppHandle) -> Result<Value> {
    blocking(move || storage::load_tracks(&data_root(&app)?)).await
}

#[tauri::command]
async fn remove_audio_track(app: tauri::AppHandle, id: String) -> Result<()> {
    blocking(move || {
        let directory = storage::track_dir(&data_root(&app)?, &id)?;
        // Only the imported copy is removed; original paths are never used here.
        match fs::remove_dir_all(directory) {
            Ok(()) => Ok(()),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    })
    .await
}

#[tauri::command]
async fn load_player_settings(app: tauri::AppHandle) -> Result<Value> {
    blocking(move || storage::read_json(&data_root(&app)?.join("settings.json"))).await
}

#[tauri::command]
async fn save_player_settings(app: tauri::AppHandle, settings: Value) -> Result<()> {
    blocking(move || {
        if !settings.is_object() {
            return Err("Invalid settings".into());
        }
        storage::atomic_write(
            &data_root(&app)?.join("settings.json"),
            &serde_json::to_vec(&settings).map_err(|e| e.to_string())?,
        )
    })
    .await
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        // Keep an explicit authorization step in the app event path as a
        // fallback for runtimes that emit a drop without updating the asset
        // protocol scope before the frontend asks us to scan it.
        .on_window_event(|window, event| {
            if let WindowEvent::DragDrop(DragDropEvent::Drop { paths, .. }) = event {
                let scope = window.app_handle().asset_protocol_scope();
                for path in paths {
                    let result = if path.is_file() {
                        scope.allow_file(path)
                    } else if path.is_dir() {
                        scope.allow_directory(path, false)
                    } else {
                        Ok(())
                    };
                    if let Err(error) = result {
                        eprintln!("Unable to authorize dropped path: {error}");
                    }
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            select_audio,
            scan_audio_paths,
            rescan_audio_folder,
            read_audio_file,
            save_audio_track,
            load_audio_library,
            remove_audio_track,
            load_player_settings,
            save_player_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running Atiga Amp");
}
