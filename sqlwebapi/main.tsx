import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "../src/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Commit auth redirects before react-admin clears its query cache. */}
    <HashRouter unstable_useTransitions={false}>
      <App />
    </HashRouter>
  </StrictMode>,
);
