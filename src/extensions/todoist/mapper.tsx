import { ListItem } from "@/devtools/types";
import { TodoistItem } from "@/types/extension";
import React from "react";
import { BsTrash } from "react-icons/bs";
import {
  TASK_VISUAL_STATUSES,
  PRIORITY_VISUAL,
  TASK_VISUAL_STATUSES_ICONS,
} from "./const";

export const todoistMapper = ({
  tasksGrouped,
  editTask,
  updateTask,
  removeTask,
  onHighlightListItemCallback,
  setContextMenuOptions,
}: {
  tasksGrouped: Record<any, TodoistItem[]>;
  editTask: any;
  updateTask: any;
  removeTask: any;
  onHighlightListItemCallback: any;
  setContextMenuOptions: any;
}) => {
  if (!tasksGrouped) return [];
  return Object.entries(tasksGrouped).flatMap(([key, tasks]) => {
    if (!tasks) return [];
    return [
      {
        description: `${tasks.length} tasks - ${key}`,
        onHighlight: () => setContextMenuOptions(onHighlightListItemCallback()),
      },
    ].concat(
      tasks.map((task) => {
        const actions: ListItem[] = [
          {
            title: "Status: " + TASK_VISUAL_STATUSES["TODO"],
            icon: <p>{TASK_VISUAL_STATUSES_ICONS["TODO"]}</p>,
            onClick() {
              updateTask({ ...task, status: "TODO" });
            },
            mainActionLabel: "Change status",
          },
          {
            title: "Status: " + TASK_VISUAL_STATUSES["IN_PROGRESS"],
            icon: <p>{TASK_VISUAL_STATUSES_ICONS["IN_PROGRESS"]}</p>,
            onClick() {
              updateTask({ ...task, status: "IN_PROGRESS" });
            },
            mainActionLabel: "Change status",
          },
          {
            title: "Status: " + TASK_VISUAL_STATUSES["DONE"],
            icon: <p>{TASK_VISUAL_STATUSES_ICONS["DONE"]}</p>,
            onClick() {
              updateTask({ ...task, status: "DONE" });
            },
            mainActionLabel: "Change status",
          },
          {
            title: "Delete",
            icon: <BsTrash />,
            onClick() {
              removeTask(task);
            },
            mainActionLabel: "Delete",
          },
          ...onHighlightListItemCallback(),
        ];

        return {
          title: task.title,
          description: task.description,
          icon: <div>{TASK_VISUAL_STATUSES[task.status].slice(0, 2)}</div>,
          mainActionLabel: "Edit",
          onClick() {
            editTask(task);
          },
          rightIcon: (
            <div className="whitespace-nowrap">
              {PRIORITY_VISUAL[task.priority]}
            </div>
          ),

          onHighlight: () => setContextMenuOptions(actions),
        };
      })
    );
  });
};
