import React from "react";
import { SkylarkLogo } from "./skylarkBranding";

export const Header = () => (
  <header className="bg-nav-bar flex h-16 w-full items-center justify-between px-4">
    <div className="flex items-center space-x-4">
      <SkylarkLogo className="w-8" />
      <h1 className="text-xl font-heading font-bold">{`Availability Modifier`}</h1>
    </div>
    <div className="flex items-center font-body text-xs">
      <p className="text-red-500">{`Intercepts paused`}</p>
      <a
        className="px-3 py-2 bg-brand-primary text-white rounded ml-2"
        href="https://app.skylarkplatform.com"
        rel="noreferrer"
        target="_blank"
      >{`Open Skylark`}</a>
    </div>
  </header>
);
