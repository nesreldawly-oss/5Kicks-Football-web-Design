
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// ERROR TRAPPING - DEBUGGING ONLY
window.onerror = function (message, source, lineno, colno, error) {
  const errorBox = document.createElement("div");
  errorBox.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; background: #fee2e2; color: #991b1b; padding: 24px; font-family: monospace; font-size: 16px; border-bottom: 4px solid #b91c1c;";
  errorBox.innerHTML = `<strong>Runtime Error:</strong><br/>${message}<br/><br/><small>${source}:${lineno}:${colno}</small><br/><br/><pre style="white-space: pre-wrap;">${error?.stack || ''}</pre>`;
  document.body.appendChild(errorBox);
};

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Failed to find the root element. Check if id='root' exists in index.html.");
  }
  createRoot(rootElement).render(<App />);
} catch (e: any) {
  const errorBox = document.createElement("div");
  errorBox.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; background: #fee2e2; color: #991b1b; padding: 24px; font-family: monospace; font-size: 16px; border-bottom: 4px solid #b91c1c;";
  errorBox.innerHTML = `<strong>Render Error:</strong><br/>${e.message}<br/><pre style="white-space: pre-wrap;">${e.stack || ''}</pre>`;
  document.body.appendChild(errorBox);
  console.error(e);
}
