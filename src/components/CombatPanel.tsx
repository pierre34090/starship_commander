import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { useCombat } from '../hooks/useCombat';

export default function CombatPanel() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState } = context;
  const { combatInProgress, combatResult, startCombat } = useCombat();

  if (!gameState) return null;

  const boss = gameState.stage_boss_ship;
  const nextEnemy =
    gameState.stage_enemy_ships.find((e) => e.hp > 0) ??
    (boss && boss.hp > 0 ? boss : null);

  return (
    <div>
      <h2>Combat</h2>

      {combatResult && (
        <p>Résultat : {combatResult === 'win' ? 'Victoire' : 'Défaite'}</p>
      )}

      {nextEnemy ? (
        <div style={{ marginTop: '0.5rem' }}>
          <h4>{nextEnemy.name}</h4>
          <p>HP: {nextEnemy.hp} / {nextEnemy.maxHp}</p>
          <p>Attack: {nextEnemy.attack}</p>
          <p>Defense: {nextEnemy.defense}</p>

          <button onClick={startCombat} disabled={combatInProgress}>
            {combatInProgress ? 'Combat en cours...' : 'Combattre'}
          </button>
        </div>
      ) : (
        <p>Aucun ennemi actif</p>
      )}
    </div>
  );
}
