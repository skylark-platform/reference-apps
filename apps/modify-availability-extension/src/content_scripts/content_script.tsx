import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DimensionSettings } from "../components/DimensionsDrawer";
import "../index.css";

// import { DimensionDrawer } from "@skylark-reference-apps/dimensions-drawer";

// import rules from '../rules';

const updateHeaders = () => {
  console.log("updateHeaders");
  // chrome.declarativeNetRequest.updateDynamicRules({
  //     removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
  //     addRules: rules as chrome.declarativeNetRequest.Rule[]
  //   });
};

function ContentScript() {
  console.log("ContentScript loaded");
  const queryClient = new QueryClient();

  updateHeaders();
  return (
    <div className="App" id="skylark-availability-inspector">
      <header
        className="App-header"
        style={{
          background: "#333",
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <p className="bg-red-500">THIS</p>
        <QueryClientProvider client={queryClient}>
          <DimensionSettings />
        </QueryClientProvider>
      </header>
    </div>
  );
}

const index = document.createElement("div");
index.id = "content-script";
document.body.appendChild(index);

ReactDOM.createRoot(index).render(
  <React.StrictMode>
    <ContentScript />
  </React.StrictMode>
);
