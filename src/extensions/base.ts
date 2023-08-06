import { Module, ModuleItem, ModulePage } from "../types/extensions";

export class BaseModule implements Module {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ModuleItem[] = [];
  pages: ModulePage[] = [];

  constructor(title: string, description: string, icon: React.ReactNode) {
    this.title = title;
    this.description = description;
    this.icon = icon;
  }
  addItem(item: ModuleItem) {
    this.items.push(item);
    return this;
  }
  addPage(page: ModulePage) {
    this.pages.push(page);
    return this;
  }
}
