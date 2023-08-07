import * as React from "react";
import { cn } from "../../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, type, ...props }, ref) => {
    if (!children)
      throw new Error(
        "Checkbox must have children. Use Fieldset.Label or/and Fieldset.Details from ui/fieldset.tsx"
      );
    return (
      <div className="flex items-center space-x-2">
        {children}

        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",

            className
          )}
          ref={ref}
          tabIndex={0}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
