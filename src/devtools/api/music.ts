import { invoke } from "@tauri-apps/api";

export const playPause = () => invoke("play_pause_music");
export const prevMedia = () => invoke("previous_media");
export const nextMedia = () => invoke("next_media");
/**
 *  Set the volume of the player
 * @example
 * setVolume("50%") // 50%
 *
 * @example
 * setVolume("10%-") // -10% based on current volume
 *
 * @example
 * setVolume("10%+") // +10% based on current volume
 */
export const setVolume = (volume: string) => {
  invoke("set_volume", { volume });
};
