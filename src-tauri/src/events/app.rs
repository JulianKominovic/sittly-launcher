use std::process::Command;

#[tauri::command]
pub async fn download_extension(github_url: String) {
    let args: [&str; 3] = ["clone", &github_url, "--depth=1"];
    Command::new("git")
        .args(args)
        .output()
        .unwrap_or_else(|_| panic!("Failed to download github repo"));
}

#[tauri::command]
pub async fn show_app() {
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
