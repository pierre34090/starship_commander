// src/components/CombatPanel.tsx

import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { resolveCombatStep, resolveSkipEnemy } from '../libs/logic/combat/combatController';

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

      {nextEnemy ? (
        <>
          <img src={nextEnemy.sprite} alt={nextEnemy.name} className="enemy-sprite" />
          <p><strong>{nextEnemy.name}</strong></p>
          <p><strong>HP:</strong> {nextEnemy.hp} / {nextEnemy.maxHp}</p>
          <p><strong>Attack:</strong> {nextEnemy.attack}</p>
          <p><strong>Defense:</strong> {nextEnemy.defense}</p>

          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={handleFight} disabled={isGameOver}>Combattre</button>
            {!isBoss && (
              <button onClick={handleSkip} style={{ marginLeft: '0.5rem' }} disabled={isGameOver}>
                Skip
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Aucun ennemi actif</p>
      )}
    </div>
  );
}
