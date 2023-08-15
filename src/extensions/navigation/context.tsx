import { ExtensionContextMenuItems } from "../../devtools/types";
import { BsArrowLeft, BsArrowRight, BsHouse } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import React from "react";
import sittlyDevtools from "../../devtools/index";

const { hooks } = sittlyDevtools;

const { useRouter } = hooks;
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
    {
      onClick() {
        window.location.reload();
      },
      title: "Reload",
      description: "Fast reload the page",
      icon: <IoMdRefresh />,
    },
  ];
};
export default items;
