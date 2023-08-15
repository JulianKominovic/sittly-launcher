import React from "react";
import sittlyDevtools from "./devtools/index";
import { createDir, readDir, readTextFile } from "@tauri-apps/api/fs";
import { join, homeDir } from "@tauri-apps/api/path";

async function initLoad() {
  // Plug the devtools when end testing
  // const sittlyDevtools = window.SittlyDevtools

  window.React = React;
  // window.SittlyDevtools = SittlyDevtools;
  window.SittlyDevtools = sittlyDevtools;

  // EXPOSED REACT AND DEVTOOLS TO THE WINDOW OBJECT

  const home = await homeDir();
  const sittlyPath = await join(home, ".sittly");
  const sittlyExtensionsPath = await join(home, ".sittly", "extensions");

  await createDir(sittlyExtensionsPath, {
    recursive: true,
  }).catch((err) => console.log(err));

  const sittlyExtensions = await readDir(sittlyExtensionsPath);
  const thisScript = document.querySelector("#init-script");
  (await Promise.allSettled(
    sittlyExtensions.map(async (extension) => {
      const extensionFile = await join(extension.path, "compiled.js");
      const fileContent = await readTextFile(extensionFile);
      const script = document.createElement("script");
      script.innerHTML = fileContent;
      script.async = false;
      (thisScript as HTMLScriptElement).after(script);
      console.log("Extension loaded: ", extension.name);
    })
  )) as any;
  console.log("SCRIPTS INJECTED SUCCESSFULLY");
}

window.extensionsLoaded = initLoad();

// fetch(
//   "https://raw.githubusercontent.com/JulianKominovic/sittly-emoji-extension/main/dist/compiled.js"
// )
//   .then((res) => res.text())
//   .then((text) => {
//     const script = document.createElement("script");
//     script.innerHTML = text;
//     // script.type = "module";
//     document.querySelector("#init-script")?.append(script);
//   });
