// src/components/GameScreenComponents/EnemyPanel.tsx

import React, { useContext } from 'react';
import '../../../css/GameScreenComponents/EnemyPanel.css';
import { GameContext } from '../../../contexts/GameContext';

import { StatusPanel } from './StatusPanel';
import WeaponsPanel from './WeaponsPanel';
import type { ShipState } from '../../../libs/state/Ships/ShipState';
import EnemyCorePanel from './EnemyCorePanel';

const EnemyPanel: React.FC = () => {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState } = context;
  if (!gameState) return null;

  const playerShip = gameState.player_ship;
  const spyLevel = playerShip.energyAllocation['spy'] ?? 0;
  const enemy = gameState.stageEnemies.find(e => e.status === 'alive');
  if (!enemy) return <div className="enemy-panel-wrapper">Aucun ennemi actif.</div>;

  return (
    <div className="enemy-panel-wrapper">
      {/* Partie haute : StatusPanel */}
      <div className="enemy-top">
        {spyLevel >= 1 ? (
          <StatusPanel ship={enemy} />
        ) : (
          <div className="spy-warning">[Détection minimale requise pour scanner l’intégrité ennemie]</div>
        )}
      </div>

      {/* Partie centrale : sprite + sous-systèmes */}
      <div className="enemy-sprite">
        <EnemyCorePanel ship={enemy} />
      </div>

      {/* Partie basse : armes */}
      <div className="enemy-bottom">
        {spyLevel >= 2 ? (
          <WeaponsPanel ship={enemy} />
        ) : (
          <div className="spy-warning">[Analyse d’armement indisponible – niveau d’espionnage requis]</div>
        )}
      </div>
    </div>
  );
};

export default EnemyPanel;
