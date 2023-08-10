import { ExtensionNoResultItems } from "../../@devtools/types";
import { BsGithub, BsTrash } from "react-icons/bs";
import { useServices } from "../../@devtools/hooks/context";
import { useLocalStorage } from "../../@devtools/hooks/localStorage";
import { urlUtils } from "../../@devtools/lib/utils";

/**
 * Extension items needs to be a function in order to use hooks
 * @returns Extension items
 */
const items: ExtensionNoResultItems = () => {
  const { setSearchbarText, searchbarText } = useServices((state) => {
    return {
      setSearchbarText: state.setSearchbarText,
      searchbarText: state.searchbarText,
    };
  });
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
