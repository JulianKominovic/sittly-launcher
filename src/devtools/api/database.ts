import { invoke } from "@tauri-apps/api";

export const write = (
  database: string,
  key: string,
  value: Record<any, any> | any[]
): Promise<string | void> => {
  return invoke<string | void>("write_database", {
    database,
    key,
    value: JSON.stringify(value),
  });
};

export const read = (
  database: string,
  key: string
): Promise<Record<any, any> | any[] | void> => {
  return invoke<string>("read_database", {
    database,
    key,
  }).then((value) => (value ? JSON.parse(value) : value));
};
