import React, { useEffect } from "react";
import { BsDot, BsMusicNote } from "react-icons/bs";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "./shadcn/command";
import * as Popover from "@radix-ui/react-popover";
import Kbd from "./Kbd";
import clsx from "clsx";
import sittlyDevtools from "../devtools/index";
import { AsyncStatusEvent } from "@/devtools/types/events";

const { hooks } = sittlyDevtools;
const { useServices } = hooks;
const calculateAsyncTasksUtils = (
  task: AsyncStatusEvent
): {
  background: string;
  color: string;
  border: string;
} => {
  const taskFailed = task.status === "ERROR";
  if (taskFailed)
    return {
      background: "from-red-100 to-red-50",
      color: "text-red-600",
      border: "border-red-100",
    };
  if (task.status === "SUCCESS")
    return {
      background: "from-green-100 to-green-50",
      color: "text-green-600",
      border: "border-green-100",
    };
  if (task.status === "IN_PROGRESS")
    return {
      background: "from-amber-100 to-amber-50",
      color: "text-amber-600",
      border: "border-amber-100",
    };
  return {
    background: "",
    color: "",
    border: "",
  };
};

const RenderFooterStatus = ({
  asyncOperation,
}: {
  asyncOperation: AsyncStatusEvent;
}) => {
  const musicState = useServices((state) => state.music);
  const asyncTaskUtils = calculateAsyncTasksUtils(asyncOperation);

  if (asyncOperation.status !== "IDLE") {
    return (
      <div className="flex items-center gap-2 max-w-[40ch] overflow-hidden ">
        <BsDot
          className={clsx(
            asyncTaskUtils.color,
            "text-3xl animate-pulse min-w-fit w-auto block"
          )}
        />
        <p
          className={clsx(
            asyncTaskUtils.color,
            "font-semibold whitespace-nowrap"
          )}
        >
          {asyncOperation.title}
        </p>
        <small className={clsx(asyncTaskUtils.color, "text-sm truncate")}>
          {asyncOperation.description}
        </small>
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

export default function ({
  commandRefInput,
}: {
  commandRefInput: React.MutableRefObject<HTMLInputElement | null>;
}) {
  const {
    contextMenuOptions,
    isContextMenuOpen,
    setContextMenuIsOpen,
    asyncOperation,
  } = useServices((state) => ({
    contextMenuOptions: state.contextMenuOptions,
    isContextMenuOpen: state.isContextMenuOpen,
    setContextMenuIsOpen: state.setContextMenuIsOpen,
    asyncOperation: state.asyncOperation,
  }));
  const setContextMenuVisibility = (bool: boolean) => {
    setContextMenuIsOpen(bool);
  };
  const toggleContextMenuVisibility = () => {
    setContextMenuIsOpen(!isContextMenuOpen);
  };

  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      if (contextMenuOptions.length > 0) {
        if (e.key === "o" && e.ctrlKey) {
          toggleContextMenuVisibility();
        }
      }
    };
    window.addEventListener("keydown", callback);
    return () => {
      window.removeEventListener("keydown", callback);
    };
  }, [contextMenuOptions, isContextMenuOpen, setContextMenuIsOpen]);

  return (
    <footer
      className={clsx(
        calculateAsyncTasksUtils(asyncOperation).background,
        calculateAsyncTasksUtils(asyncOperation).border,
        "flex items-center justify-between h-10 px-2 text-sm border-t text-slate-600 bg-gradient-to-r from-transparent to-transparent"
      )}
    >
      <RenderFooterStatus asyncOperation={asyncOperation} />

      <Popover.Root
        open={isContextMenuOpen}
        onOpenChange={setContextMenuVisibility}
      >
        {contextMenuOptions.length > 0 ? (
          <Popover.Trigger className="flex items-center gap-2 p-1 px-2 bg-transparent rounded-lg">
            More options <Kbd keys={["Ctrl", "O"]} />
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
          <Command className="bg-white border shadow-lg bg-opacity-80 rounded-xl backdrop-blur-xl backdrop-saturate-200 max-h-72">
            <CommandList>
              {contextMenuOptions.map(
                ({ title, description, icon, onClick }, index) => {
                  return (
                    <CommandItem
                      key={(title as any) + index}
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
                      <span className="truncate max-w-[40ch] text-slate-500">
                        {description}
                      </span>
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
