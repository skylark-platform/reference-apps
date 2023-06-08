import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";

import "./index.css";

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
