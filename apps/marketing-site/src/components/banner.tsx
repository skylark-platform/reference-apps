import { ArrowRightIcon, ChatBubbleIcon } from "@radix-ui/react-icons";

export const Banner = () => (
  <div className="gutter absolute left-0 right-0 top-0 flex h-10 w-full items-center justify-between bg-skylark-blue text-sm font-medium">
    <a
      className="flex items-center justify-center space-x-2 text-white hover:underline"
      href={"mailto:hello@skylarkplatform.com?subject=Hello"}
      rel="noreferrer"
      target="_blank"
    >
      <ChatBubbleIcon className="h-4 w-4" />
      <span>{"hello@skylarkplatform.com"}</span>
    </a>
    <a
      className="flex items-center justify-center space-x-1 text-white hover:underline"
      href={"https://app.skylarkplatform.com"}
      rel="noreferrer"
      target="_blank"
    >
      <span>{"Go to app"}</span>
      <ArrowRightIcon className="h-4 w-4" />
    </a>
  </div>
);
