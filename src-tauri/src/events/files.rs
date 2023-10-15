use base64::{engine::general_purpose, Engine as _};
use rust_search::{FilterExt, SearchBuilder};
use serde::{Deserialize, Serialize};
use std::time::SystemTime;
use tauri::api::file::read_binary;
#[derive(Serialize, Deserialize, Clone)]
pub struct File {
    name: String,
    file_type: String,
    path: String,
    is_dir: bool,
    size: u64,
    base64: Option<String>,
    last_modified: SystemTime,
}

#[tauri::command]
pub fn find_files(query: String, base_dir: String, extension: Option<String>) -> Vec<File> {
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
pub async fn read_dir(path: String) -> Vec<File> {
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
pub fn read_file(path: String, skip_content: bool) -> File {
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
