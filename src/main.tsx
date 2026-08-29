import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppBootLoader } from "./components/AppBootLoader";
import "./index.css";

function AppShell() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  return <>{ready ? <App /> : <AppBootLoader />}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>,
);
