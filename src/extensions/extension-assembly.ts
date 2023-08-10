import {
  ExtensionContextMenuItems,
  ExtensionItems,
  ExtensionNoResultItems,
  ExtensionPages,
} from "../@devtools/types";

const localStorageExtensionString = localStorage.getItem("extensions");
const localStorageExtensions: string[] = localStorageExtensionString
  ? JSON.parse(localStorageExtensionString)
  : [];

const makeImport = (path: string) => {
  return fetch(path)
    .then((res) => {
      if (!res.ok) return null;
      return res.text();
    })
    .then((text) => {
      if (!text) return null;
      const blob = new Blob([text], { type: "text/javascript" });
      return URL.createObjectURL(blob);
    })
    .catch((err) => {
      console.error(err);
      return null;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
};

function githubUrlToRawUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const [user, repo] = urlObj.pathname.split("/").filter(Boolean);
    urlObj.pathname = `${user}/${repo}/main/dist/compiled.js`;
    return `https://raw.githubusercontent.com${urlObj.pathname}`;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function tryImport(path: string) {
  try {
    return import(path);
  } catch (err) {
    console.error(err);
    return null;
  }
}

const remoteImports: {
  pages: ExtensionPages;
  items: ExtensionItems;
  context: ExtensionContextMenuItems;
  noResults: ExtensionNoResultItems;
}[] = await Promise.all(
  localStorageExtensions.map(async (url: string) => {
    const compiledExtensionUrl = githubUrlToRawUrl(url);
    if (!compiledExtensionUrl) return null;
    const builtImport = await makeImport(compiledExtensionUrl);
    if (!builtImport) return null;
    return await tryImport(builtImport);
  })
);

const filteredRemoteImports = remoteImports.filter(Boolean);

const remotePages = filteredRemoteImports.map((imported) => imported.pages);
const remoteItems = filteredRemoteImports.map((imported) => imported.items);
const remoteContextMenuItems = filteredRemoteImports.map(
  (imported) => imported.context
);
const remoteNoResultItems = filteredRemoteImports.map(
  (imported) => imported.noResults
);

export const pages = [
  tryImport("./ui-example/pages"),
  tryImport("./extension-viewer/pages"),
];
export const items = [tryImport("./music/items")];
export const contextMenuItems = [tryImport("./navigation/context")];
export const noResultItems = [tryImport("./navigation/no-results")];

export const pagesImports = (await Promise.all(pages))
  .concat(remotePages.map((page) => ({ default: page })))
  .filter((page) => page.default);
export const itemsImports = (await Promise.all(items))
  .concat(remoteItems.map((page) => ({ default: page })))
  .filter((page) => page.default);
export const contextMenuItemsImports = (await Promise.all(contextMenuItems))
  .concat(remoteContextMenuItems.map((page) => ({ default: page })))
  .filter((page) => page.default);
export const noResultItemsImports = (await Promise.all(noResultItems))
  .concat(remoteNoResultItems.map((page) => ({ default: page })))
  .filter((page) => page.default);

/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsPages = () =>
  pagesImports.flatMap((page) => page.default.map((page: any) => page));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsItems = () =>
  itemsImports.flatMap((item) => item.default().map((item: any) => item));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsContextMenuItems = () =>
  contextMenuItemsImports.flatMap((item) =>
    item.default().map((item: any) => item)
  );
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsNoResultItems = () =>
  noResultItemsImports.flatMap((item) =>
    item.default().map((item: any) => item)
  );
