// src/components/screens/GameScreen.tsx

import { useContext } from 'react';
import { GameContext } from '../../contexts/GameContext';

import styles from '../../css/PanelStyles.module.css';
import '../../css/GameScreen.css';

import { StatusPanel } from './GameScreenComponents/StatusPanel';
import ShopModulePanel from './GameScreenComponents/ShopModulePanel';
import WeaponsPanel from './GameScreenComponents/WeaponsPanel';
import SubsystemPanel from './GameScreenComponents/SubsystemPanel';
import EnemyPanel from './GameScreenComponents/EnemyPanel';
import PauseControlPanel from './GameScreenComponents/PauseControlPanel';


export default function GameScreen() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState } = context;
  const ship = gameState.player_ship;

  return (
    <div className="game-wrapper">
      <div className="gamescreen">
        {/* Bloc joueur (2/3) */}
        <div className="player-panel">
          {/* Top */}
          <div className="player-top">
            <div className={`player-status ${styles.panel}`}>
              <StatusPanel ship={ship} />
            </div>
            <div className={`pause-controls ${styles.panel}`}>
              <PauseControlPanel />
            </div>
          </div>

          {/* Middle */}
          <div className="player-middle">
            <div className={`shop-modules ${styles.panel}`}>
              <ShopModulePanel />
            </div>
            <div className={`player-sprite ${styles.panel}`}>
              PlayerShipSpritePanel
            </div>
          </div>

          {/* Bottom */}
          <div className="player-bottom">
            <div className={`subsystems ${styles.panel}`}>
              <SubsystemPanel ship={ship} /> {/* ✅ intégré ici */}
            </div>
            <div className={`weapons ${styles.panel}`}>
              <WeaponsPanel ship={ship} />
            </div>
          </div>
        </div>

        {/* Bloc ennemi (1/3) */}
        <div className={`enemy-panel ${styles.panel}`}>
          <EnemyPanel />
        </div>
      </div>
    </div>
  );
}
