
import React from "react";

export default function CombatPanel({ enemy, onFight, onGenerate, onSkip }) {
  return (
    <div>
      <h2>Combat Zone</h2>
      {enemy ? (
        <div>
          <p><strong>Enemy:</strong> {enemy.name}</p>
          <p><strong>Force:</strong> {enemy.force}</p>
          <p><strong>HP:</strong> {enemy.hp} / {enemy.maxHp}</p>
          <button onClick={onFight}>⚔ Attack</button>{" "}
          <button onClick={onSkip}>⏭ Flee</button>
        </div>
      ) : (
        <button onClick={onGenerate}>🎲 Generate enemy</button>
      )}
    </div>
  );
}