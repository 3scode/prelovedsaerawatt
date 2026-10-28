"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  size?: "sm" | "md";
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  id,
  name,
  size = "md",
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      id={id}
      name={name}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
        size === "md" ? "h-6 w-11" : "h-5 w-9",
        checked
          ? "border-secondary/30 bg-secondary"
          : "border-border-strong bg-surface-muted",
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-surface shadow-sm transition-transform duration-150",
          size === "md" ? "size-[18px] translate-x-1 data-[state=checked]:translate-x-[22px]" : "size-4 translate-x-0.5 data-[state=checked]:translate-x-[18px]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
