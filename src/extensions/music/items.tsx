import { ExtensionItems } from "../../devtools/types";
import {
  BsFastForward,
  BsPlay,
  BsRewind,
  BsVolumeDown,
  BsVolumeMute,
  BsVolumeUp,
} from "react-icons/bs";
import sittlyDevtools from "../../devtools/index";

import React from "react";

const { api } = sittlyDevtools;
const { music } = api;
const { nextMedia, playPause, prevMedia, setVolume } = music;
const items: ExtensionItems = () => {
  return [
    {
      title: "Previous",
      description: "Play previous song",
      icon: <BsRewind />,
      onClick: () => {
        prevMedia();
      },
      actionName: "Previous",
      mainActionLabel: "Previous",
    },
    {
      title: "Play/Pause",
      description: "Play/pause music",
      icon: <BsPlay />,
      onClick: () => {
        playPause();
      },
      actionName: "Play/Pause",
      mainActionLabel: "Play/Pause",
    },
    {
      title: "Next",
      description: "Play next song",
      icon: <BsFastForward />,
      onClick: () => {
        nextMedia();
      },
      mainActionLabel: "Next",
      actionName: "Next",
    },
    {
      title: "Volume +5",
      description: "Increase volume by 5%",
      icon: <BsVolumeUp />,
      onClick: () => {
        setVolume("5%+");
      },
      mainActionLabel: "Volume +5",
      actionName: "Volume +",
    },
    {
      title: "Volume -5",
      description: "Decrease volume by 5%",
      icon: <BsVolumeDown />,

      onClick: () => {
        setVolume("5%-");
      },
      actionName: "Volume -",
      mainActionLabel: "Volume -5",
    },
    {
      title: "Mute",
      description: "Mute volume",
      icon: <BsVolumeMute />,
      onClick: () => {
        setVolume("0%");
      },
      actionName: "Mute",
      mainActionLabel: "Mute",
    },
  ];
};

export default items;
