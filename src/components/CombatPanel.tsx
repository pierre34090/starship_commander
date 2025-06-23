// src/components/CombatPanel.tsx

import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { resolveCombatStep, resolveSkipEnemy } from '../libs/logic/combat/combatController';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';

export default function CombatPanel() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState, metaState, setMetaState } = context;
  if (!gameState || !metaState) return null;

  const boss = gameState.stage_boss_ship;
  const nextEnemy =
    gameState.stage_enemy_ships.find(e => e.status === 'alive') ??
    (boss?.status === 'alive' ? boss : null);

  const isBoss = nextEnemy === boss;
  const isGameOver = metaState.gameOver || metaState.gameWin;

  const handleFight = () => {
    if (isGameOver) return;
    const [newState, newMeta] = resolveCombatStep(gameState, metaState);
    setGameState(newState);
    setMetaState(newMeta);
  };

  const handleSkip = () => {
    if (isGameOver || !nextEnemy || isBoss) return;
    const [newState, newMeta] = resolveSkipEnemy(gameState, metaState);
    setGameState(newState);
    setMetaState(newMeta);
  };

  return (
    <div className="panel">
      <h2>Enemy</h2>

      {nextEnemy ? (() => {
        const attrs = computeEffectiveAttributes(nextEnemy);

        return (
          <>
            <img src={nextEnemy.sprite} alt={nextEnemy.name} className="enemy-sprite" />
            <p><strong>{nextEnemy.name}</strong></p>
            <p><strong>HP:</strong> {nextEnemy.currentHp} / {attrs.maxHp}</p>
            <p><strong>Shield:</strong> {nextEnemy.currentShield} / {attrs.maxShield}</p>
            <p><strong>Armor:</strong> {nextEnemy.currentArmor} / {attrs.maxArmor}</p>
            <p><strong>Damage:</strong> {attrs.globalDamage}</p>
            <p><strong>Precision:</strong> {Math.round(attrs.precision * 100)}%</p>
            <p><strong>Evasion:</strong> {Math.round(attrs.evasion * 100)}%</p>

            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={handleFight} disabled={isGameOver}>Combattre</button>
              {!isBoss && (
                <button onClick={handleSkip} style={{ marginLeft: '0.5rem' }} disabled={isGameOver}>
                  Skip
                </button>
              )}
            </div>
          </>
        );
      })() : (
        <p>Aucun ennemi actif</p>
      )}
    </div>
  );
}
