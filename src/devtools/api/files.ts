import { save } from "@tauri-apps/api/dialog";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import { downloadDir } from "@tauri-apps/api/path";
import { sendNotification } from "./notifications";
import { fileTypeFromBuffer } from "file-type";
import { fetch, ResponseType } from "@tauri-apps/api/http";

/**
 * Saves an image from a URL to user's disk and shows a notification
 * @example
 * saveImage("https://example.com/image.png")
 *
 */
export const saveImage = async (imageSrc: string) => {
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
      return sendNotification({
        title: "Image saved",
        body: "The image has been saved to " + filePath,
        icon: "document-save",
      });
    }
  }

  return sendNotification({
    title: "Reading image failed",
    body: "The image could not be read",
    icon: "network-error",
  });
};
