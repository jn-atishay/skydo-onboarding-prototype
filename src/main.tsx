import React from "react";
import { createRoot } from "react-dom/client";
import App from "./prototype/App";
import { AccessGate } from "./prototype/components/AccessGate";
import "../styles/globals.css";
import "./prototype/prototype.css";
import "./prototype/digilocker.css";
import "./prototype/website.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AccessGate>
      <App />
    </AccessGate>
  </React.StrictMode>
);
