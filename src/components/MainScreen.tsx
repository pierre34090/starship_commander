// src/components/MainScreen.tsx

import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

import PlayerShipPanel from './PlayerShipPanel';
import CombatPanel from './CombatPanel';
import EconomyPanel from './EconomyPanel';
import { MessagePanel } from '../components/MessagePanel';

export default function MainScreen() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, metaState } = context;

  const ship = gameState.player_ship;

  return (
    <div className="main-screen-container">
      <div className="panel-grid">
        <PlayerShipPanel ship={ship} />
        <CombatPanel />
        <EconomyPanel />
        <MessagePanel />
      </div>
    </div>
  );
}
