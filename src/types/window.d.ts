import { exposed } from "../../preload";

declare global {
  interface Window {
    electronAPI: typeof exposed;
  }
}

window.MyNamespace = window.MyNamespace || {};
