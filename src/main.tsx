// src/index.tsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import { GameProvider } from "./contexts/GameContext";  // ← assure-toi du bon chemin

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find root element");
}

createRoot(container as HTMLElement).render(
  <StrictMode>
    <GameProvider>       {/* ← ici on wrappe */}
      <App />
    </GameProvider>
  </StrictMode>
);
