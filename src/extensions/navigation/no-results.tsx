import { ExtensionNoResultItems } from "../../types/extensions";
import { BsTrash } from "react-icons/bs";
import { useServices } from "../../services";

/**
 * Extension items needs to be a function in order to use hooks
 * @returns Extension items
 */
const items: ExtensionNoResultItems = () => {
  const setSearchbarText = useServices((state) => state.setSearchbarText);
  return [
    {
      onClick() {
        setSearchbarText("");
      },
      title: "Clear searchbar",
      description: "Clear the searchbar",
      icon: <BsTrash />,
    },
  ];
};
export default items;
