"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn("border-b border-border", className)}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left text-[15px] font-semibold text-text-primary transition-colors hover:text-primary",
          className,
        )}
      >
        {children}
        <ChevronDown
          className="size-4 shrink-0 text-text-secondary transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-sm leading-relaxed text-text-secondary",
        "data-[state=closed]:animate-[accordion-up_220ms_ease-in-out] data-[state=open]:animate-[accordion-down_280ms_ease-in-out]",
        className,
      )}
    >
      <div className="pb-5 pr-8 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
}
