import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

import PlayerShipPanel from './PlayerShipPanel';
import CombatPanel from './CombatPanel';
import EconomyPanel from './EconomyPanel';
import { MessagePanel } from '../components/MessagePanel';

import { PlayerDebugPanel } from './PlayerDebugPanel';
import { EnemyDebugPanel } from './EnemyDebugPanel';
import { DisplayShipInfo } from './DisplayShipInfo';

export default function MainScreen() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, metaState } = context;
  const ship = gameState.player_ship;

  // Trouver l'ennemi courant
  const boss = gameState.stage_boss_ship;
  const nextEnemy =
    gameState.stage_enemy_ships.find(e => e.status === 'alive') ??
    (boss?.status === 'alive' ? boss : null);

  return (
    <div className="main-screen-container">
      <div className="panel-grid">
        <PlayerShipPanel ship={ship} />
        <CombatPanel />
        <DisplayShipInfo ship={nextEnemy.ship} />
        <MessagePanel />
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '1rem' }}>
        <PlayerDebugPanel player={ship} />
        {nextEnemy && <EnemyDebugPanel enemy={nextEnemy} />}
      </div>
    </div>
  );
}
