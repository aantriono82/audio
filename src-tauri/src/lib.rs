#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_audio_file])
        .run(tauri::generate_context!())
        .expect("error while running Atiga Amp");
}

#[tauri::command]
fn read_audio_file(path: String) -> Result<Vec<u8>, String> {
    std::fs::read(&path).map_err(|error| format!("{}: {}", path, error))
}
