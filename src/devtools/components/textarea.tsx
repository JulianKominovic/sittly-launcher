import * as React from "react";
import { cn } from "../lib/utils";

export interface TextareaProps
  extends React.AllHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, children, ...props }, ref) => {
    if (!children)
      throw new Error(
        "Textarea must have children. Use Fieldset.Label or/and Fieldset.Details from ui/fieldset.tsx"
      );

    return (
      <div className="flex items-start">
        <div> {children}</div>

        <textarea
          className={cn(
            "flex rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-grow",

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
Textarea.displayName = "Textarea";

export default Textarea;
