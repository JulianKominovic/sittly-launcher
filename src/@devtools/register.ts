import {
  ExtensionPages,
  ExtensionContextMenuItems,
  ExtensionItems,
  ExtensionMetadata,
  ExtensionNoResultItems,
} from "./types";

export default (extension: {
  pages?: ExtensionPages;
  items?: ExtensionItems;
  context?: ExtensionContextMenuItems;
  noResults?: ExtensionNoResultItems;
  metadata: ExtensionMetadata;
}) => {
  (window as any).__SITTLY_EXTENSIONS__.push(extension);
};
