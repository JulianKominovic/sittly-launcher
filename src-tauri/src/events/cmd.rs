use std::process::Command;

#[tauri::command]
// cmd must return stdout, stderr, status
pub async fn cmd(command: String, args: Vec<String>) -> Result<String, String> {
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
