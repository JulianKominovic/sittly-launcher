use std::{path, process::Command};

use crate::constants::get_sittly_path;

pub fn clipboard_has_image() -> bool {
    let args = ["-selection", "clipboard", "-t", "TARGETS", "-o"];
    let output = Command::new("xclip")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));
    let stdout = String::from_utf8(output.stdout).unwrap();
    stdout.contains("image")
}

#[tauri::command]
pub async fn paste_to_current_window() {
    let mut args: [&str; 3] = ["key", "--clearmodifiers", "ctrl+shift+v"];
    if clipboard_has_image() {
        args = ["key", "--clearmodifiers", "ctrl+v"];
    }
    Command::new("xdotool")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));
}

#[tauri::command]
pub async fn get_selected_text() -> String {
    // Using xsel -b
    let args: [&str; 1] = ["-p"];
    let output = Command::new("xsel")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));
    let stdout = String::from_utf8(output.stdout).unwrap();

    stdout
}

#[tauri::command]
pub async fn copy_image_to_clipboard(mut path: String) {
    // If path is a url, download the image and copy it to clipboard
    if path.starts_with("http") {
        let filename = "clipboard-temp-img";
        let args = ["-O", filename, &path];
        let output = Command::new("wget")
            .current_dir(get_sittly_path())
            .args(args)
            .output()
            .unwrap_or_else(|_| panic!("Failed to execute player info"));
        let status = output.status;
        if !status.success() {
            panic!("Failed to download image");
        }
        // Convert any image to png using imagemagick
        path = path::Path::new(get_sittly_path().as_str())
            .join(filename)
            .to_str()
            .unwrap()
            .to_string();
        let imagemagick_args = [path.as_str(), "clipboard-temp-img.png"];
        Command::new("convert")
            .args(imagemagick_args)
            .current_dir(get_sittly_path())
            .output()
            .unwrap_or_else(|_| panic!("Failed to execute player info"));
        path = path::Path::new(get_sittly_path().as_str())
            .join("clipboard-temp-img.png")
            .to_str()
            .unwrap()
            .to_string();
    }

    let args = ["-selection", "clipboard", "-t", "image/png", "-i", &path];
    println!("{:?}", args);
    Command::new("xclip")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));
}
