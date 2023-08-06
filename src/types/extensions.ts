import React from "react";

export interface AuxActions {
  title: string;
  onClick: () => void;
  description?: string;
  icon?: React.ReactNode;
}

export interface ModuleItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionName: string;
  onClick: () => void;
  auxActions?: AuxActions[];
}

export interface ModulePage {
  title: string;
  description: string;
  icon: React.ReactNode;
  items?: ModuleItem[];
  component?: React.ReactNode;
}

export interface Module {
  title: string;
  description: string;
  icon: React.ReactNode;
  items?: ModuleItem[];
  pages?: ModulePage[];
}
