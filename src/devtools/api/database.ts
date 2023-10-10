import { invoke } from "@tauri-apps/api";

export const write = (
  key: string,
  value: Record<any, any> | any[]
): Promise<string | void> => {
  return invoke<string | void>("write_database", {
    key,
    value: JSON.stringify(value),
  });
};

export const read = <T extends Record<any, any> | any[] | void>(
  key: string
): Promise<T> => {
  return invoke<string>("read_database", {
    key,
  }).then((value) => (value ? JSON.parse(value) : value));
};
