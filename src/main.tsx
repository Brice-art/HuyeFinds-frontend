import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppBootLoader } from "./components/AppBootLoader";
import "./index.css";

function AppShell() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const startBootstrap = async () => {
      const waitForPageLoad = document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });

      const fontsReady = document.fonts?.ready ?? Promise.resolve();

      await Promise.all([waitForPageLoad, fontsReady]);
      await new Promise((resolve) => window.setTimeout(resolve, 1200));

      if (!cancelled) setReady(true);
    };

    startBootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{ready ? <App /> : <AppBootLoader />}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>,
);
