// src/components/PlayerShipPanel.tsx

import type { ShipState } from '../libs/state/Ships/ShipState';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';

interface ShipPanelProps {
  ship: ShipState;
}

const PlayerShipPanel: React.FC<ShipPanelProps> = ({ ship }) => {
  const attrs = computeEffectiveAttributes(ship);

  return (
    <div className="panel">
      <h2>{ship.name}</h2>
      <img src={ship.sprite} alt={ship.name} className="your_ship-sprite" />
      <p><strong>HP:</strong> {ship.currentHp} / {attrs.maxHp}</p>
      <p><strong>Shield:</strong> {ship.currentShield} / {attrs.maxShield}</p>
      <p><strong>Armor:</strong> {ship.currentArmor} / {attrs.maxArmor}</p>
    </div>
  );
};

export default PlayerShipPanel;
