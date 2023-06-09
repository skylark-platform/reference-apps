import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";

import "./index.css";

chrome.runtime.onMessage.addListener((response, sendResponse) => {
  console.log("fe message listener response");
});

const query = { active: true, currentWindow: true };

function callback(tabs) {
  const currentTab = tabs[0]; // there will be only one in this array
  console.log({ currentTab }); // also has properties like currentTab.id
}

chrome.tabs.query(query, callback);

ReactDOM.createRoot(
  document.getElementById(
    "skylark-availability-extension-app-root"
  ) as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// const example = document.createElement("my-extension");
// document.documentElement.appendChild(example);
// const shadowRoot = example.attachShadow({ mode: "open" });

// const renderIn = document.createElement("div");
// renderIn.id = "skylark-availability-extension-app-root";
// shadowRoot.appendChild(renderIn);

// ReactDOM.createRoot(renderIn).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
