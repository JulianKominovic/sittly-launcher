import React, { useEffect } from "react";
import { BsDot, BsMusicNote } from "react-icons/bs";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./shadcn/command";
import * as Popover from "@radix-ui/react-popover";
import Kbd from "./Kbd";
import clsx from "clsx";
import sittlyDevtools from "../devtools/index";
import { AsyncStatusEvent } from "@/devtools/types/events";
import { ListItem } from "@/devtools/types";

const { hooks } = sittlyDevtools;
const { useServices } = hooks;

const CommandItemMapper = (
  {
    title,
    description,
    icon,
    onClick,
    setContextMenuVisibility,
  }: ListItem & {
    setContextMenuVisibility: (bool: boolean) => void;
  },
  index: number
) => {
  return (
    <CommandItem
      key={(title as any) + index}
      value={(title as any) + index}
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
        onClick?.();
        setContextMenuVisibility(false);
      }}
    >
      {icon &&
        React.cloneElement(icon as React.ReactElement, {
          className: "text-sm",
        })}
      <p>{title}</p>
      <span className="truncate max-w-[40ch] text-slate-500 dark:text-neutral-400">
        {description}
      </span>
    </CommandItem>
  );
};

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
    mainAction,
    initialContextMenuOptions,
  } = useServices((state) => ({
    contextMenuOptions: state.contextMenuOptions,
    isContextMenuOpen: state.isContextMenuOpen,
    setContextMenuIsOpen: state.setContextMenuIsOpen,
    asyncOperation: state.asyncOperation,
    mainAction: state.mainActionLabel,
    initialContextMenuOptions: state.initialContextMenuOptions,
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

  const navigationItems =
    contextMenuOptions.length > initialContextMenuOptions.length
      ? contextMenuOptions.slice(-initialContextMenuOptions.length)
      : contextMenuOptions;
  const restItems =
    contextMenuOptions.length > initialContextMenuOptions.length
      ? contextMenuOptions.slice(0, -initialContextMenuOptions.length)
      : [];

  return (
    <footer
      className={clsx(
        calculateAsyncTasksUtils(asyncOperation).background,
        calculateAsyncTasksUtils(asyncOperation).border,
        "flex items-center justify-between h-10 px-2 text-sm border-t text-slate-600 bg-gradient-to-r from-transparent to-transparent dark:text-neutral-300 dark:border-neutral-600 "
      )}
    >
      <RenderFooterStatus asyncOperation={asyncOperation} />
      <div className="flex items-center gap-2">
        {mainAction && (
          <div className="flex items-center gap-2 p-1 px-2 bg-transparent rounded-lg ">
            <span className="truncate max-w-[18ch]">{mainAction}</span>{" "}
            <Kbd keys={["↵"]} />
          </div>
        )}

        <Popover.Root
          open={isContextMenuOpen}
          onOpenChange={setContextMenuVisibility}
        >
          <Popover.Trigger className="flex items-center gap-2 p-1 px-2 bg-transparent rounded-lg">
            <span className="whitespace-nowrap">
              +{contextMenuOptions.length} actions
            </span>{" "}
            <Kbd keys={["Ctrl", "O"]} />
          </Popover.Trigger>

          <Popover.Content
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              commandRefInput.current?.focus();
            }}
            align="end"
            alignOffset={6}
            sideOffset={6}
          >
            <Command className="bg-white border shadow-lg bg-opacity-80 rounded-xl backdrop-blur-xl backdrop-saturate-200 max-h-72 dark:bg-neutral-800 dark:bg-opacity-80 dark:border-neutral-700">
              <CommandList>
                {restItems.map((props, index) =>
                  CommandItemMapper(
                    { ...props, setContextMenuVisibility },
                    index
                  )
                )}
                <CommandGroup heading="Navigation" value="navigation">
                  {navigationItems.map((props, index) =>
                    CommandItemMapper(
                      { ...props, setContextMenuVisibility },
                      index
                    )
                  )}
                </CommandGroup>
              </CommandList>
              <CommandInput
                data-is-context-menu="true"
                className="border-t rounded-none dark:border-neutral-600"
              />
            </Command>
          </Popover.Content>
        </Popover.Root>
      </div>
    </footer>
  );
}
