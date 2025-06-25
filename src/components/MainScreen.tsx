import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

import PlayerShipPanel from './PlayerShipPanel';
import CombatPanel from './CombatPanel';
import EconomyPanel from './EconomyPanel';
import { MessagePanel } from '../components/MessagePanel';

import { ShipDebugPanel } from './ShipDebugPanel';
import { DisplayShipInfo } from './DisplayShipInfo';

export default function MainScreen() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState } = context;
  const ship = gameState.player_ship;

  // Trouver l'ennemi courant
  const nextEnemy = gameState.stageEnemies.find(e => e.status === 'alive') ?? null;

  return (
    <div className="main-screen-container">
      <div className="panel-grid">
        <PlayerShipPanel ship={ship} />
        <CombatPanel />
        {nextEnemy && <DisplayShipInfo ship={nextEnemy} />}
        <MessagePanel />
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '1rem' }}>
        <ShipDebugPanel ship={ship} />
        {nextEnemy && <ShipDebugPanel ship={nextEnemy} />}
      </div>
    </div>
  );
}

