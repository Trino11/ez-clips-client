// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::io::{Read, Write};
use std::net::TcpListener;
use tauri::Emitter;

#[tauri::command]
fn start_oauth_server(window: tauri::Window) {
    std::thread::spawn(move || {
        let listener = TcpListener::bind("127.0.0.1:5173").unwrap();
        for stream in listener.incoming() {
            let mut stream = stream.unwrap();
            let mut buffer = [0; 1024];
            stream.read(&mut buffer).unwrap();

            let request = String::from_utf8_lossy(&buffer[..]);
            if let Some(first_line) = request.lines().next() {
                if first_line.starts_with("GET") {
                    if let Some(start) = first_line.find("/?") {
                        let query = &first_line[start + 2
                            ..first_line.find("HTTP/1.1").unwrap_or(first_line.len()) - 1];
                        let pairs: Vec<(&str, &str)> = query
                            .split('&')
                            .filter_map(|s| {
                                let mut parts = s.split('=');
                                if let (Some(k), Some(v)) = (parts.next(), parts.next()) {
                                    Some((k, v))
                                } else {
                                    None
                                }
                            })
                            .collect();

                        if let Some((_, code)) = pairs.iter().find(|(k, _)| *k == "code") {
                            println!("🔐 Emitting code: {}", code);

                            // ✅ Emit the code to React
                            let _ = window.emit("discord_oauth_code", *code);
                        }
                    }
                }
            }

            let response = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n
              <h1>Login successful, you can now close this window.</h1><script>window.close();</script>";
            stream.write_all(response.as_bytes()).unwrap();
            stream.flush().unwrap();

            break;
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_oauth_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
