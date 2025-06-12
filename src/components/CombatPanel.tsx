import React from "react";
import type { Ship } from "../models/ships/Ship";

interface CombatPanelProps {
  enemy: Ship | null;
  onGenerate: () => void;
  onFight: () => void;
  onSkip: () => void;
  resultMessage?: string | null;
}

const CombatPanel: React.FC<CombatPanelProps> = ({
  enemy,
  onGenerate,
  onFight,
  onSkip,
  resultMessage,
}) => {
  return (
    <div>
      <h2>Combat</h2>
      {resultMessage && (
        <div
          className="combat-result"
          style={{ backgroundColor: "#fff", color: "#000", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "4px" }}
        >
          {resultMessage}
        </div>
      )}
      {!enemy ? (
        <button onClick={onGenerate}>🔍 Search for Enemy</button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={`/${enemy.sprite}`}
            alt={enemy.constructor.name}
            className="enemy-sprite"
          />
          <p style={{ margin: 0 }}>
            <strong>{enemy.constructor.name}</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Attack:</strong> {enemy.stats.attack}
          </p>
          <p style={{ margin: 0, marginBottom: "0.5rem" }}>
            <strong>HP:</strong> {enemy.stats.hp} / {enemy.stats.maxHp}
          </p>
          <div>
            <button onClick={onFight}>Fight</button>{" "}
            <button onClick={onSkip}>Skip</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatPanel;