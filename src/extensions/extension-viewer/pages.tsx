import { BsGlobe, BsGrid, BsTrash } from "react-icons/bs";
import { ExtensionMetadata, ExtensionPages } from "../../devtools/types";
import { mapExtensionsMetadata } from "../extension-assembly";
import React from "react";
import sittlyDevtools from "../../devtools/index";

const { components, hooks, api } = sittlyDevtools;
const { shell } = api;
const { openURI } = shell;
const { useServices, useLocalStorage } = hooks;
const { Command: SittlyCommand } = components;
const pages: ExtensionPages = [
  {
    name: "Extensions",
    description: "Manage your extensions",
    route: "/extensions",
    icon: <BsGrid />,
    component: () => {
      const setContextMenuOptions = useServices(
        (state) => state.setContextMenuOptions
      );
      const [_, setExtensions] = useLocalStorage<string[]>("extensions", []);
      return (
        <SittlyCommand.List
          id="extensions"
          items={mapExtensionsMetadata()?.map((metadata: ExtensionMetadata) => {
            return {
              title: metadata.name,
              description: metadata.description,
              icon: metadata.icon,
              onClick() {},
              onHighlight() {
                setContextMenuOptions([
                  {
                    title: "Remove",
                    description: "Remove extension",
                    icon: <BsTrash />,
                    onClick() {
                      setExtensions((prev) =>
                        prev.filter(
                          (e) => !new RegExp(e).test(metadata.repoUrl)
                        )
                      );
                      location.reload();
                    },
                  },
                  {
                    title: "Open in browser",
                    description: "Open extension in browser",
                    icon: <BsGlobe />,
                    onClick() {
                      openURI(metadata.repoUrl);
                    },
                  },
                ]);
              },
            };
          })}
        />
      );
    },
  },
];
export default pages;
