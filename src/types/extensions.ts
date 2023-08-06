import React, { ReactNode } from "react";
import { ListItem } from "../ui/shadcn/ui/own_command";

export type ExtensionPage = {
  route: `/${string}`;
  component: ReactNode | Element | (() => React.JSX.Element);
  name: string;
  description: string;
  icon: ReactNode;
};

export type ExtensionItems = () => ListItem[];
export type ExtensionContextMenuItems = () => ListItem[];
