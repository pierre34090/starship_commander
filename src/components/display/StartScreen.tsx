// src/components/display/StartScreen.tsx

import { useState } from 'react';
import type { FC } from 'react';
import type { ShipState } from '../../libs/state/Ships/ShipState';
import { allPlayerShips } from '../../libs/models/Ships/PlayerShipsTemplates';
import { computeEffectiveAttributes } from '../../libs/state/Ships/ShipLogic';

import '../../css/StartScreen.css';
import styles from '../../css/PanelStyles.module.css';

interface StartScreenProps {
  onStartGame: (playerName: string, ship: ShipState) => void;
}

const StartScreen: FC<StartScreenProps> = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedShip, setSelectedShip] = useState<ShipState | null>(null);

  return (
    <div className="startscreen-wrapper">
      {/* Pseudo et bouton */}
      <div className="left-panel">
        <div className={styles.panel}>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
          />
          <button
            className="game-button"
            disabled={!playerName || !selectedShip}
            onClick={() => {
              if (playerName && selectedShip) onStartGame(playerName, selectedShip);
            }}
            style={{
              opacity: !playerName || !selectedShip ? 0.5 : 1,
              pointerEvents: !playerName || !selectedShip ? 'none' : 'auto',
            }}
          >
            Start Game
          </button>
        </div>
      </div>

      {/* Liste des vaisseaux */}
      <div className="right-panel">
        <div className={styles.panel}>
          <div className="ship-choice-grid">
            {allPlayerShips.map((ship, index) => {
              const attrs = computeEffectiveAttributes(ship);
              const isSelected = ship === selectedShip;
              const cardClass = `ship-card ${isSelected ? 'selected' : ''}`;

              return (
                <div
                  key={index}
                  className={cardClass}
                  onClick={() => setSelectedShip(ship)}
                >
                  <img src={ship.sprite} alt={ship.name} />
                  <h3>{ship.name}</h3>
                  <p>{ship.description}</p>
                  <p>HP: {attrs.maxHp}</p>
                  <p>Shield: {attrs.maxShield}</p>
                  <p>Armor: {attrs.maxArmor}</p>
                  <p>Damage: {attrs.globalDamage}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
