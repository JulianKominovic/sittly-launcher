use playerctl::PlayerCtl;
use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri;

#[derive(Serialize, Deserialize, Clone)]
struct TrackData {
    current_time: i32,
    duration: i32,
    name: String,
    artist: String,
    album: String,
    status: String,
}

pub fn get_player_info() -> String {
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

#[tauri::command]
pub async fn play_pause_music() {
    PlayerCtl::play_pause()
}
#[tauri::command]
pub async fn next_media() {
    PlayerCtl::next()
}
#[tauri::command]
pub async fn previous_media() {
    PlayerCtl::previous()
}
/*
percent="10%+" -> increase volume by 10%
percent="10%-" -> decrease volume by 10%
percent="0" -> set volume to 0%
*/
#[tauri::command]
pub async fn set_volume(volume: String) {
    let args: [&str; 5] = ["-D", "pulse", "sset", "Master", &volume];
    Command::new("amixer")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));
}
