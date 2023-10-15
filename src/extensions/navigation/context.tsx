import { ExtensionContextMenuItems } from "../../devtools/types";
import { BsArrowLeft, BsArrowRight, BsHouse, BsSun } from "react-icons/bs";
import { IoMdExit, IoMdRefresh } from "react-icons/io";
import React from "react";
import sittlyDevtools from "../../devtools/index";
import { appWindow } from "@tauri-apps/api/window";
import { SunMoon } from "lucide-react";

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
      mainActionLabel: "Go back",
    },
    {
      onClick() {
        goForward();
      },
      title: "Go forward",
      description: "Go forward to the next page",
      icon: <BsArrowRight />,
      mainActionLabel: "Go forward",
    },
    {
      onClick() {
        goToHome();
      },
      title: "Go to home",
      description: "Go to the home page",
      icon: <BsHouse />,
      mainActionLabel: "Go to home",
    },
    {
      onClick() {
        window.location.reload();
      },
      title: "Reload",
      description: "Fast reload the page",
      icon: <IoMdRefresh />,
      mainActionLabel: "Reload",
    },
    {
      onClick() {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
          localStorage.setItem("theme", "light");
          document.body.classList.remove("dark");
        } else {
          localStorage.setItem("theme", "dark");
          document.body.classList.add("dark");
        }
      },
      title: "Toggle theme",
      description: "Toggle the theme",
      icon: <BsSun />,
    },
    {
      onClick() {
        appWindow.close();
      },
      title: "Quit",
      description: "Quit the app",
      icon: <IoMdExit />,
      mainActionLabel: "Quit",
    },
  ];
};
export default items;
