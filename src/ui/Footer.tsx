import React, { useEffect, useState } from "react";
import { BsDot, BsMusicNote } from "react-icons/bs";
import { useServices } from "../@devtools/hooks/context";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "../@devtools/components/command";
import * as Popover from "@radix-ui/react-popover";
import Kbd from "./Kbd";
import clsx from "clsx";

const calculateAsyncTasksUtils = (
  tasks: { title: string; status: "FAILED" | "SUCCESS" | "IN_PROGRESS" }[]
): {
  background: string;
  color: string;
  title: string;
  border: string;
} => {
  if (tasks.length === 0)
    return {
      background: "",
      color: "",
      title: "",
      border: "",
    };
  const taskFailed = tasks.find((task) => task.status === "FAILED");
  if (taskFailed)
    return {
      background: "from-red-100 to-red-50",
      color: "text-red-500",
      title: taskFailed.title,
      border: "border-red-100",
    };
  if (tasks.every((task) => task.status === "SUCCESS"))
    return {
      background: "from-green-100 to-green-50",
      color: "text-green-500",
      title: "All tasks completed",
      border: "border-green-100",
    };
  const taskInProgress = tasks.find((task) => task.status === "IN_PROGRESS");
  if (taskInProgress)
    return {
      background: "from-amber-100 to-amber-50",
      color: "text-amber-500",
      border: "border-amber-100",

      title: taskInProgress.title,
    };
  return {
    background: "",
    color: "",
    title: "",
    border: "",
  };
};

const RenderFooterStatus = () => {
  const { musicState } = useServices((state) => ({
    musicState: state.music,
  }));
  const asyncTaskUtils = calculateAsyncTasksUtils([]);

  if (false) {
    return (
      <div className="flex items-center gap-2">
        <BsDot
          className={clsx(asyncTaskUtils.color, "text-4xl -m-2 animate-pulse")}
        />
        <p className={clsx(asyncTaskUtils.color)}>{asyncTaskUtils.title}</p>
      </div>
    );
  }

  if (musicState.status === "Playing")
    return (
      <div className="flex items-center gap-2">
        <BsMusicNote />
        <p className="font-semibold truncate max-w-[20ch]">
          {musicState.title}
        </p>
        <p className="truncate text-slate-500 max-w-[10ch]">
          {musicState.artist}
        </p>
      </div>
    );

  return <p>Sittly</p>;
};

export default function ({ commandRefInput }) {
  const { contexMenuOptions, isContextMenuOpen, setContextMenuIsOpen } =
    useServices((state) => ({
      contexMenuOptions: state.contextMenuOptions,
      setContextMenuIsOpen: state.setContextMenuIsOpen,
      isContextMenuOpen: state.isContextMenuOpen,
    }));
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const setContextMenuVisibility = (bool: boolean) => {
    setShowMoreOptions(bool);
    setContextMenuIsOpen(bool);
  };
  const toggleContextMenuVisibility = () => {
    setShowMoreOptions((prev) => !prev);
    setContextMenuIsOpen(!isContextMenuOpen);
  };

  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      if (contexMenuOptions.length > 0) {
        if (e.key === "o" && e.ctrlKey) {
          toggleContextMenuVisibility();
        }
      }
    };
    window.addEventListener("keydown", callback);
    return () => {
      window.removeEventListener("keydown", callback);
    };
  }, [contexMenuOptions, isContextMenuOpen, setContextMenuIsOpen]);

  return (
    <footer
      className={clsx(
        calculateAsyncTasksUtils([]).background,
        calculateAsyncTasksUtils([]).border,
        "flex items-center justify-between h-10 px-2 text-sm border-t text-slate-600 bg-gradient-to-r from-transparent to-transparent"
      )}
    >
      <RenderFooterStatus />

      <Popover.Root
        open={showMoreOptions}
        onOpenChange={setContextMenuVisibility}
      >
        {contexMenuOptions.length > 0 ? (
          <Popover.Trigger className="flex items-center gap-2 p-1 px-2 bg-white bg-opacity-50 border rounded-lg border-neutral-200">
            More options <Kbd keys="Ctrl+o" />
          </Popover.Trigger>
        ) : null}

        <Popover.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            commandRefInput.current?.focus();
          }}
          align="end"
          alignOffset={6}
          sideOffset={6}
        >
          <Command className="bg-white bg-opacity-50 border shadow-lg rounded-xl backdrop-blur-2xl backdrop-saturate-200">
            <CommandList>
              {contexMenuOptions.map(
                ({ title, description, icon, onClick }, index) => {
                  return (
                    <CommandItem
                      key={title + index}
                      id={title}
                      onKeyDownCapture={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onSelectCapture={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onSelect={() => {
                        onClick();
                        setContextMenuVisibility(false);
                      }}
                    >
                      {icon &&
                        React.cloneElement(icon as React.ReactElement, {
                          className: "text-sm",
                        })}
                      <p>{title}</p>
                      <span className="text-slate-500">{description}</span>
                    </CommandItem>
                  );
                }
              )}
            </CommandList>
            <CommandInput
              data-is-context-menu="true"
              className="border-t rounded-none"
            />
          </Command>
        </Popover.Content>
      </Popover.Root>
    </footer>
  );
}
