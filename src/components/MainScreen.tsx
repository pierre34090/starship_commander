// src/components/MainScreen.tsx

import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import PlayerShipPanel from './PlayerShipPanel';
import TitlePanel from './TitlePanel';
import CombatPanel from './CombatPanel';
import { useNextStage } from '../hooks/useNextStage';

export default function MainScreen() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, metaState } = context;
  const { nextStage } = useNextStage();

  const ship = gameState.player_ship;

  return (
    <div className="main-screen-container">
      <div className="panel-grid">
        <PlayerShipPanel ship={ship} />
        <CombatPanel />
        <PlayerShipPanel ship={ship} />
        <PlayerShipPanel ship={ship} />
      </div>

      {metaState.gameWin && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={nextStage}>Étape suivante</button>
        </div>
      )}
    </div>
  );
}
