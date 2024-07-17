import { LOCAL_STORAGE } from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function BetaConnect() {
  const { query, push: navigateTo } = useRouter();

  useEffect(() => {
    if (query.uri && query.apikey) {
      localStorage.setItem(LOCAL_STORAGE.uri, query.uri as string);
      localStorage.setItem(LOCAL_STORAGE.apikey, query.apikey as string);
      // storage events are not picked up in the same tab, so dispatch it for the current one
      window.dispatchEvent(new Event("storage"));
      const redirectUrl =
        query.redirect && typeof query.redirect === "string"
          ? query.redirect
          : "/";

      void navigateTo(redirectUrl);
    }
  }, [query, navigateTo]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-2 text-white">
      <h1 className="font-heading mb-4 text-3xl">{"Skylark Auto Connect"}</h1>
      {!query.uri || !query.apikey ? (
        <>
          <p>
            {"Enter your Skylark URI and API Key into the URL to auto connect."}
          </p>
          <p>
            {"Format: "}
            <code>
              {/* eslint-disable-next-line no-template-curly-in-string */}
              {"?uri=${skylark_graphql_url}&apikey=${skylark_api_key}"}
            </code>
          </p>
        </>
      ) : (
        <>
          <p>{"URI and API Key found in URL."}</p>
          <p>{"Adding to Local Storage and redirecting to Content Library."}</p>
        </>
      )}
    </div>
  );
}
