import os from "os";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
const mobile =
  process.env.TAURI_PLATFORM === "android" ||
  process.env.TAURI_PLATFORM === "ios";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    cors: false,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: "chrome105",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    modulePreload: false,
  },
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ext": path.resolve(__dirname, "./src/extensions"),
      "@extensions": path.relative(
        __dirname,
        path.join(os.homedir(), ".sittly", "extensions")
      ),
    },
  },
}));
