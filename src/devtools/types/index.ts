import React, { ReactNode } from "react";

type ExtensionPage = {
  route: `/${string}`;
  component: ReactNode | Element | (() => React.JSX.Element);
  name: string;
  description: string;
  icon: ReactNode;
};

export type ExtensionPages = ExtensionPage[];
export type ExtensionItems = () => ListItem[];
export type ExtensionNoResultItems = () => ListItem[];
export type ExtensionContextMenuItems = () => ListItem[];
export type ExtensionMetadata = {
  name: string;
  description: string;
  icon: ReactNode;
  repoUrl: string;
};

export type ListItem = {
  /**
   * The title of the item
   *
   * Ignore this prop if you are using `customChildren`
   */
  title?: string;
  /**
   * The description of the item
   *
   * Ignore this prop if you are using `customChildren`
   */
  description?: string;
  /**
   * The icon of the item
   *
   * Ignore this prop if you are using `customChildren`
   */
  icon?: React.ReactNode;
  /**
   * When the item is clicked or selected via keyboard
   *
   */
  onClick: () => void;
  /**
   * If you want to use a custom component as the item
   *
   * If you are using this prop, you should ignore `title`, `description` and `icon`. They won't work.
   *
   * I encourage you to use `filteringText` if you are using this prop because search bar won't work unless you have text inside the `customChildren`
   */
  customChildren?: React.ReactNode;
  /**
   * The class name will be passed to button element
   */
  className?: string;
  /**
   * When the item is highlighted via keyboard or mouse hover.
   *
   */
  onHighlight?: () => void;
  /**
   * In case you want to specify a filtering text that is different from the title, description or `customChildren`.
   *
   * If you are using `customChildren`, you should use this prop.
   *
   * This prop is used for filtering the items when the user types in the search bar
   */
  filteringText?: string;
  /**
   * Controls when items will be displayed
   */
  show?: boolean;
};

export type MusicServiceReturn = {
  artist: string;
  album: string;
  title: string;
  remainingMillis: number;
  currentMillis: number;
  durationMillis: number;
  status: "Playing" | "Paused" | "Stopped";
};

export type ContextTypes = {
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
