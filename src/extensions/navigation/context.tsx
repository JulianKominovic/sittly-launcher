import { ExtensionContextMenuItems } from "../../types/extensions";
import { useRouter } from "../../@devtools/hooks/router";
import { BsArrowLeft, BsArrowRight, BsHouse } from "react-icons/bs";

/**
 * Extension items needs to be a function in order to use hooks
 * @returns Extension items
 */
const items: ExtensionContextMenuItems = () => {
  const { goBack, goForward, goToHome } = useRouter();
  return [
    {
      onClick() {
        goBack();
      },
      title: "Go back",
      description: "Go back to the previous page",
      icon: <BsArrowLeft />,
    },
    {
      onClick() {
        goForward();
      },
      title: "Go forward",
      description: "Go forward to the next page",
      icon: <BsArrowRight />,
    },
    {
      onClick() {
        goToHome();
      },
      title: "Go to home",
      description: "Go to the home page",
      icon: <BsHouse />,
    },
  ];
};
export default items;
