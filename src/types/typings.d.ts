import {
  ExtensionContextMenuItems,
  ExtensionItems,
  ExtensionMetadata,
  ExtensionNoResultItems,
  ExtensionPages,
} from "../devtools/types";
import sittlyDevtools from "../devtools";
import { SystemApp } from "@/devtools/types/models";

declare global {
  interface Window {
    __SITTLY_EXTENSIONS__: {
      pages?: ExtensionPages;
      items?: ExtensionItems;
      context?: ExtensionContextMenuItems;
      noResults?: ExtensionNoResultItems;
      metadata: ExtensionMetadata;
    }[];
    extensionsLoaded: Promise<void>;
    React: any;
    SittlyDevtools: typeof sittlyDevtools;
    systemApps: SystemApp[];
  }
}

export {};
