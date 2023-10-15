import { listen } from "@tauri-apps/api/event";
import { MusicServiceReturn } from "../devtools/types";

/**
 * Requires `playerctl` to be installed on the system
 */
export function registerMusicListener(
  callback: (payload: MusicServiceReturn) => void
) {
  const unlisten = listen("player_status", (event) => {
    const payload = event.payload as string;
    if (!payload) return;
    const [
      artist,
      album,
      title,
      remainingMillis,
      currentMillis,
      durationMillis,
      status,
    ] = payload.split("|-|").map((value) => value.trim().replace("\n", ""));

    callback({
      artist,
      album,
      title,
      remainingMillis: Number(remainingMillis),
      currentMillis: Number(currentMillis),
      durationMillis: Number(durationMillis),
      status: status as "Playing" | "Paused" | "Stopped",
    });
  });
  return unlisten;
}
