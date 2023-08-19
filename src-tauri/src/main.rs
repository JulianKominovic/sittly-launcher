// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use playerctl::PlayerCtl;
use serde::{Deserialize, Serialize};
use std::result::Result;
use std::{
    process::Command,
    thread::{self, sleep},
    time::Duration,
};

use tauri::Manager;

// struct AppState {
//     writer: Arc<AsyncMutex<Box<dyn Write + Send>>>,
// }

#[tauri::command]
async fn play_pause_music() {
    PlayerCtl::play_pause()
}
#[tauri::command]
async fn next_media() {
    PlayerCtl::next()
}
#[tauri::command]
async fn previous_media() {
    PlayerCtl::previous()
}
/*
percent="10%+" -> increase volume by 10%
percent="10%-" -> decrease volume by 10%
percent="0" -> set volume to 0%
*/
#[tauri::command]
async fn set_volume(volume: String) {
    let args: [&str; 5] = ["-D", "pulse", "sset", "Master", &volume];
    Command::new("amixer")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));
}

#[tauri::command]
async fn download_extension(github_url: String) {
    let args: [&str; 3] = ["clone", &github_url, "--depth=1"];
    Command::new("git")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to download github repo"));
}

#[tauri::command]
async fn paste_to_current_window() {
    let args: [&str; 3] = ["key", "--clearmodifiers", "ctrl+shift+v"];
    Command::new("xdotool")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));
}

#[tauri::command]
async fn get_compiled_code() -> String {
    Command::new("npm")
        .current_dir(format!(
            "{}/.sittly",
            // Get homedir
            std::env::var_os("HOME").unwrap().to_str().unwrap()
        ))
        .args(["install"])
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));

    let stdout = Command::new("node")
        .args([format!(
            "{}/.sittly/compile-extensions.js",
            // Get homedir
            std::env::var_os("HOME").unwrap().to_str().unwrap()
        )
        .as_str()])
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));

    print!("{:?}", String::from_utf8(stdout.stdout).unwrap());

    let compiled_bundle = Command::new("cat")
        .args([format!(
            "{}/.sittly/dist/bundle.js",
            // Get homedir
            std::env::var_os("HOME").unwrap().to_str().unwrap()
        )
        .as_str()])
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));

    String::from_utf8(compiled_bundle.stdout).unwrap()
}

#[tauri::command]
async fn cmd(command: String) -> Result<String, String> {
    let args: [&str; 2] = ["-c", command.as_str()];
    let output = Command::new("sh")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));
    let stdout = String::from_utf8(output.stdout).unwrap();
    let stderr = String::from_utf8(output.stderr).unwrap();
    if stderr.len() > 0 {
        return Err(stderr);
    }
    Ok(stdout)
}

#[derive(Serialize, Deserialize, Clone)]
struct TrackData {
    current_time: i32,
    duration: i32,
    name: String,
    artist: String,
    album: String,
    status: String,
}

fn get_player_info() -> String {
    let args = ["metadata", "--format","{{ artist }} |-| {{ album }} |-| {{ title }} |-| {{ mpris:length - position }} |-| {{position}} |-| {{mpris:length}}"];
    let stdout = Command::new("playerctl")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"))
        .stdout;
    if stdout.len() == 0 {
        return String::from("No music playing");
    }
    let mut stdout_str = String::from_utf8(stdout).expect("Stdout was not valid UTF-8");

    let status = PlayerCtl::status();
    let status_str = match status {
        playerctl::PlayerStatus::Paused => "Paused",
        playerctl::PlayerStatus::Playing => "Playing",
        playerctl::PlayerStatus::Stopped => "Stopped",
    };
    stdout_str.push_str(&format!(" |-| {}", status_str));
    stdout_str
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.app_handle().clone();
            thread::spawn(move || loop {
                let player_info = get_player_info();
                if player_info != "No music playing" {
                    app_handle.emit_all("player_status", player_info).unwrap();
                    sleep(Duration::from_millis(1000));
                    continue;
                }
                sleep(Duration::from_millis(5000));
            });

            Ok(())
        })
        .on_page_load(move |window, _| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                window.open_devtools();
                window.close_devtools();
            }
            // let stderr = String::from_utf8(compiled.stderr).unwrap();
            // let stdout = String::from_utf8(compiled.stdout).unwrap();

            // window.eval(format!("const script = window.document.createElement('script');script.type = 'text/javascript';script.innerHTML=`{}` window.document.head.appendChild(script);",stdout.as_str()).as_str()).unwrap();
            // window
            //     .set_size(tauri::Size::Logical(LogicalSize {
            //         width: 200.0,
            //         height: 80.0,
            //     }))
            //     .unwrap();
            // let builder = thread::Builder::new();
            // let join_handle: thread::JoinHandle<_> = builder
            //     .spawn(move || {
            //         // some work here
            //         loop {
            //             sleep(Duration::from_millis(1000));
            //             let player_info = get_player_info();
            //             println!("{}", player_info);
            //             window.emit("player_status", player_info).unwrap();
            //         }
            //     })
            //     .unwrap();
            // join_handle
            //     .join()
            //     .expect("Couldn't join on the associated thread");
            // thread_working.clone() = true;

            // thread
            //     .join()
            //     .expect("Couldn't join on the associated thread");
        })
        // .manage(AppState {
        //     writer: Arc::new(AsyncMutex::new(writer)),
        // })
        .invoke_handler(tauri::generate_handler![
            play_pause_music,
            previous_media,
            next_media,
            set_volume,
            paste_to_current_window,
            get_compiled_code,
            download_extension,
            cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
