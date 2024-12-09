import { useEffect, useState } from "react";

const mockingEnabledPromise =
  typeof window !== "undefined" && false
    ? import("../mocks/browser").then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest(request, print) {
            if (request.url.includes("_next")) {
              return;
            }
            print.warning();
          },
        });
      })
    : Promise.resolve();

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    void mockingEnabledPromise.then(() => {
      setIsLoaded(true);
    });
  });

  return isLoaded ? children : <></>;
}

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If MSW is enabled, we need to wait for the worker to start,
  // so we wrap the children in a Suspense boundary until it's ready.
  return <MSWProviderWrapper>{children}</MSWProviderWrapper>;
}
