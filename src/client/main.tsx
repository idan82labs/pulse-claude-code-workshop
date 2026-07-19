import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { DesignComparison } from "./DesignComparison";
import "./styles.css";

const rootComponent = window.location.pathname === "/design-demo" ? <DesignComparison /> : <App />;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {rootComponent}
  </StrictMode>
);
