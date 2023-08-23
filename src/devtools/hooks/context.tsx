import { create } from "zustand";
import { MusicServiceReturn } from "../types";
import { ListItem } from "../types";
import { AsyncStatusEvent } from "../types/events";
type ContextTypes = {
  music: MusicServiceReturn;
  /**
   * @IMPORTANT Internal use only. Do not use this function.
   * @deprecated
   */
  setMusic: (music: MusicServiceReturn) => void;
  contextMenuOptions: ListItem[];
  setContextMenuOptions: (contextMenuOptions: ListItem[]) => void;
  isContextMenuOpen: boolean;
  /**
   * @IMPORTANT Internal use only. Do not use this function.
   * @deprecated
   */
  setContextMenuIsOpen: (contextMenuIsOpen: boolean) => void;
  searchbarText: string;
  setSearchbarText: (searchbarText: string) => void;
  /**
   * @IMPORTANT Internal use only. Do not use this function.
   * @deprecated
   */
  setInitialContextMenuOptions: (initialContextMenuOptions: ListItem[]) => void;
  initialContextMenuOptions: ListItem[];
  asyncOperation: AsyncStatusEvent;
  setAsyncOperation: (asyncOperation: AsyncStatusEvent) => void;
  /**
   * @IMPORTANT Internal use only. Do not use this.
   * @deprecated
   */
  asyncOpTimeoutId: NodeJS.Timeout;
  /**
   * @IMPORTANT Internal use only. Do not use this function.
   * @deprecated
   */
  setAsyncOpTimeoutId: (asyncOpTimeoutId: number) => void;
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
  asyncOperation: {
    title: "",
    status: "IDLE",
    description: "",
  },
  asyncOpTimeoutId: 0 as unknown as NodeJS.Timeout,
  setAsyncOpTimeoutId: (asyncOpTimeoutId: number) =>
    set({ asyncOpTimeoutId: asyncOpTimeoutId as unknown as NodeJS.Timeout }),

  setAsyncOperation: (asyncOperation: AsyncStatusEvent) => {
    if (asyncOperation.status === "IN_PROGRESS") return set({ asyncOperation });
    clearTimeout(get().asyncOpTimeoutId);
    const timeoutId = setTimeout(() => {
      set({ asyncOperation: { title: "", status: "IDLE", description: "" } });
    }, 3000);
    set({ asyncOperation, asyncOpTimeoutId: timeoutId });
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
