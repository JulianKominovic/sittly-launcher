use std::path;

pub fn get_sittly_path() -> String {
    let home_dir = std::env::home_dir().unwrap();
    let home_dir_str = home_dir.to_str().unwrap();
    let sittly_path = path::Path::new(home_dir_str).join(".sittly");

    sittly_path.to_str().unwrap().to_string()
}
