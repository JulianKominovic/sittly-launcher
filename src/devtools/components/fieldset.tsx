import React from "react";
import { cn } from "../lib/utils";

const Fieldset = {
  Label: (
    props: { children: React.ReactNode } & React.HTMLProps<HTMLLabelElement>
  ) => (
    <label
      {...props}
      className={cn(
        "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-neutral-500 w-28 inline-block truncate",
        props.className
      )}
    />
  ),
  Details: (
    props: { children: React.ReactNode } & React.HTMLProps<HTMLParagraphElement>
  ) => (
    <p
      {...props}
      className={cn("text-sm text-muted-foreground", props.className)}
    />
  ),
};

export default Fieldset;
