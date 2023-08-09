import { create } from "zustand";
import { MusicServiceReturn } from "../../services/music";
import { ListItem } from "../types";

type ContextTypes = {
  music: MusicServiceReturn;
  /**
   * @IMPORTANT Internal use only. Do not use this function.
   */
  setMusic: (music: MusicServiceReturn) => void;
  contextMenuOptions: ListItem[];
  setContextMenuOptions: (contextMenuOptions: ListItem[]) => void;
  isContextMenuOpen: boolean;
  /**
   * @IMPORTANT Internal use only. Do not use this function.
   */
  setContextMenuIsOpen: (contextMenuIsOpen: boolean) => void;
  searchbarText: string;
  setSearchbarText: (searchbarText: string) => void;
  /**
   * @IMPORTANT Internal use only. Do not use this function.
   */
  setInitialContextMenuOptions: (initialContextMenuOptions: ListItem[]) => void;
  initialContextMenuOptions: ListItem[];
};

const useServices = create<ContextTypes>((set, get) => ({
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
    set({
      contextMenuOptions: contextMenuOptions.concat(
        get().initialContextMenuOptions
      ),
    }),
  isContextMenuOpen: false,
  setContextMenuIsOpen: (isContextMenuOpen: boolean) =>
    set({ isContextMenuOpen }),
  searchbarText: "",
  setSearchbarText: (searchbarText: string) => set({ searchbarText }),
  setInitialContextMenuOptions: (initialContextMenuOptions: any) =>
    set({
      initialContextMenuOptions,
      contextMenuOptions: initialContextMenuOptions,
    }),
  initialContextMenuOptions: [],
}));

export { useServices };
