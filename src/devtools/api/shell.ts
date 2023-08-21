import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/shell";
/**
 * Open any URI using the default app
@example // opens the given URL on the default browser:
await open('https://github.com/tauri-apps/tauri');
@example // opens the given URL using `firefox`:
await open('https://github.com/tauri-apps/tauri', 'firefox');
@example // opens a file using the default program:
await open('/path/to/file');
 */
export const openURI = (path: string, openWith?: string): Promise<void> =>
  open(path, openWith);
/**
 * Set the wallpaper given a path
 * @example
 * setWallpaper('/home/tauri/Pictures/wallpaper.png')
 */
export const setWallpaper = (path: string): Promise<void> =>
  invoke("set_wallpaper", { path });
