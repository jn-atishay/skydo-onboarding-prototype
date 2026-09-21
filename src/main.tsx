import React from "react";
import { createRoot } from "react-dom/client";
import App from "./prototype/App";
import "../styles/globals.css";
import "./prototype/prototype.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
