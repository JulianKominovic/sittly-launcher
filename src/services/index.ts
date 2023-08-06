import React from "react";
import { create } from "zustand";
import { AuxActions } from "../types/extensions";
import { MusicServiceReturn } from "./music";

type ContextTypes = {
  music: MusicServiceReturn;
  setMusic: (music: MusicServiceReturn) => void;
  contextMenuOptions: AuxActions[];
  setContextMenuOptions: (contextMenuOptions: AuxActions[]) => void;
  contextMenuIsOpen: boolean;
  setContextMenuIsOpen: (contextMenuIsOpen: boolean) => void;
  // notification: { message: string; status: "Success" | "Fail" | "InProgress" };
  // notify: (
  //   notification: {
  //     message: string;
  //     status: "Success" | "Fail" | "InProgress";
  //   },
  //   timeout: number
  // ) => void;
};

const useServices = create<ContextTypes>((set) => ({
  music: {
    title: "",
    artist: "",
    album: "",
    remainingMillis: 0,
    currentMillis: 0,
    durationMillis: 0,
    status: "Stopped",
  },
  setMusic: (music: MusicServiceReturn) => set({ music }),
  contextMenuOptions: [],
  setContextMenuOptions: (contextMenuOptions: any) =>
    set({ contextMenuOptions }),
  contextMenuIsOpen: false,
  setContextMenuIsOpen: (contextMenuIsOpen: boolean) =>
    set({ contextMenuIsOpen }),
  // notify: (notification, timeout = 3000) => {
  //   set({ notification });
  //   setTimeout(
  //     () => set({ notification: { message: "", status: "InProgress" } }),
  //     timeout
  //   );
  // },
  // notification: { message: "", status: "InProgress" },
}));

export { useServices };
