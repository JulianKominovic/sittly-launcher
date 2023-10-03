pub mod database {
    use jammdb::{Error, DB};
    use tauri::api::path::home_dir;
    fn build_sittly_db_directory() -> std::path::PathBuf {
        let mut path = home_dir().unwrap();
        path.push(".sittly");
        path.push("db");
        path
    }
    fn open_database() -> DB {
        DB::open(build_sittly_db_directory()).unwrap()
    }
    pub fn write(database: String, key: String, value: String) -> Result<(), Error> {
        let db = open_database();
        let try_tx = db.tx(true);
        let tx = try_tx?;
        let bucket = tx.get_or_create_bucket(database)?;
        let _ = bucket.put(key, value);

        tx.commit()?;
        Ok(())
    }
    pub fn read(database: String, key: String) -> Result<String, Error> {
        let db = open_database();
        let tx = db.tx(false)?;
        let bucket = tx.get_bucket(database)?;
        let op_result = bucket.get(key).unwrap();
        let op_result_string = String::from_utf8(op_result.kv().value().to_vec()).unwrap();
        Ok(op_result_string)
    }
}
