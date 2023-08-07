export const pages = [import("./emojis/pages"), import("./ui-example/pages")];
export const items = [import("./music/items")];
export const contextMenuItems = [import("./navigation/context")];
export const noResultItems = [import("./navigation/no-results")];

export const pagesImports = await Promise.all(pages);
export const itemsImports = await Promise.all(items);
export const contextMenuItemsImports = await Promise.all(contextMenuItems);
export const noResultItemsImports = await Promise.all(noResultItems);

/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsPages = () =>
  pagesImports.flatMap((page) => page.default.map((page) => page));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsItems = () =>
  itemsImports.flatMap((item) => item.default().map((item) => item));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsContextMenuItems = () =>
  contextMenuItemsImports.flatMap((item) => item.default().map((item) => item));
/**
 * Only use this functions inside React components.
 *
 * If used outside React components, it will throw an error because it uses React hooks internally.
 */
export const mapExtensionsNoResultItems = () =>
  noResultItemsImports.flatMap((item) => item.default().map((item) => item));
