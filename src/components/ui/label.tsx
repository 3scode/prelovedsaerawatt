import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-[13px] font-semibold leading-none text-text-primary", className)}
    {...props}
  >
    {children}
  </label>
));
Label.displayName = "Label";
