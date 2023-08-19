import { ExtensionNoResultItems } from "../../devtools/types";
import { BsGithub, BsTrash } from "react-icons/bs";
import sittlyDevtools from "../../devtools/index";

import React from "react";
import { downloadExtension } from "../extension-assembly";
const { hooks, utils } = sittlyDevtools;
const { useServices } = hooks;
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
        downloadExtension(searchbarText).then(() => {
          window.location.reload();
        });
      },
      title: `Add to extensions`,
      description: `Add extension from Github repo`,
      icon: <BsGithub />,
      show: urlUtils.isGithubUrl(searchbarText),
    },
  ];
};
export default items;
