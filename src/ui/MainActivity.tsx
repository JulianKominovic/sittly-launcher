import {
  BsFastForwardFill,
  BsMusicNote,
  BsPlayFill,
  BsRewindFill,
} from "react-icons/bs";
import { useServices } from "../services";
import { nextMedia, playPause, prevMedia } from "../services/music";
import { SittlyCommand } from "./shadcn/ui/own_command";

export default function () {
  const music = useServices((state) => state.music);
  if (music.status !== "Stopped")
    return (
      <SittlyCommand.Item
        id="music-widget"
        className="py-12"
        onClick={() => {
          playPause();
        }}
      >
        <div className="flex items-center w-full gap-4">
          <main className="flex items-center justify-center text-xl rounded-lg w-14 h-14 aspect-square bg-neutral-200">
            <BsMusicNote />
          </main>
          <section>
            <p className="font-semibold truncate ">{music.title}</p>
            <p className="truncate text-slate-500">{music.artist}</p>
          </section>
          <div className="flex items-center gap-4 ml-auto">
            <button
              className="rounded-[50%] p-1 bg-neutral-300 flex justify-center items-center text-lg w-6 h-6 aspect-square"
              onClick={() => prevMedia()}
            >
              <BsRewindFill />
            </button>

            <button
              className="rounded-[50%] p-1 bg-neutral-300 flex justify-center items-center text-xl w-10 h-10 aspect-square"
              onClick={() => playPause()}
            >
              <BsPlayFill />
            </button>
            <button
              className="rounded-[50%] p-1 bg-neutral-300 flex justify-center items-center text-lg w-6 h-6 aspect-square"
              onClick={() => nextMedia()}
            >
              <BsFastForwardFill />
            </button>
          </div>
        </div>
      </SittlyCommand.Item>
    );
  return null;
}
