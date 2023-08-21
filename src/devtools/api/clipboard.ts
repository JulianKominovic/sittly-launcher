import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { writeText, readText } from "@tauri-apps/api/clipboard";
import { sendNotification } from "./notifications";

export const pasteToCurrentWindow = async (
  text: string
  // typeOfClipboard?: "TEXT" | "IMAGE" | "HTML"
) => {
  await writeText(text);
  await appWindow.hide();
  const overflow = text.length > 20;
  await invoke("paste_to_current_window");
  sendNotification({
    title: "Paste to current window",
    body: `Paste ${text.slice(0, 20)}${overflow ? "..." : " "}to application`,
    icon: "edit-paste",
  });
};

export const copyToClipboard = async (text: string) => {
  await writeText(text);
  const overflow = text.length > 20;
  sendNotification({
    title: "Copied to clipboard",
    body: `Copied ${text.slice(0, 20)}${overflow ? "..." : " "}to clipboard`,
    icon: "edit-copy",
  });
};
export const readClipboard = readText;
