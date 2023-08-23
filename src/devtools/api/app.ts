import { appWindow } from "@tauri-apps/api/window";

/**
 * Quit the app. Kill the process.
 */
export function quitApp() {
  return appWindow.close();
}
/**
 * Hide the app. Keep the process running in background. User can open it again by pressing `Ctrl+Alt+K`
 */
export function hideApp() {
  return appWindow.hide();
}
/**
 *  Show the app.
 */
export function showApp() {
  return appWindow.show();
}

/**
 * Center the app.
 */
export function centerApp() {
  return appWindow.center();
}
