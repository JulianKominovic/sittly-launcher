import React, { forwardRef } from "react";

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
