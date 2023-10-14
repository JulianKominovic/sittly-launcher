export type File = {
  base64: string;
  file_type: string;
  is_dir: boolean;
  last_modified: {
    secs_since_epoch: number;
  };
  name: string;
  path: string;
  size: number;
};
export type SystemApp = {
  name: string;
  icon?: string;
  execute: string;
  description: string;
};

export enum BatteryState {
  Unknown = 0,
  Charging = 1,
  Discharging = 2,
  Empty = 3,
  FullyCharged = 4,
  PendingCharge = 5,
  PendingDischarge = 6,
}
export enum BatteryType {
  Unknown = 0,
  LinePower = 1,
  Battery = 2,
  Ups = 3,
  Monitor = 4,
  Mouse = 5,
  Keyboard = 6,
  Pda = 7,
  Phone = 8,
}

export type BatteryDevice = {
  battery_state: BatteryState;
  battery_type: BatteryType;
  current_battery: number;
  full_battery: number;
  full_design_battery: number;
  is_rechargable: boolean;
  model: string;
  percentage: number;
  power_supply: boolean;
  temperature: number;
  vendor: string;
};
