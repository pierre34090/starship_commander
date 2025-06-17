// src/components/PlayerShipPanel.tsx
import type { PlayerShipState } from '../libs/state/Ships/PlayerShipState';

interface ShipPanelProps {
  ship: PlayerShipState;
}

const PlayerShipPanel: React.FC<ShipPanelProps> = ({ ship }) => {
  return (
    <div className="panel">
      <h2>{ship.name}</h2>
      <img src={ship.sprite} alt={ship.name} className="your_ship-sprite" />
      <p><strong>HP:</strong> {ship.hp} / {ship.maxHp}</p>
      <p><strong>Attack:</strong> {ship.attack}</p>
      <p><strong>Defense:</strong> {ship.defense}</p>
    </div>
  );
};

export default PlayerShipPanel;
