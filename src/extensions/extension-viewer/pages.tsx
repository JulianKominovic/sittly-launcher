import { BsGlobe, BsGrid, BsTrash } from "react-icons/bs";
import { SittlyCommand } from "../../@devtools/components/own_command";
import { useServices } from "../../@devtools/hooks/context";
import { useLocalStorage } from "../../@devtools/hooks/localStorage";
import { ExtensionMetadata, ExtensionPages } from "../../@devtools/types";
import { openURI } from "../../@devtools/api/shell";
import { mapExtensionsMetadata } from "../extension-assembly";
import React from "react";

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
