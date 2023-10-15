// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod constants;
pub mod database;
pub mod events;

use crate::database::database::open_database;
use gnome_dbus_api::handlers::easy_gnome::apps::Apps;
use gnome_dbus_api::handlers::easy_gnome::battery;
use gnome_dbus_api::handlers::easy_gnome::extensions;
use gnome_dbus_api::handlers::easy_gnome::interface;
use gnome_dbus_api::handlers::easy_gnome::nightlight;
use gnome_dbus_api::handlers::easy_gnome::peripherals;
use gnome_dbus_api::handlers::easy_gnome::screen;
use once_cell::sync::Lazy;

use rustbreak::deser::Bincode;
use rustbreak::Database;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::result::Result;
use std::{
    process::Command,
    thread::{self, sleep},
    time::Duration,
};
use tauri::Manager;
use upower_dbus::BatteryState;
use upower_dbus::BatteryType;
use wallpaper;

static DATABASE: Lazy<Database<HashMap<String, String>, rustbreak::backend::PathBackend, Bincode>> =
    Lazy::new(|| open_database());

#[derive(Serialize, Deserialize, Clone, Debug)]
struct SystemApp {
    name: String,
    icon: Option<String>,
    description: Option<String>,
    execute: PathBuf,
}

#[tauri::command]
async fn set_wallpaper(path: String) {
    wallpaper::set_from_path(path.as_str()).unwrap();
}

#[tauri::command]
fn write_database(key: String, value: String) -> Result<(), String> {
    let result = database::database::write(&DATABASE, key, value);
    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err.to_string()),
    }
}
#[tauri::command]
fn read_database(key: String) -> Result<String, String> {
    let result = database::database::read(&DATABASE, key);
    match result {
        Ok(value) => Ok(value),
        Err(err) => Err(err.to_string()),
    }
}
#[tauri::command]
async fn set_nightlight(status: bool) -> Result<(), String> {
    nightlight::set_nightlight_active(status);
    Ok(())
}
#[tauri::command]
async fn set_temperature(temperature: u32) -> Result<(), String> {
    nightlight::set_temperature(temperature);
    Ok(())
}
#[tauri::command]
async fn get_temperature() -> Result<u32, String> {
    let temp = nightlight::get_temperature();
    Ok(temp)
}

#[tauri::command]
async fn brightness_up() -> Result<(), String> {
    screen::step_up().await;
    Ok(())
}
#[tauri::command]
async fn brightness_down() -> Result<(), String> {
    screen::step_down().await;
    Ok(())
}

#[tauri::command]
async fn open_app(app_executable: String) -> Result<(), String> {
    Command::new(app_executable)
        .spawn()
        .expect("Failed to open app");
    Ok(())
}
#[derive(Serialize, Deserialize, Clone)]
struct DeviceBatery {
    full_design_battery: f64,
    full_battery: f64,
    current_battery: f64,
    percentage: f64,
    battery_state: BatteryState,
    temperature: f64,
    is_rechargable: bool,
    model: String,
    vendor: String,
    power_supply: bool,
    battery_type: BatteryType,
}
#[tauri::command]
async fn get_devices_battery() -> Result<Vec<DeviceBatery>, String> {
    let battery_devices = battery::get_devices_battery().await.unwrap();
    let mut devices = Vec::new();

    for device in battery_devices {
        let full_design_battery = device.energy_full_design().await.unwrap();
        let full_battery = device.energy_full().await.unwrap();
        let current_battery = device.energy().await.unwrap();
        let percentage = device.percentage().await.unwrap();
        let battery_state = device.state().await.unwrap();
        let temperature = device.temperature().await.unwrap();
        let is_rechargable = device.is_rechargeable().await.unwrap();
        let model = device.model().await.unwrap();
        let vendor = device.vendor().await.unwrap();
        let power_supply = device.power_supply().await.unwrap();
        let battery_type = device.type_().await.unwrap();

        devices.push(DeviceBatery {
            full_design_battery,
            full_battery,
            current_battery,
            percentage,
            battery_state,
            temperature,
            is_rechargable,
            model,
            vendor,
            power_supply,
            battery_type,
        });
    }
    Ok(devices)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.app_handle();
            let main_window = app.get_window("sittly").unwrap();
            thread::spawn(move || loop {
                if !main_window.is_focused().unwrap() {
                    sleep(Duration::from_millis(5000));
                    continue;
                }
                let player_info = events::music::get_player_info();
                app_handle.emit_all("player_status", &player_info).unwrap();
                // If music is playing wait 1 second, else wait 5 seconds
                if player_info != "No music playing" {
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
            let _ = window.clone().run_on_main_thread(move || {
                let system_apps_instance = Apps::new();
                let system_apps = system_apps_instance.get_apps();
                let system_apps_json: Vec<SystemApp> = system_apps
                    .iter()
                    .map(|app| SystemApp {
                        name: app.name.to_string(),
                        icon: app.get_base64_icon(),
                        description: match &app.description {
                            Some(description) => Some(description.clone().to_string()),
                            None => None,
                        },
                        execute: app.executable.clone(),
                    })
                    .collect();
                window
                    .eval(
                        format!(
                            "window.systemApps = {}",
                            serde_json::to_string(&system_apps_json).unwrap()
                        )
                        .as_str(),
                    )
                    .unwrap()
            });
        })
        // .manage(AppState {
        //     writer: Arc::new(AsyncMutex::new(writer)),
        // })
        .invoke_handler(tauri::generate_handler![
            events::music::play_pause_music,
            events::music::previous_media,
            events::music::next_media,
            events::music::set_volume,
            events::files::find_files,
            events::files::read_file,
            events::files::read_dir,
            events::clipboard::paste_to_current_window,
            events::clipboard::get_selected_text,
            events::clipboard::copy_image_to_clipboard,
            events::cmd::cmd,
            events::app::download_extension,
            events::app::show_app,
            set_wallpaper,
            read_database,
            write_database,
            set_nightlight,
            set_temperature,
            get_temperature,
            brightness_up,
            brightness_down,
            open_app,
            get_devices_battery
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
