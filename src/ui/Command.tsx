import { mapExtensionsNoResultItems } from "@/extensions/extension-assembly";
import React, { forwardRef } from "react";

import sittlyDevtools from "../devtools/index";

const { components } = sittlyDevtools;
const { Command: SittlyCommand } = components;
export default forwardRef(function (
  {
    children,
  }: {
    children?: React.ReactNode;
  },
  inputRef: React.Ref<HTMLInputElement> | undefined
) {
  const noresult = mapExtensionsNoResultItems();
  return (
    <SittlyCommand.Root
      noResultItems={() => noresult}
      className="flex-grow bg-transparent"
    >
      <SittlyCommand.Input
        ref={inputRef}
        autoFocus
        placeholder="Type a command or search..."
      />
      {children}
    </SittlyCommand.Root>
  );
});
