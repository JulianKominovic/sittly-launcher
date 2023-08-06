import {
  BsFastForwardFill,
  BsMusicNote,
  BsPlayFill,
  BsRewindFill,
  BsVolumeDownFill,
  BsVolumeMuteFill,
  BsVolumeUpFill,
} from "react-icons/bs";
import { nextMedia, playPause, prevMedia, setVolume } from "../services/music";
import { BaseModule } from "./base";

export const musicModule = new BaseModule(
  "Music",
  "Listen to your favorite music",
  <BsMusicNote />
)
  .addItem({
    title: "Previous",
    description: "Play previous song",
    icon: <BsRewindFill />,
    onClick: () => {
      prevMedia();
    },
    actionName: "Previous",
  })
  .addItem({
    title: "Play/Pause",
    description: "Play/pause music",
    icon: <BsPlayFill />,
    onClick: () => {
      playPause();
    },
    actionName: "Play/Pause",
  })
  .addItem({
    title: "Next",
    description: "Play next song",
    icon: <BsFastForwardFill />,
    onClick: () => {
      nextMedia();
    },
    actionName: "Next",
  })
  .addItem({
    title: "Volume +5",
    description: "Increase volume by 5%",
    icon: <BsVolumeUpFill />,
    onClick: () => {
      setVolume("5%+");
    },
    actionName: "Volume +",
  })
  .addItem({
    title: "Volume -5",
    description: "Decrease volume by 5%",
    icon: <BsVolumeDownFill />,

    onClick: () => {
      setVolume("5%-");
    },
    actionName: "Volume -",
  })
  .addItem({
    title: "Mute",
    description: "Mute volume",
    icon: <BsVolumeMuteFill />,
    onClick: () => {
      setVolume("0%");
    },
    actionName: "Mute",
  });
