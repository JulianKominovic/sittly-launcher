// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use base64::{engine::general_purpose, Engine as _};
use playerctl::PlayerCtl;
use rust_search::{FilterExt, SearchBuilder};
use serde::{Deserialize, Serialize};
use std::path;
use std::result::Result;
use std::time::SystemTime;
use std::{
    process::Command,
    thread::{self, sleep},
    time::Duration,
};
use tauri::api::file::read_binary;
use tauri::Manager;
use wallpaper;
// struct AppState {
//     writer: Arc<AsyncMutex<Box<dyn Write + Send>>>,
// }

fn get_sittly_path() -> String {
    let home_dir = std::env::home_dir().unwrap();
    let home_dir_str = home_dir.to_str().unwrap();
    let sittly_path = path::Path::new(home_dir_str).join(".sittly");

    sittly_path.to_str().unwrap().to_string()
}
#[derive(Serialize, Deserialize, Clone)]
struct File {
    name: String,
    file_type: String,
    path: String,
    is_dir: bool,
    size: u64,
    base64: Option<String>,
    last_modified: SystemTime,
}

fn clipboard_has_image() -> bool {
    let args = ["-selection", "clipboard", "-t", "TARGETS", "-o"];
    let output = Command::new("xclip")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute player info"));
    let stdout = String::from_utf8(output.stdout).unwrap();
    stdout.contains("image")
}

#[tauri::command]
async fn find_files(query: String, base_dir: String, extension: Option<String>) -> Vec<File> {
    // Define a custom filter function that takes a reference to banned_files
    fn custom_filter(entry: &rust_search::DirEntry) -> bool {
        let banned_files = vec!["node_modules", ".git", "cache", "temp", "tmp"];
        for banned_file in banned_files {
            if entry.path().to_str().unwrap().contains(banned_file) {
                return false; // Filter out entries that match banned files
            }
        }
        true // Keep all other entries
    }

    let mut search_builder = SearchBuilder::default()
        .location(base_dir)
        .search_input(query)
        .limit(100) // results to return
        .depth(6)
        .custom_filter(custom_filter) // Pass banned_files as a parameter
        .ignore_case()
        .hidden();

    if let Some(ext) = extension {
        search_builder = search_builder.ext(ext);
    }

    let mut results: Vec<File> = search_builder
        .build()
        .map(|path| read_file(path, true))
        .filter(|file| file.name != "")
        .collect();

    results.sort_by_key(|element: &File| element.last_modified);
    results
}

#[tauri::command]
async fn read_dir(path: String) -> Vec<File> {
    let files_in_dir = std::fs::read_dir(path).unwrap();
    let files = files_in_dir.map(|f| {
        let file = f.unwrap();
        let path = file.path();
        let path_as_str = path.to_str().unwrap().to_string();
        let file_struct = read_file(path_as_str, true);
        file_struct
    });
    let mapped_files = files.filter(|f| f.name != "").collect::<Vec<File>>();
    mapped_files
}

#[tauri::command]
fn read_file(path: String, skip_content: bool) -> File {
    let metadata = std::fs::metadata(&path);
    if metadata.is_err() {
        return File {
            name: String::from(""),
            file_type: String::from(""),
            path: String::from(""),
            is_dir: false,
            size: 0,
            base64: None,
            last_modified: SystemTime::now(),
        };
    }
    let unwrapped_metadata = metadata.unwrap();
    // Base64 encode file content if len is less than 10 mb
    let length = unwrapped_metadata.len();
    let splitted_path = path.split("/").collect::<Vec<&str>>();
    let fallback_file_type = splitted_path.last().unwrap();
    let filetype = std::path::Path::new(&path)
        .extension()
        .unwrap_or_else(|| std::ffi::OsStr::new(&fallback_file_type))
        .to_str()
        .unwrap()
        .to_string();
    let content = match skip_content {
        true => String::from(""),
        false => match unwrapped_metadata.is_dir() {
            true => String::from(""),
            false => match length {
                d if d < 10000000 => {
                    let content = read_binary(&path).unwrap();

                    #[cfg(debug_assertions)]
                    println!("File read: {} {}", path, content.len());
                    let b64 = general_purpose::STANDARD.encode(content);
                    b64
                }
                _ => String::from(""),
            },
        },
    };
    File {
        name: std::path::Path::new(&path)
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string(),

        file_type: filetype,
        path: String::from(&path),
        is_dir: unwrapped_metadata.is_dir(),
        size: length,
        base64: Some(content),
        last_modified: unwrapped_metadata.modified().unwrap(),
    }
}

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
async fn set_wallpaper(path: String) {
    wallpaper::set_from_path(path.as_str()).unwrap();
}
#[tauri::command]
async fn get_selected_text() -> String {
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
// cmd must return stdout, stderr, status
async fn cmd(command: String, args: Vec<String>) -> Result<String, String> {
    println!("{} {:?}", command, args);
    let output = Command::new(command)
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));
    let stdout = String::from_utf8(output.stdout).unwrap();
    let stderr = String::from_utf8(output.stderr).unwrap();
    let status = output.status;
    if status.success() {
        Ok(stdout)
    } else {
        Err(stderr)
    }
}

#[tauri::command]
async fn show_app() {
    // Get current workspace
    // xdotool get_desktop
    let workspace_args = ["get_desktop"];
    let workspace_output = Command::new("xdotool")
        .args(workspace_args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));
    let workspace_stdout = String::from_utf8(workspace_output.stdout).unwrap();

    // Get all windows
    let window_list_args = ["-l"];
    let window_list_output = Command::new("wmctrl")
        .args(window_list_args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));
    let window_list_stdout = String::from_utf8(window_list_output.stdout).unwrap();
    let window_list = window_list_stdout.split("\n").collect::<Vec<&str>>();
    // Match window with the exact title 'sittly'
    let window_list_item = window_list
        .iter()
        .find(|&&x| x.split(" ").any(|part| part.eq("sittly")))
        .unwrap();

    let window_id = window_list_item.split("\n").collect::<Vec<&str>>()[0];

    // Bring sittly window to current desktop

    Command::new("xdotool")
        .args([
            "set_desktop_for_window",
            window_id,
            workspace_stdout.as_str(),
        ])
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));

    Command::new("xdotool")
        .args(["windowactivate", window_id])
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));
}

#[tauri::command]
async fn copy_image_to_clipboard(mut path: String) {
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
            };

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
            download_extension,
            cmd,
            set_wallpaper,
            get_selected_text,
            copy_image_to_clipboard,
            show_app,
            find_files,
            read_file,
            read_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
