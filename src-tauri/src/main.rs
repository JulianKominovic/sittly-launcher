// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use playerctl::PlayerCtl;
use serde::{Deserialize, Serialize};
use std::{
    process::Command,
    thread::{self, sleep},
    time::Duration,
};

// struct AppState {
//     writer: Arc<AsyncMutex<Box<dyn Write + Send>>>,
// }

#[tauri::command]
async fn play_pause_music() {
    PlayerCtl::play_pause()
}

#[derive(Serialize, Deserialize, Clone)]
struct TrackData {
    current_time: u32,
    duration: u32,
    name: String,
    artist: String,
    album: String,
    status: String,
}

fn command(command: &str) -> String {
    let mut parts = command.split_whitespace().collect::<Vec<&str>>();

    let stdout = Command::new(parts.remove(0))
        .args(parts)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command '{}'", command))
        .stdout;

    String::from_utf8(stdout).expect("Stdout was not valid UTF-8")
}

fn get_remaining_time_in_seconds() -> u32 {
    let result = command(r#"playerctl metadata --format '{{ mpris:length - position }}'"#)
        .trim()
        .parse::<u32>();

    match result {
        Ok(value) => value * 100_000,
        Err(_) => 0,
    }
}

fn get_current_time_in_seconds() -> u32 {
    let result = command(r#"playerctl metadata --format '{{ position }}'"#)
        .trim()
        .parse::<u32>();

    match result {
        Ok(value) => value * 100_000,
        Err(_) => 0,
    }
}

fn main() {
    tauri::Builder::default()
        .on_page_load(move |window, _| {
            thread::spawn(move || loop {
                sleep(Duration::from_millis(1000));
                let status = match PlayerCtl::status() {
                    playerctl::PlayerStatus::Playing => "playing",
                    playerctl::PlayerStatus::Paused => "paused",
                    playerctl::PlayerStatus::Stopped => "stopped",
                };

                let player_metadata = PlayerCtl::metadata();

                let track_data = TrackData {
                    current_time: get_current_time_in_seconds(),
                    duration: get_remaining_time_in_seconds(),
                    name: player_metadata.title,
                    artist: player_metadata.artist,
                    album: player_metadata.album,
                    status: status.to_string(),
                };

                window.emit("player_status", track_data).unwrap();
            });
        })
        // .manage(AppState {
        //     writer: Arc::new(AsyncMutex::new(writer)),
        // })
        .invoke_handler(tauri::generate_handler![play_pause_music])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
