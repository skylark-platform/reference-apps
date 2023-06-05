import React from "react";
import ReactDOM from "react-dom/client";
import Button from "../components/Button";
import { DimensionsDrawer } from "@skylark-reference-apps/dimensions-drawer";

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
  updateHeaders();
  return (
    <div className="App">
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
        <h1>ContentScript</h1>
        <Button onClick={updateHeaders}>button222</Button>
        <DimensionsDrawer />
      </header>
    </div>
  );
}

const index = document.createElement("div");
index.id = "skylark-dimensions-drawer";
document.body.appendChild(index);

ReactDOM.createRoot(index).render(
  <React.StrictMode>
    <ContentScript />
  </React.StrictMode>
);
