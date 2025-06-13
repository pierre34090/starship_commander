import { createContext, useContext } from "react";
import type { UseGameReturn } from "../hooks/useGame";
import { useGame } from "../hooks/useGame";

// ① On crée un contexte qui peut contenir UseGameReturn ou null
const GameContext = createContext<UseGameReturn | null>(null);

// ② Le provider : il instancie useGame() et le met dans le contexte
export function GameProvider({ children }: { children: React.ReactNode }) {
  const game = useGame();
  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
}

// ③ Hook pour récupérer le contexte plus confortablement
export function useGameContext(): UseGameReturn {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGameContext must be used inside GameProvider");
  }
  return ctx;
}