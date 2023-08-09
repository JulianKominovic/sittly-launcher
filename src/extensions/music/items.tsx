import { ExtensionItems } from "../../@devtools/types";
import {
  BsFastForward,
  BsPlay,
  BsRewind,
  BsVolumeDown,
  BsVolumeMute,
  BsVolumeUp,
} from "react-icons/bs";
import {
  nextMedia,
  playPause,
  prevMedia,
  setVolume,
} from "../../@devtools/api/music";
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
    },
    {
      title: "Play/Pause",
      description: "Play/pause music",
      icon: <BsPlay />,
      onClick: () => {
        playPause();
      },
      actionName: "Play/Pause",
    },
    {
      title: "Next",
      description: "Play next song",
      icon: <BsFastForward />,
      onClick: () => {
        nextMedia();
      },
      actionName: "Next",
    },
    {
      title: "Volume +5",
      description: "Increase volume by 5%",
      icon: <BsVolumeUp />,
      onClick: () => {
        setVolume("5%+");
      },
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
    },
    {
      title: "Mute",
      description: "Mute volume",
      icon: <BsVolumeMute />,
      onClick: () => {
        setVolume("0%");
      },
      actionName: "Mute",
    },
  ];
};

export default items;
