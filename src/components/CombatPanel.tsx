// src/components/CombatPanel.tsx

import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { runCombatStep } from '../libs/logic/combat/RoundManager';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';

export default function CombatPanel() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState, metaState, setMetaState } = context;
  if (!gameState || !metaState) return null;

  const nextEnemy = gameState.stageEnemies.find(e => e.status === 'alive');
  const isGameOver = metaState.gameOver || metaState.gameWin;

  const handleFight = () => {
    if (isGameOver) return;
    const [newState, newMeta] = runCombatStep(gameState, metaState);
    setGameState(newState);
    setMetaState(newMeta);
  };

  return (
    <div className="panel">
      <h2>Enemy</h2>

      {nextEnemy ? (() => {
        const ship = nextEnemy;
        const attrs = computeEffectiveAttributes(ship);

        return (
          <>
            <img src={ship.sprite} alt={ship.name} className="enemy-sprite" />
            <p><strong>{ship.name}</strong></p>
            <p><strong>HP:</strong> {ship.currentHp} / {attrs.maxHp}</p>
            <p><strong>Shield:</strong> {ship.currentShield} / {attrs.maxShield}</p>
            <p><strong>Armor:</strong> {ship.currentArmor} / {attrs.maxArmor}</p>
            <p><strong>Damage:</strong> {attrs.globalDamage}</p>
            <p><strong>Precision:</strong> {Math.round(attrs.precision * 100)}%</p>
            <p><strong>Evasion:</strong> {Math.round(attrs.evasion * 100)}%</p>

            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={handleFight} disabled={isGameOver}>Combattre</button>
            </div>
          </>
        );
      })() : (
        <p>Aucun ennemi actif</p>
      )}
    </div>
  );
}
