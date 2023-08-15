// import { exists, BaseDirectory } from '@tauri-apps/api/fs';
// if(exists(BaseDirectory.)) {
//   console.log('exists')}

import React from "react";
import sittlyDevtools from "./devtools/index";

// Plug the devtools when end testing
// const sittlyDevtools = window.SittlyDevtools

window.React = React;
// window.SittlyDevtools = SittlyDevtools;
window.SittlyDevtools = sittlyDevtools;

fetch(
  "https://raw.githubusercontent.com/JulianKominovic/sittly-emoji-extension/main/dist/compiled.js"
)
  .then((res) => res.text())
  .then((text) => {
    const script = document.createElement("script");
    script.innerHTML = text;
    // script.type = "module";
    document.querySelector("#init-script")?.append(script);
  });
