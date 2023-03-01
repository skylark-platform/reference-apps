import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDebounce } from "use-debounce";
import { LOCAL_STORAGE, skylarkRequest } from "@skylark-reference-apps/lib";
import { Button } from "../button";

interface ConnectToSkylarkModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const introspectionQuery = `{
  __schema {
    queryType {
      name
    }
  }
}`;

export const ConnectToSkylarkModal = ({
  isOpen,
  closeModal,
}: ConnectToSkylarkModalProps) => {
  const [usingCustomSkylark, setUsingCustomSkylark] = useState(false);
  const [credentialsState, setCredentialsState] = useState<
    "invalid" | "valid" | "validating"
  >("invalid");

  const [skylarkUrl, setSkylarkUrl] = useState("");
  const [skylarkApiKey, setSkylarkApiKey] = useState("");

  const [debouncedSkylarkUrl] = useDebounce(skylarkUrl, 1000);
  const [debouncedSkylarkApiKey] = useDebounce(skylarkApiKey, 1000);

  const valuesWaitingToBeDebounced =
    debouncedSkylarkUrl !== skylarkUrl ||
    debouncedSkylarkApiKey !== skylarkApiKey;

  useEffect(() => {
    if (
      localStorage.getItem(LOCAL_STORAGE.uri) &&
      localStorage.getItem(LOCAL_STORAGE.apikey)
    ) {
      setUsingCustomSkylark(true);
    }
  }, []);

  useEffect(() => {
    if (
      debouncedSkylarkUrl &&
      debouncedSkylarkApiKey &&
      !valuesWaitingToBeDebounced
    ) {
      setCredentialsState("validating");
      skylarkRequest(
        debouncedSkylarkUrl,
        debouncedSkylarkApiKey,
        introspectionQuery
      )
        .then(() => {
          setCredentialsState("valid");
        })
        .catch(() => {
          setCredentialsState("invalid");
        });
    }
  }, [debouncedSkylarkUrl, debouncedSkylarkApiKey, valuesWaitingToBeDebounced]);

  const saveToLocalStorageAndRefresh = () => {
    localStorage.setItem(LOCAL_STORAGE.uri, debouncedSkylarkUrl);
    localStorage.setItem(LOCAL_STORAGE.apikey, debouncedSkylarkApiKey);

    window.location.reload();
  };

  const clearLocalStorageAndRefresh = () => {
    localStorage.removeItem(LOCAL_STORAGE.uri);
    localStorage.removeItem(LOCAL_STORAGE.apikey);

    window.location.reload();
  };

  return (
    <>
      <Transition appear as={Fragment} show={isOpen}>
        <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all md:p-8">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    {"Connect to your Skylark account"}
                  </Dialog.Title>
                  <div className="mt-2">
                    {/* <p className="text-sm text-gray-600">
                      {
                        "StreamTV can now connect to your Skylark Beta Account. Enter your API URL and API Key using the form below and the content will be loaded from your Account."
                      }
                    </p> */}
                    {/* <p className="mt-1 text-sm text-gray-600">
                      {
                        'To power the homepage, you must create a Set object with the external_id "streamtv-homepage". Alternatively, our customer success team can preload the StreamTV data into your acccount.'
                      }
                    </p> */}

                    {/* <p className="mt-3 text-sm font-medium text-gray-900">
                      {"Want to join our Beta?"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {
                        "Complete the registration form and a member of our team will contact you to set up your account."
                      }
                    </p> */}
                    <a
                      className="mt-1 text-sm font-medium text-skylark-blue hover:text-blue-700"
                      href={process.env.NEXT_PUBLIC_REGISTER_BUTTON_HREF}
                    >
                      {"Don't have an account?"}
                    </a>

                    <div className="my-4 grid w-full grid-cols-5 gap-4">
                      <div className="col-span-5 sm:col-span-4">
                        <label
                          className="block text-sm font-medium text-gray-900"
                          htmlFor="skylark-url"
                        >
                          {"GraphQL URL"}
                        </label>
                        <input
                          className="mt-1 block w-full flex-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          id="skylark-url"
                          name="skylark-url"
                          placeholder="https://api.skylarkplatform.com/graphql"
                          type="text"
                          onChange={(e) => setSkylarkUrl(e.target.value)}
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-4">
                        <label
                          className="block text-sm font-medium text-gray-900"
                          htmlFor="skylark-apikey"
                        >
                          {"API Key"}
                        </label>
                        <input
                          className="mt-1 block w-full flex-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          id="skylark-apikey"
                          name="skylark-apikey"
                          placeholder="xxx-xxxxxxxxxxxxx"
                          type="text"
                          onChange={(e) => setSkylarkApiKey(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-1">
                    <Button
                      disabled={
                        valuesWaitingToBeDebounced ||
                        credentialsState !== "valid"
                      }
                      size="sm"
                      text={
                        credentialsState === "validating" ||
                        valuesWaitingToBeDebounced
                          ? "Validating..."
                          : "Connect & Refresh"
                      }
                      onClick={saveToLocalStorageAndRefresh}
                    />
                    {usingCustomSkylark && (
                      <Button
                        size="sm"
                        text="Disconnect"
                        variant="outline"
                        onClick={clearLocalStorageAndRefresh}
                      />
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
