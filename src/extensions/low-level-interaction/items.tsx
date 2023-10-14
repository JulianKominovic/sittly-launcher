import { ExtensionItems, ListItem } from "../../devtools/types";
import {
  BsAppIndicator,
  BsBattery,
  BsBatteryCharging,
  BsBatteryHalf,
  BsBrightnessAltHighFill,
  BsBrightnessAltLowFill,
  BsBrightnessHigh,
  BsBrightnessLow,
  BsCpu,
  BsDpad,
  BsFastForward,
  BsKeyboard,
  BsLaptop,
  BsLightbulb,
  BsLightbulbFill,
  BsLightbulbOff,
  BsLightbulbOffFill,
  BsLightning,
  BsModem,
  BsMouse,
  BsOutlet,
  BsPcDisplayHorizontal,
  BsPhone,
  BsPlay,
  BsRewind,
  BsVolumeDown,
  BsVolumeMute,
  BsVolumeUp,
} from "react-icons/bs";
import sittlyDevtools from "../../devtools/index";

import React from "react";
import { BatteryState, BatteryType } from "@/devtools/types/models";

const { api } = sittlyDevtools;
const { system } = api;
const {
  setNightlightActive,
  brightnessDown,
  brightnessUp,
  setNightlightTemperature,
  getNightlightTemperature,
  getDevicesBattery,
  getSystemApps,
  openApp,
} = system;
const mappedSystemApps = getSystemApps().map((app) => {
  return {
    title: app.name,
    description: app.description,
    icon: app.icon ? <img src={app.icon} /> : <BsAppIndicator />,
    onClick: () => openApp(app.execute),
    mainActionLabel: "Open app",
  } as ListItem;
});
const batteryDevices = await getDevicesBattery();
console.log(batteryDevices);
const mappedBatteryDevices = batteryDevices.map((device) => {
  console.log(device);
  const percentage = `${device.percentage}% ${
    "■".repeat(Math.floor(device.percentage / 10)) +
    "□".repeat(10 - Math.floor(device.percentage / 10))
  }`;
  const batteryHealth =
    device.full_battery && device.full_design_battery
      ? `Battery health ${Math.round(
          (device.full_battery / device.full_design_battery) * 100
        )}%`
      : "";

  return {
    title: device.model ?? device.vendor,

    description: percentage,
    icon:
      device.battery_type === BatteryType.Battery ? (
        <BsLaptop />
      ) : device.battery_type === BatteryType.LinePower ? (
        <BsOutlet />
      ) : device.battery_type === BatteryType.Keyboard ? (
        <BsKeyboard />
      ) : device.battery_type === BatteryType.Monitor ? (
        <BsPcDisplayHorizontal />
      ) : device.battery_type === BatteryType.Mouse ? (
        <BsMouse />
      ) : device.battery_type === BatteryType.Pda ? (
        <BsDpad />
      ) : device.battery_type === BatteryType.Phone ? (
        <BsPhone />
      ) : device.battery_type === BatteryType.Ups ? (
        <BsModem />
      ) : (
        <BsCpu />
      ),
    rightIcon: (
      <span className="inline-block whitespace-nowrap">
        {batteryHealth}
        {device.battery_state === BatteryState.Charging ? (
          <BsBatteryCharging className="inline-block ml-2" />
        ) : (
          <BsBatteryHalf className="inline-block ml-2" />
        )}
      </span>
    ),
    onClick: () => openApp("gnome-power-statistics"),
    mainActionLabel: "Open power statistics",
  } as ListItem;
});

const items: ExtensionItems = () => {
  return [
    {
      title: "Brightness up",
      description: "Increase brightness by 5%",
      icon: <BsBrightnessHigh />,
      onClick: brightnessUp,
    },
    {
      title: "Brightness down",
      description: "Decrease brightness by 5%",
      icon: <BsBrightnessLow />,
      onClick: brightnessDown,
    },
    {
      title: "Activate nightlight",
      description: "Take care of your eyes",
      icon: <BsLightbulb />,
      onClick: () => {
        setNightlightActive(true);
      },
    },
    {
      title: "Nightlight temperature up",
      description: "Increase nightlight temperature by 100K",
      icon: <BsBrightnessAltHighFill />,
      onClick: () => {
        getNightlightTemperature().then((temperature) => {
          setNightlightTemperature(temperature + 100);
        });
      },
    },
    {
      title: "Nightlight temperature down",
      description: "Decrease nightlight temperature by 100K",
      icon: <BsBrightnessAltLowFill />,
      onClick: () => {
        getNightlightTemperature().then((temperature) => {
          setNightlightTemperature(temperature - 100);
        });
      },
    },
    {
      title: "Deactivate nightlight",
      description: "Cool blue light",
      icon: <BsLightbulbOff />,
      onClick: () => {
        setNightlightActive(false);
      },
    },
    ...mappedBatteryDevices,
    ...mappedSystemApps,
    // {
    //   title: "Previous",
    //   description: "Play previous song",
    //   icon: <BsRewind />,
    //   onClick: () => {
    //     prevMedia();
    //   },
    //   actionName: "Previous",
    //   mainActionLabel: "Previous",
    // },
    // {
    //   title: "Play/Pause",
    //   description: "Play/pause music",
    //   icon: <BsPlay />,
    //   onClick: () => {
    //     playPause();
    //   },
    //   actionName: "Play/Pause",
    //   mainActionLabel: "Play/Pause",
    // },
    // {
    //   title: "Next",
    //   description: "Play next song",
    //   icon: <BsFastForward />,
    //   onClick: () => {
    //     nextMedia();
    //   },
    //   mainActionLabel: "Next",
    //   actionName: "Next",
    // },
    // {
    //   title: "Volume +5",
    //   description: "Increase volume by 5%",
    //   icon: <BsVolumeUp />,
    //   onClick: () => {
    //     setVolume("5%+");
    //   },
    //   mainActionLabel: "Volume +5",
    //   actionName: "Volume +",
    // },
    // {
    //   title: "Volume -5",
    //   description: "Decrease volume by 5%",
    //   icon: <BsVolumeDown />,

    //   onClick: () => {
    //     setVolume("5%-");
    //   },
    //   actionName: "Volume -",
    //   mainActionLabel: "Volume -5",
    // },
    // {
    //   title: "Mute",
    //   description: "Mute volume",
    //   icon: <BsVolumeMute />,
    //   onClick: () => {
    //     setVolume("0%");
    //   },
    //   actionName: "Mute",
    //   mainActionLabel: "Mute",
    // },
  ];
};

export default items;
