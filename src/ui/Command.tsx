import { IconJarLogoIcon } from "@radix-ui/react-icons";
import { appWindow } from "@tauri-apps/api/window";
import React, { forwardRef, memo, useState } from "react";
import modules from "../extensions";
import { emojiModule } from "../extensions/emojis";

import { cn } from "../lib/utils";
import { useServices } from "../services";

import { SittlyCommand } from "./shadcn/ui/own_command";

export default forwardRef(function (
  {
    children,
  }: {
    children?: React.ReactNode;
  },
  inputRef: React.Ref<HTMLInputElement> | undefined
) {
  const [page, setPage] = React.useState<string[]>([]);
  const setContextMenuOptions = useServices(
    (state) => state.setContextMenuOptions
  );
  return (
    <SittlyCommand.Root className="flex-grow bg-transparent">
      <SittlyCommand.Input
        ref={inputRef}
        autoFocus
        placeholder="Type a command or search..."
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (page.length === 0) appWindow.hide();
            setPage([]);
          }
        }}
      />
      <SittlyCommand.List
        items={Array.from({ length: 100 }, (_, i) => i).map((i) => ({
          title: `Item ${i}`,
          description: `Description ${i}`,
          icon: <IconJarLogoIcon />,
          onClick: () => console.log(`Item ${i} clicked`),
          actionName: `Item ${i} action`,
          onHighlight() {
            setContextMenuOptions([
              {
                title: "Copy item " + i,
                icon: <IconJarLogoIcon />,
                onClick: () => console.log("Copy item " + i),
              },
              {
                title: "Copy and :D item " + i,
                icon: <IconJarLogoIcon />,
                onClick: () => console.log("Copy item " + i),
              },
            ]);
          },
        }))}
      />

      {/* <RenderListOrPage page={page} /> */}
    </SittlyCommand.Root>
  );
});
