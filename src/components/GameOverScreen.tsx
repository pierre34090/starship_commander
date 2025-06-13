// src/components/GameOverScreen.tsx
import type { FC } from "react";

interface GameOverScreenProps {
  lastResult: string | null;
  onRestart: () => void;
}

const GameOverScreen: FC<GameOverScreenProps> = ({ lastResult, onRestart }) => {
  return (
    <div className="game-over-screen" style={{ backgroundColor: "#fff", color: "#000", padding: "1rem", textAlign: "center" }}>
      <h2 style={{ color: "#000" }}>Game Over</h2>
      <p style={{ color: "#000", fontWeight: "bold" }}>{lastResult}</p>
      <button onClick={onRestart}>Restart</button>
    </div>
  );
};

export default GameOverScreen;