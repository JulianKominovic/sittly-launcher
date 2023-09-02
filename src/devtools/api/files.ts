import { save } from "@tauri-apps/api/dialog";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import { downloadDir } from "@tauri-apps/api/path";
import { sendNotification } from "./notifications";
import { fileTypeFromBuffer } from "file-type";
import { fetch, ResponseType } from "@tauri-apps/api/http";
import { notifyAsyncOperationStatus } from "./indicators";
import { invoke } from "@tauri-apps/api";
import { File } from "../../types/extension";
/**
 * Saves an image from a URL to user's disk and shows a notification
 * @example
 * saveImage("https://example.com/image.png")
 *
 */
export const saveImage = async (imageSrc: string) => {
  notifyAsyncOperationStatus({
    title: "Saving image",
    description: "wait a moment...",
    status: "IN_PROGRESS",
  });

  // Fetch the image as a blob
  let fileType = "";
  const { data: blob } = await fetch(imageSrc, {
    responseType: ResponseType.Binary,
    method: "GET",
  });

  const arrayBuffer = new Uint8Array(blob as any);
  fileType = (await fileTypeFromBuffer(arrayBuffer))?.ext || "";
  if (blob && fileType) {
    // Save into the default downloads directory, like in the browser
    const suggestedFilename = "image." + fileType;

    const filePath = await save({
      defaultPath: (await downloadDir()) + "/" + suggestedFilename,
    });

    if (filePath) {
      // Now we can write the file to the disk
      await writeBinaryFile(filePath, arrayBuffer);
      notifyAsyncOperationStatus({
        title: "Image saved",
        description: "The image has been saved to " + filePath,
        status: "SUCCESS",
      });
      return sendNotification({
        title: "Image saved",
        body: "The image has been saved to " + filePath,
        icon: "document-save",
      });
    }
  }

  notifyAsyncOperationStatus({
    title: "Failed to save image",
    description: "The image could not be saved",
    status: "ERROR",
  });
  return sendNotification({
    title: "Reading image failed",
    body: "The image could not be read",
    icon: "network-error",
  });
};

export async function findFiles({
  query,
  baseDir,
}: {
  query: string;
  baseDir: string;
  extension?: string[];
}) {
  notifyAsyncOperationStatus({
    title: "Searching files",
    description: "please wait...",
    status: "IN_PROGRESS",
  });
  const results = await invoke<File[]>("find_files", {
    query,
    baseDir,
  }).catch((err) => {
    console.log(err);

    notifyAsyncOperationStatus({
      title: "Files not found",
      description: "Search failed",
      status: "ERROR",
    });
    return [];
  });
  notifyAsyncOperationStatus({
    title: "Files found",
    description: "Search completed",
    status: "SUCCESS",
  });

  return results;
}

export function readFile({ path }: { path: string }) {
  return invoke<File>("read_file", {
    path,
    skipContent: false,
  });
}
