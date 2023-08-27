import { invoke } from "@tauri-apps/api";
import { writeText, readText } from "@tauri-apps/api/clipboard";
import { sendNotification } from "./notifications";
import { hideApp } from "./app";

export const pasteToCurrentWindow = async (
  text: string
  // typeOfClipboard?: "TEXT" | "IMAGE" | "HTML"
) => {
  await writeText(text);
  await hideApp();
  await new Promise((resolve) => setTimeout(resolve, 100));
  await invoke("paste_to_current_window");
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
