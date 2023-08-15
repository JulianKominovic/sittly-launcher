import uiExamplePages from "./ui-example/pages";
import extensionViewPages from "./extension-viewer/pages";
import musicItems from "./music/items";
import contextMenuNavigation from "./navigation/context";
import noResultNavigation from "./navigation/no-results";
import {
  ExtensionContextMenuItems,
  ExtensionItems,
  ExtensionNoResultItems,
  ExtensionPages,
} from "../devtools/types";

const extensions = (window as any).__SITTLY_EXTENSIONS__ ?? [];

export const pages = [uiExamplePages, extensionViewPages];
export const items = [musicItems];
export const contextMenuItems = [contextMenuNavigation];
export const noResultItems = [noResultNavigation];
console.log(extensions);
export const pagesImports = () =>
  pages.concat(
    extensions
      .filter((ext: any) => ext.pages)
      .map((ext: any) => ext.pages) as ExtensionPages
  );
export const itemsImports = () =>
  items.concat(
    extensions
      .filter((ext: any) => ext.items)
      .flatMap((ext: any) => ext.items) as ExtensionItems[]
  );
export const contextMenuItemsImports = () =>
  contextMenuItems.concat(
    extensions
      .filter((ext: any) => ext.context)
      .flatMap((ext: any) => ext.context) as ExtensionContextMenuItems[]
  );
export const noResultItemsImports = () =>
  noResultItems.concat(
    extensions
      .filter((ext: any) => ext.noResults)
      .flatMap((ext: any) => ext.noResults) as ExtensionNoResultItems[]
  );

/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
console.log(pagesImports());

export const mapExtensionsPages = () =>
  pagesImports().flatMap((page) => page.map((page: any) => page));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsItems = () =>
  itemsImports().flatMap((item) => item().map((item: any) => item));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsContextMenuItems = () =>
  contextMenuItemsImports().flatMap((item) => item().map((item: any) => item));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsNoResultItems = () =>
  noResultItemsImports().flatMap((item) => item().map((item) => item));

export const mapExtensionsMetadata = () =>
  extensions.map((ext: any) => ext.metadata);
