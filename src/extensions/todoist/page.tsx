import { BsListCheck, BsSearch } from "react-icons/bs";
import { ExtensionPages } from "../../devtools/types";
import React from "react";
import sittlyDevtools from "../../devtools/index";
import { todoistMapper } from "./mapper";
import { CreateTask } from "./create";
import { useTodoist } from "./use-todoist";

const { components } = sittlyDevtools;
const { Command, Button } = components;

const pages: ExtensionPages = [
  {
    name: "Todoist",
    description: "Track your tasks",
    route: "/todoist",
    icon: <BsListCheck />,
    component() {
      const {
        addTask,
        onHighlightListItemCallback,
        page,
        removeTask,
        tasks,
        tasksByStatus,
        setContextMenuOptions,
        setPage,
        updateTask,
      } = useTodoist();

      if (page === "CREATION_EDIT")
        return (
          <CreateTask
            addTask={addTask}
            setPage={setPage}
            setContextMenuOptions={setContextMenuOptions}
          />
        );

      if (!tasks.length)
        return (
          <main className="max-w-[40ch] mx-auto flex flex-col items-center justify-center h-full gap-8 p-4">
            <BsSearch className="text-6xl" />
            <h2 className="text-2xl font-semibold text-center">
              You don't have any task yet, click on the button below to add one
            </h2>

            <Button
              className="w-full"
              onClick={() => {
                setPage("CREATION_EDIT");
              }}
            >
              + Add task
            </Button>
          </main>
        );
      return (
        <Command.List
          id="todoist"
          items={
            tasks &&
            todoistMapper({
              tasksGrouped: tasksByStatus,
              setPage,
              setContextMenuOptions,
              updateTask,
              removeTask,
              onHighlightListItemCallback,
            })
          }
        />
      );
    },
  },
];
export default pages;
