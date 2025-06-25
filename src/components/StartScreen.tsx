import { useState } from 'react';
import type { FC } from 'react';
import type { ShipState } from '../libs/state/Ships/ShipState';
import { allPlayerShips } from '../libs/models/Ships/PlayerShipsTemplates';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';

interface StartScreenProps {
  onStartGame: (playerName: string, ship: ShipState) => void;
}

const StartScreen: FC<StartScreenProps> = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedShip, setSelectedShip] = useState<ShipState | null>(null);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {allPlayerShips.map((ship, index) => {
          const attrs = computeEffectiveAttributes(ship);

          return (
            <div
              key={index}
              onClick={() => setSelectedShip(ship)}
              style={{
                border: ship === selectedShip ? '3px solid #4caf50' : '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                width: '200px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
              }}
            >
              <img src={ship.sprite} alt={ship.name} style={{ width: '100px' }} />
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

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => {
            if (playerName && selectedShip) onStartGame(playerName, selectedShip);
          }}
          disabled={!playerName || !selectedShip}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !playerName || !selectedShip ? 'not-allowed' : 'pointer',
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
