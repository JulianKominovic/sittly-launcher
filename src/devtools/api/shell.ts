import { invoke } from "@tauri-apps/api";
import { createDir, writeBinaryFile } from "@tauri-apps/api/fs";
import { fetch, ResponseType } from "@tauri-apps/api/http";
import { open } from "@tauri-apps/api/shell";
import { fileTypeFromBuffer } from "file-type";
import { sendNotification } from "./notifications";
import { homeDir, join } from "@tauri-apps/api/path";
import { notifyAsyncOperationStatus } from "./indicators";

/**
 *
 * Shell are the APIs that allow you to interact with the desktop env.
 */

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
 * setWallpaper('https://fffuel.co/images/dddepth-preview/dddepth-353.jpg')
 */
export const setWallpaper = async (path: string): Promise<void> => {
  notifyAsyncOperationStatus({
    title: "Setting wallpaper",
    description: "wait a moment...",
    status: "IN_PROGRESS",
  });
  if (path.startsWith("http") || path.startsWith("https")) {
    // Fetch the image as a blob
    let fileType = "";
    const { data: blob } = await fetch(path, {
      responseType: ResponseType.Binary,
      method: "GET",
    });

    const arrayBuffer = new Uint8Array(blob as any);
    fileType = (await fileTypeFromBuffer(arrayBuffer))?.ext || "";
    if (blob && fileType) {
      // Save into the default downloads directory, like in the browser
      const suggestedFilename = path.replaceAll("/", "_");
      const baseTempPath = await join(await homeDir(), ".sittly", "temp");
      await createDir(baseTempPath, {
        recursive: true,
      });
      const tempAssetsPathFile = await join(baseTempPath, suggestedFilename);
      // Now we can write the file to the disk
      await writeBinaryFile(tempAssetsPathFile, arrayBuffer);
      await invoke("set_wallpaper", { path: tempAssetsPathFile });
      notifyAsyncOperationStatus({
        title: "Wallpaper set",
        description: "enjoy your new wallpaper!",
        status: "SUCCESS",
      });
      return sendNotification({
        title: "Wallpaper set",
        icon: "image-x-generic",
      });
    }

    notifyAsyncOperationStatus({
      title: "Error",
      description: "we could not set the wallpaper",
      status: "ERROR",
    });
    return sendNotification({
      title: "Reading image failed",
      body: "The image could not be read",
      icon: "image-missing",
    });
  } else {
    await invoke("set_wallpaper", { path });
    notifyAsyncOperationStatus({
      title: "Wallpaper set",
      description: "enjoy your new wallpaper!",
      status: "SUCCESS",
    });
  }
};

export function getSelectedText() {
  return invoke<string>("get_selected_text");
}
