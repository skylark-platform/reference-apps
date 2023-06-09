import React, { useCallback, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/inter";

import "./index.css";
import { useDebounce } from "use-debounce";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { AvailabilityModifier } from "./components/availabilityModifier";
import {
  ExtensionMessageType,
  ExtensionMessageValueHeaders,
  ParsedSkylarkDimensionsWithValues,
} from "./interfaces";
import { sendExtensionMessage } from "./lib/utils";
import { ExtensionStorageKeys } from "./constants";
import { ConnectToSkylark } from "./components/connectToSkylark";
import { DisabledOverlay } from "./components/disabledOverlay";
import {
  getCredentialsFromStorage,
  getExtensionEnabledFromStorage,
  getModifiersFromStorage,
  getParsedDimensionsFromStorage,
} from "./lib/storage";

export const App = () => {
  const queryClient = new QueryClient();

  const [extensionEnabled, setExtensionEnabled] = useState(true);
  const toggleEnabled = useCallback(async () => {
    await sendExtensionMessage({ type: ExtensionMessageType.TogglePaused });
    setExtensionEnabled(!extensionEnabled);
  }, [extensionEnabled]);

  const [showCredentialsScreen, setShowCredentialsScreen] = useState(false);

  const [creds, setCreds] =
    useState<{ uri: string; apiKey: string } | undefined>();

  const [dimensionsFromStorage, setDimensionsFromStorage] =
    useState<undefined | ParsedSkylarkDimensionsWithValues[]>();

  const [activeModifiers, setActiveModifiers] =
    useState<ExtensionMessageValueHeaders>({ timeTravel: "", dimensions: {} });

  const [debouncedActiveModifiers] = useDebounce(activeModifiers, 1000);

  const fetchCredentialsFromStorage = async () => {
    const storageCreds = await getCredentialsFromStorage();
    setCreds(storageCreds);
  };

  const fetchModifiersFromStorage = async () => {
    const initialModifiers = await getModifiersFromStorage();
    setActiveModifiers(initialModifiers);
  };

  const fetchExtensionEnabledFromStorage = async () => {
    const enabled = await getExtensionEnabledFromStorage();
    console.log("EEEEE", { enabled });
    setExtensionEnabled(enabled);
  };

  const fetchDimensionsFromStorage = async () => {
    const initialDimensions = await getParsedDimensionsFromStorage();
    console.log("initialDimensions", initialDimensions);
    setDimensionsFromStorage(initialDimensions);
  };

  useEffect(() => {
    void fetchCredentialsFromStorage();
    void fetchModifiersFromStorage();
    void fetchExtensionEnabledFromStorage();
    void fetchDimensionsFromStorage();
  }, []);

  const [isHeadersUpdating, setIsHeadersUpdating] = useState(false);

  const updateHeaders = async (modifiers: ExtensionMessageValueHeaders) => {
    setIsHeadersUpdating(true);
    await sendExtensionMessage({
      type: ExtensionMessageType.UpdateHeaders,
      value: modifiers,
    });
    await chrome.storage.local.set({
      [ExtensionStorageKeys.Modifiers]: modifiers,
    });

    setIsHeadersUpdating(false);
  };

  useEffect(() => {
    if (extensionEnabled) {
      void updateHeaders(debouncedActiveModifiers);
    }
  }, [debouncedActiveModifiers, extensionEnabled]);

  useEffect(() => {
    if (
      creds !== undefined &&
      (!creds?.uri || !creds?.apiKey) &&
      !showCredentialsScreen
    ) {
      setShowCredentialsScreen(true);
    }
  }, [creds, showCredentialsScreen]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen flex-grow flex-col items-start justify-start bg-white font-body">
        <Header
          credentialsAdded={!!creds?.apiKey && !!creds?.uri}
          enabled={extensionEnabled}
          toggleEnabled={() => {
            void toggleEnabled();
          }}
          onChangeCredentials={() =>
            setShowCredentialsScreen(!showCredentialsScreen)
          }
        />
        <main className="flex h-full w-full flex-grow relative">
          {!creds ? (
            <div className="my-8 px-4">{`Loading...`}</div>
          ) : (
            <>
              {showCredentialsScreen ? (
                <ConnectToSkylark
                  className="px-4"
                  skylarkCreds={creds}
                  onUpdate={() => {
                    setShowCredentialsScreen(false);
                    setExtensionEnabled(true);
                    void fetchCredentialsFromStorage();
                  }}
                />
              ) : (
                <>
                  <DisabledOverlay show={!extensionEnabled} />

                  <AvailabilityModifier
                    activeModifiers={activeModifiers}
                    className="mb-10 px-4"
                    dimensionsFromStorage={dimensionsFromStorage}
                    setActiveModifiers={setActiveModifiers}
                    skylarkCreds={creds}
                  />
                </>
              )}
            </>
          )}
        </main>
        <Footer
          // isExtensionDisabled={!extensionEnabled}
          isHeadersUpdating={
            isHeadersUpdating || activeModifiers !== debouncedActiveModifiers
          }
        />
      </div>
    </QueryClientProvider>
  );
};

export default App;
