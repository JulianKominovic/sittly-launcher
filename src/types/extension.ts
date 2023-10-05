export type ExtensionDatabaseModel = {
  url: string;
  author: string;
  name: string;
  body: string;
  user_id: string;
  icon_url: string;
  id: string;
};

export type TodoistItem = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "DONE" | "IN_PROGRESS";
  priority: "HIGH" | "MEDIUM" | "LOW";
  due_date: number;
  category?: string;
};
