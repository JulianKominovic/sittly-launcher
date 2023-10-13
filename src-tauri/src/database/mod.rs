pub mod database {
    use std::collections::HashMap;

    use once_cell::sync::Lazy;
    use rustbreak::{deser::Bincode, Database, PathDatabase};
    use tauri::api::path::home_dir;
    fn build_sittly_db_directory() -> std::path::PathBuf {
        let mut path = home_dir().unwrap();
        path.push(".sittly");
        path.push("db");
        path
    }
    pub fn open_database(
    ) -> Database<HashMap<String, String>, rustbreak::backend::PathBackend, Bincode> {
        let db: Database<HashMap<String, String>, rustbreak::backend::PathBackend, Bincode> =
            PathDatabase::<HashMap<String, String>, Bincode>::load_from_path_or_default(
                build_sittly_db_directory(),
            )
            .unwrap();
        db
    }
    pub fn write(
        db: &Lazy<Database<HashMap<String, String>, rustbreak::backend::PathBackend, Bincode>>,
        key: String,
        value: String,
    ) -> Result<(), String> {
        let result = db.write(|db| db.insert(key, value));
        if result.is_err() {
            return Err("Error writing to database".to_string());
        }
        let tx = db.save();
        if tx.is_err() {
            return Err("Error writing to database".to_string());
        }
        Ok(())
    }
    pub fn read(
        db: &Lazy<Database<HashMap<String, String>, rustbreak::backend::PathBackend, Bincode>>,
        key: String,
    ) -> Result<String, String> {
        let mut temp = String::from("");

        let result = db.read(|db: &HashMap<String, String>| {
            let found = match db.get(&key) {
                Some(value) => value,
                None => "",
            };
            temp = found.to_string();
        });

        if result.is_err() {
            return Err("Key not found".to_string());
        }

        if temp.eq("") {
            return Err("Key not found".to_string());
        }

        Ok(temp)
    }
}
