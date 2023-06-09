import React from "react";
import { MdRefresh } from "react-icons/md";
import { sendExtensionMessage } from "../lib/utils";
import { ExtensionMessageType } from "../interfaces";
import { DisabledOverlay } from "./disabledOverlay";
import { Button } from "./button";

interface FooterProps {
  isHeadersUpdating?: boolean;
  isExtensionDisabled?: boolean;
}

const refreshTab = () => {
  void sendExtensionMessage({
    type: ExtensionMessageType.RefreshTab,
  });
};

export const Footer = ({
  isHeadersUpdating,
  isExtensionDisabled,
}: FooterProps) => (
  <footer className="relative py-4 flex items-center justify-start px-4 text-xs bg-manatee-200 w-full">
    {/* <button className="px-4 py-1.5 bg-red-500 rounded mr-4">{`Resume`}</button> */}
    {/* <p>{`When paused, Availability rules won't be applied.`}</p> */}
    <DisabledOverlay show={!!isExtensionDisabled} />
    <Button
      className="mr-4"
      disabled={isHeadersUpdating}
      onClick={refreshTab}
    >{`Refresh`}</Button>
    <p>{`Rules are updated automatically, you may need to refresh to see the changes.`}</p>
    {isHeadersUpdating && (
      <div className="absolute right-0 inset-y-0 flex justify-end items-center bg-manatee-200 px-8 text-brand-primary">
        <p>{`Updating Rules`}</p>
        <MdRefresh className="ml-2 w-5 h-5 animate-spin" />
      </div>
    )}
  </footer>
);
