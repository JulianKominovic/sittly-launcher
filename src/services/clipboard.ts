import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { writeText, readText } from "@tauri-apps/api/clipboard";

export const pasteToCurrentWindow = async (
  text: string,
  typeOfClipboard?: "TEXT" | "IMAGE" | "HTML"
) => {
  await writeText(text);
  await appWindow.hide();
  invoke("paste_to_current_window");
};

export const copyToClipboard = writeText;
export const readClipboard = readText;
