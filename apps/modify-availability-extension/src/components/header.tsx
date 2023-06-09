import React from "react";
import clsx from "clsx";
import { SkylarkLogo } from "./skylarkBranding";
import { Switch } from "./switch";
import { Button } from "./button";

interface HeaderProps {
  enabled: boolean;
  credentialsAdded: boolean;
  toggleEnabled: () => void;
  onChangeCredentials: () => void;
}

export const Header = ({
  enabled,
  credentialsAdded,
  toggleEnabled,
  onChangeCredentials,
}: HeaderProps) => (
  <header className="bg-nav-bar flex h-16 w-full items-center justify-between px-4">
    <div className="flex items-center space-x-4">
      <a
        className=""
        href="https://app.skylarkplatform.com"
        rel="noreferrer"
        target="_blank"
      >
        <SkylarkLogo className="w-8" />
      </a>
      <h1 className="text-xl font-heading font-bold">{`Availability Modifier`}</h1>
    </div>
    <div className="flex items-center font-body text-xs">
      {credentialsAdded && (
        <p
          className={clsx(
            "text-error mr-2 transition-all",
            !enabled ? "visible opacity-100" : "invisible opacity-0"
          )}
        >{`Intercepts paused`}</p>
      )}
      <Switch
        disabled={!credentialsAdded}
        enabled={enabled}
        toggleEnabled={toggleEnabled}
      />
      <Button
        className="ml-2"
        onClick={() => onChangeCredentials()}
      >{`Change Credentials`}</Button>
    </div>
  </header>
);
