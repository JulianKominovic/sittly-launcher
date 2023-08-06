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
  return (
    <SittlyCommand.Root className="flex-grow bg-transparent">
      <SittlyCommand.Input
        ref={inputRef}
        autoFocus
        placeholder="Type a command or search..."
      />
      {children}
    </SittlyCommand.Root>
  );
});
