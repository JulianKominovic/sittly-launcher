import React, { useEffect } from "react";
import {
  BsPlayFill,
  BsFillFastForwardFill,
  BsFillRewindFill,
} from "react-icons/bs";

type MusicProps = {
  name: string;
  artist: string;
  currentSeconds: number;
  totalSeconds: number;
  onSlide: (value: number) => void;
  onPlayPause: () => void;
};

const Music = ({
  artist,
  name,
  currentSeconds,
  totalSeconds,
  onSlide,
  onPlayPause,
}: MusicProps) => {
  const currentSongTime = new Date(currentSeconds * 1000)
    .toISOString()
    .substr(14, 5);
  const remainingSongTime = new Date(totalSeconds * 1000)
    .toISOString()
    .substr(14, 5);

  return (
    <div className="space-y-2">
      <header>
        <h2 className="text-neutral-100">{name}</h2>
        <p className="text-neutral-400">{artist}</p>
      </header>
      <section className="flex items-center gap-4 text-neutral-100">
        <p>{currentSongTime}</p>
        <input
          type="range"
          value={currentSeconds}
          min="0"
          max={totalSeconds}
          readOnly
          className="w-full"
          onChange={(e) => onSlide(+e.target.value)}
        />
        <p>{remainingSongTime}</p>
      </section>
      <footer>
        <div className="flex justify-center w-full gap-4">
          <button className="text-neutral-100">
            <BsFillRewindFill />
          </button>
          <button className="text-4xl text-neutral-100" onClick={onPlayPause}>
            <BsPlayFill />
          </button>
          <button className="text-neutral-100">
            <BsFillFastForwardFill />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Music;
