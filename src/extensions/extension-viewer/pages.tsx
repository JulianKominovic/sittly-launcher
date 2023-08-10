import { BsCardText, BsGlobe, BsGrid, BsTrash } from "react-icons/bs";
import { SittlyCommand } from "../../@devtools/components/own_command";
import { useServices } from "../../@devtools/hooks/context";
import { useLocalStorage } from "../../@devtools/hooks/localStorage";
import { ExtensionPages } from "../../@devtools/types";
import { openURI } from "../../@devtools/api/shell";

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
      const [extensions, setExtensions] = useLocalStorage<string[]>(
        "extensions",
        []
      );
      return (
        <SittlyCommand.List
          id="extensions"
          items={extensions?.map((ext) => ({
            title: ext,
            description: ext,
            icon: <BsCardText />,
            onClick() {},
            onHighlight() {
              setContextMenuOptions([
                {
                  title: "Remove",
                  description: "Remove extension",
                  icon: <BsTrash />,
                  onClick() {
                    setExtensions((prev) => prev.filter((e) => e !== ext));
                  },
                },
                {
                  title: "Open in browser",
                  description: "Open extension in browser",
                  icon: <BsGlobe />,
                  onClick() {
                    openURI(ext);
                  },
                },
              ]);
            },
          }))}
        />
      );
    },
  },
];
export default pages;
