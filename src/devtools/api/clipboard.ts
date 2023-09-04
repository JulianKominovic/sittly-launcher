import { invoke } from "@tauri-apps/api";
import { writeText, readText } from "@tauri-apps/api/clipboard";
import { sendNotification } from "./notifications";
import { hideApp } from "./app";

export const pasteToCurrentWindow = async (content: string) => {
  await writeText(content);
  await pasteClipboardToCurrentWindow();
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
export const pasteClipboardToCurrentWindow = async () => {
  await hideApp();
  await new Promise((resolve) => setTimeout(resolve, 100));
  await invoke("paste_to_current_window");
};
export const copyImageToClipboard = async (
  imageLocalPathOrInternetURL: string
) => {
  await invoke("copy_image_to_clipboard", {
    path: imageLocalPathOrInternetURL,
  });
  const overflow = imageLocalPathOrInternetURL.length > 20;
  sendNotification({
    title: "Copied",
    body: `image from ${imageLocalPathOrInternetURL.slice(0, 20)}${
      overflow ? "..." : " "
    }to clipboard`,
    icon: "edit-copy",
  });
};
export const readClipboard = readText;
