import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";
import { CopyComponent } from "./copy";

export interface AccordionItem {
  header: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion = ({ items }: AccordionProps) => (
  <AccordionPrimitive.Root
    className={clsx("w-full space-y-2")}
    defaultValue={[]}
    type="multiple"
  >
    {items.map(({ header, content }, i) => (
      <AccordionPrimitive.Item
        className="w-full border-b-2 border-gray-200 py-4 focus-within:outline-none focus:outline-none"
        key={`header-${i}`}
        value={`item-${i + 1}`}
      >
        <AccordionPrimitive.Header className="w-full focus-within:outline-none focus:outline-none focus-visible:outline-none">
          <AccordionPrimitive.Trigger
            className={clsx(
              "group",
              "inline-flex w-full items-center justify-between px-4 py-2 text-left transition-all",
              "data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg",
              "focus-within:outline-none focus:outline-none focus-visible:outline-none",
            )}
          >
            <span className="text-xl font-medium text-black">{header}</span>
            <ChevronDownIcon
              className={clsx(
                "ml-2 h-8 w-8 shrink-0 text-gray-700 transition-transform ease-in-out ",
                "group-data-[state=open]:rotate-180 group-data-[state=open]:duration-300",
              )}
            />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content
          className={clsx(
            "w-full overflow-hidden rounded-b-lg px-4 pb-3 pt-1 transition-all",
            "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          )}
        >
          <CopyComponent copy={content} />
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    ))}
  </AccordionPrimitive.Root>
);

export { Accordion };
