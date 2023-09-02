import uiExamplePages from "./ui-example/pages";
import extensionViewPages from "./extension-viewer/pages";
import musicItems from "./music/items";
import contextMenuNavigation from "./navigation/context";
import noResultNavigation from "./navigation/no-results";
import storePage from "./store/page";
import filesPage from "./find-files/page";
import {
  ExtensionContextMenuItems,
  ExtensionItems,
  ExtensionMetadata,
  ExtensionNoResultItems,
  ExtensionPages,
} from "../devtools/types";
import { createDir, removeDir, writeFile } from "@tauri-apps/api/fs";
import { join, homeDir } from "@tauri-apps/api/path";

const extensions = (window as any).__SITTLY_EXTENSIONS__ ?? [];

export const pages = [uiExamplePages, extensionViewPages, storePage, filesPage];
export const items = [musicItems];
export const contextMenuItems = [contextMenuNavigation];
export const noResultItems = [noResultNavigation];

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

export async function downloadExtension(githubRepoUrl: string) {
  const Url = new URL(githubRepoUrl);
  const [_, username, repo] = Url.pathname.split("/");
  const rawGithubFile = `https://raw.githubusercontent.com/${username}/${repo}/main/dist/compiled.js`;
  const home = await homeDir();
  const sittlyExtensionsPath = await join(
    home,
    ".sittly",
    "extensions",
    repo,
    "dist"
  );
  const sittlyExtensionsPathDistFile = await join(
    sittlyExtensionsPath,
    "compiled.js"
  );

  const response = await fetch(rawGithubFile).then((res) => res.text());
  await createDir(sittlyExtensionsPath, { recursive: true }).catch((err) =>
    console.log(err)
  );
  await writeFile(sittlyExtensionsPathDistFile, response).catch((err) =>
    console.log(err)
  );
}

export function listExtensions() {
  return window.__SITTLY_EXTENSIONS__.map((ext) => ext.metadata);
}

export async function deleteExtension(extension: ExtensionMetadata) {
  const home = await homeDir();
  const Url = new URL(extension.repoUrl);
  const [_, _username, repo] = Url.pathname.split("/");
  const sittlyExtensionsPath = await join(home, ".sittly", "extensions", repo);

  await removeDir(sittlyExtensionsPath, {
    recursive: true,
  }).catch((err) => console.log(err));
}
