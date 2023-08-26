import { BsGlobe, BsGrid, BsTrash } from "react-icons/bs";
import { ExtensionMetadata, ExtensionPages } from "../../devtools/types";
import { deleteExtension, mapExtensionsMetadata } from "../extension-assembly";
import React from "react";
import sittlyDevtools from "../../devtools/index";

const { components, hooks, api } = sittlyDevtools;
const { shell } = api;
const { openURI } = shell;
const { useServices } = hooks;
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
                      deleteExtension(metadata).then(() => {
                        location.reload();
                      });
                    },
                    mainActionLabel: "Remove",
                  },
                  {
                    title: "Open in browser",
                    description: "Open extension in browser",
                    icon: <BsGlobe />,
                    onClick() {
                      openURI(metadata.repoUrl);
                    },
                    mainActionLabel: "Open",
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
