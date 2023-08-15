import { ExtensionNoResultItems } from "../../devtools/types";
import { BsGithub, BsTrash } from "react-icons/bs";
import sittlyDevtools from "../../devtools/index";

import React from "react";
const { hooks, utils } = sittlyDevtools;
const { useLocalStorage, useServices } = hooks;
const { urlUtils } = utils;
/**
 * Extension items needs to be a function in order to use hooks
 * @returns Extension items
 */
const items: ExtensionNoResultItems = () => {
  const { setSearchbarText, searchbarText } = useServices((state) => ({
    setSearchbarText: state.setSearchbarText,
    searchbarText: state.searchbarText,
  }));
  const [extensions, setExtensions] = useLocalStorage<string[]>(
    "extensions",
    []
  );
  const extensionIsInstalled = extensions.includes(searchbarText);

  return [
    {
      onClick() {
        setSearchbarText("");
      },
      title: "Clear searchbar",
      description: "Clear the searchbar",
      icon: <BsTrash />,
    },
    {
      onClick() {
        setExtensions((prev) =>
          extensionIsInstalled
            ? prev.filter((ext) => !new RegExp(ext).test(searchbarText), "i")
            : [...prev, searchbarText]
        );
        window.location.reload();
      },
      title: `${extensionIsInstalled ? "Remove" : "Add"} to extensions`,
      description: `${
        extensionIsInstalled ? "Remove" : "Add"
      } extension from Github repo`,
      icon: <BsGithub />,
      show: urlUtils.isGithubUrl(searchbarText),
    },
  ];
};
export default items;
