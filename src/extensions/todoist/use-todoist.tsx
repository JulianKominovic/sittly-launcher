import sittlyDevtools from "@/devtools";
import { ListItem } from "@/devtools/types";
import { TodoistItem } from "@/types/extension";
import React, { useEffect, useMemo, useState } from "react";
import {
  BsCalendar2Check,
  BsCheck2All,
  BsChevronDoubleUp,
  BsList,
  BsPlus,
} from "react-icons/bs";
import {
  PRIORITY_VISUAL,
  TASK_VISUAL_STATUSES,
  TODOIST_DATABASE,
  TODOIST_DATABASE_GROUPING,
  TODOIST_DATABASE_TASKS,
} from "./const";

const { hooks, api, utils } = sittlyDevtools;
const { database } = api;
const { groupBy } = utils;
const { useServices } = hooks;

export function useTodoist() {
  const setContextMenuOptions = useServices(
    (state) => state.setContextMenuOptions
  );

  const [page, setPage] = useState<"CREATION_EDIT" | "LIST">(() => "LIST");
  const [group, _setGroup] = useState<keyof TodoistItem>(() => "status");
  const [tasks, setTasks] = useState<TodoistItem[]>([]);
  function setGroup(group: keyof TodoistItem) {
    _setGroup(group);
    database.write(TODOIST_DATABASE, TODOIST_DATABASE_GROUPING, { group });
  }
  const persistantContextMenuOptions: ListItem[] = [
    {
      title: "Add task",
      icon: <BsPlus />,
      onClick() {
        setPage("CREATION_EDIT");
      },
      mainActionLabel: "Add task",
    },
    {
      title: "Go to list",
      icon: <BsList />,
      onClick() {
        setPage("LIST");
      },
      mainActionLabel: "Go to list",
    },
  ];

  const listContextMenuOptions: ListItem[] = [
    {
      title: "List by status",
      icon: <BsCheck2All />,
      onClick() {
        setGroup("status");
      },
      mainActionLabel: "List by status",
    },
    {
      title: "List by priority",
      icon: <BsChevronDoubleUp />,
      onClick() {
        setGroup("priority");
      },
      mainActionLabel: "List by priority",
    },
    {
      title: "List by date",
      icon: <BsCalendar2Check />,
      onClick() {
        setGroup("due_date");
      },
      mainActionLabel: "List by date",
    },
  ];

  const tasksByStatus = useMemo(() => {
    if (group === "due_date") {
      return groupBy(tasks, (task) => {
        const diffDate = Math.round(
          (Number(task[group] as any) - Date.now()) / 1000 / 60 / 60 / 24
        );
        if (diffDate === 0) return "Today";
        return new Intl.RelativeTimeFormat(undefined, {
          style: "long",
        }).format(diffDate, "day");
      });
    }
    if (group === "priority") {
      const grouped = groupBy(tasks, (task) => PRIORITY_VISUAL[task[group]]);

      return {
        [PRIORITY_VISUAL["HIGH"]]: grouped[PRIORITY_VISUAL["HIGH"]],
        [PRIORITY_VISUAL["MEDIUM"]]: grouped[PRIORITY_VISUAL["MEDIUM"]],
        [PRIORITY_VISUAL["LOW"]]: grouped[PRIORITY_VISUAL["LOW"]],
      };
    }

    const grouped = groupBy(
      tasks,
      (task) => TASK_VISUAL_STATUSES[task[group as "status"]]
    );
    return {
      [TASK_VISUAL_STATUSES["TODO"]]: grouped[TASK_VISUAL_STATUSES["TODO"]],
      [TASK_VISUAL_STATUSES["IN_PROGRESS"]]:
        grouped[TASK_VISUAL_STATUSES["IN_PROGRESS"]],
      [TASK_VISUAL_STATUSES["DONE"]]: grouped[TASK_VISUAL_STATUSES["DONE"]],
    };
  }, [tasks, group]);

  const addTask = (task: TodoistItem) => {
    setTasks((prev) => {
      const newTasks = [...prev, task];
      database.write(TODOIST_DATABASE, TODOIST_DATABASE_TASKS, newTasks);
      return newTasks;
    });
    setPage("LIST");
  };
  const removeTask = (task: TodoistItem) => {
    setTasks((prev) => {
      const newTasks = prev.filter((t) => t.id !== task.id);
      database.write(TODOIST_DATABASE, TODOIST_DATABASE_TASKS, newTasks);
      return newTasks;
    });
  };

  const updateTask = (task: Partial<TodoistItem>) => {
    setTasks((prev) => {
      const newTasks = prev.map((t) => {
        if (t.id === task.id) return { ...t, ...task };
        return t;
      });
      database.write(TODOIST_DATABASE, TODOIST_DATABASE_TASKS, newTasks);
      return newTasks;
    });
  };

  useEffect(() => {
    async function init() {
      await database
        .read(TODOIST_DATABASE, TODOIST_DATABASE_TASKS)
        .then(setTasks as any)
        .catch(() => setTasks([]));
      await database
        .read(TODOIST_DATABASE, TODOIST_DATABASE_GROUPING)
        .then(({ group }: any) => {
          _setGroup(group);
        })
        .catch(() => _setGroup("status"));
    }
    init();
  }, []);

  function onHighlightListItemCallback() {
    const items = [...listContextMenuOptions, ...persistantContextMenuOptions];
    return items;
  }

  return {
    page,
    tasks,
    tasksByStatus,
    addTask,
    removeTask,
    onHighlightListItemCallback,
    setPage,
    setContextMenuOptions,
    updateTask,
  };
}
