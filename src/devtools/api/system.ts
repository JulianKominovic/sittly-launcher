import { invoke } from "@tauri-apps/api";
import { SystemApp } from "../types/models";

export async function setNightlightActive(status: boolean) {
  return invoke<void>("set_nightlight", {
    status,
  });
}
/**
 * Minimum temperature is 1700K, maximum is 4700K
 * @param temperature 1700 - 4700
 * @returns
 */
export async function setNightlightTemperature(temperature: number) {
  const MAX = 4700;
  const MIN = 1700;
  if (temperature > MAX) temperature = MAX;
  if (temperature < MIN) temperature = MIN;
  return invoke<void>("set_temperature", {
    temperature,
  });
}
export async function getNightlightTemperature() {
  return invoke<number>("get_temperature");
}

export async function brightnessUp() {
  return invoke<void>("brightness_up");
}

export async function brightnessDown() {
  return invoke<void>("brightness_down");
}

export function getSystemApps(): SystemApp[] {
  return (window as any).systemApps as SystemApp[];
}

export async function getDevicesBattery() {
  const a = await invoke<any>("get_devices_battery");
  console.log(a);
}
