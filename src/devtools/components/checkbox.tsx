"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

type ExtendedPrimitive = {
  Label: (props: React.HTMLAttributes<HTMLLabelElement>) => React.ReactNode;
  Details: (
    props: React.HTMLAttributes<HTMLParagraphElement>
  ) => React.ReactNode;
} & typeof CheckboxPrimitive.Root;

const Checkbox = React.forwardRef<
  React.ElementRef<ExtendedPrimitive>,
  React.ComponentPropsWithoutRef<ExtendedPrimitive>
>(({ className, children, ...props }, ref) => {
  if (!children)
    throw new Error(
      "Checkbox must have children. Use Fieldset.Label or/and Fieldset.Details from ui/fieldset.tsx"
    );
  return (
    <div className="flex items-top">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className="w-4 h-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className="grid gap-1.5 leading-none">{children}</div>
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export default Checkbox;
export { Checkbox };
