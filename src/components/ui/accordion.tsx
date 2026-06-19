import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline group/acc",
        className,
      )}
      {...props}
    >
      {children}
      {/* Bespoke gold-gradient expand indicator */}
      <span className="relative w-5 h-5 shrink-0 flex items-center justify-center">
        {/* Horizontal bar (always visible) */}
        <span
          className="absolute w-3 h-[1.5px] transition-all duration-500"
          style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.25))" }}
        />
        {/* Vertical bar (rotates to 0 when open) */}
        <span
          className="absolute w-[1.5px] h-3 transition-all duration-500 [[data-state=open]_&]:scale-y-0 [[data-state=open]_&]:opacity-0"
          style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.25))" }}
        />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
