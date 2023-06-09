import React, { useState } from "react";
import clsx from "clsx";
import { ExtensionStorageKeys } from "../constants";
import { Input } from "./input";
import { Button } from "./button";

interface ConnectToSkylarkProps {
  className?: string;
  skylarkCreds: {
    uri: string;
    apiKey: string;
  };
  onUpdate: (apiKey: string) => void;
}

export const ConnectToSkylark = ({
  className,
  skylarkCreds: initialCreds,
  onUpdate,
}: ConnectToSkylarkProps) => {
  const [creds, setCreds] =
    useState<{
      uri: string;
      apiKey: string;
    }>(initialCreds);

  const updateCredentials = async (deleteCredentials?: boolean) => {
    await chrome.storage.sync.set({
      [ExtensionStorageKeys.SkylarkUri]: deleteCredentials ? "" : creds.uri,
    });
    await chrome.storage.session.set({
      [ExtensionStorageKeys.SkylarkApiKey]: deleteCredentials
        ? ""
        : creds.apiKey,
    });
    onUpdate(creds.apiKey);
  };

  return (
    <div className={clsx("w-full h-full flex flex-col", className)}>
      <h2 className="font-heading text-lg font-bold my-4">{`Enter your Skylark credentials`}</h2>
      <Input
        className="my-4"
        label="API URL"
        name="skylark-api-url"
        type={"string"}
        value={creds.uri}
        onChange={(uri) => setCreds({ ...creds, uri })}
      />
      <Input
        label="API Key"
        name="skylark-api-key"
        type={"string"}
        value={creds.apiKey}
        onChange={(apiKey) => setCreds({ ...creds, apiKey })}
      />
      <div className="self-end">
        <button
          onClick={() => {
            void updateCredentials(true);
          }}
        >{`Clear`}</button>
        <Button
          className="ml-4 mt-4"
          disabled={!creds.apiKey || !creds.uri}
          success
          onClick={() => {
            void updateCredentials();
          }}
        >{`Connect`}</Button>
      </div>
    </div>
  );
};
