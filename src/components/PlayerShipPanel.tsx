// src/components/PlayerShipPanel.tsx
import type { PlayerShipState } from '../libs/state/Ships/PlayerShipState';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';

interface ShipPanelProps {
  ship: PlayerShipState;
}

const PlayerShipPanel: React.FC<ShipPanelProps> = ({ ship }) => {
  return (
    <div className="panel">
      <h2>{ship.name}</h2>
      <img src={ship.sprite} alt={ship.name} className="your_ship-sprite" />
      <p><strong>HP:</strong> {ship.currentHp} / {computeEffectiveAttributes(ship).maxHp}</p>
      <p><strong>Attack:</strong> Don't exist</p>
      <p><strong>Shield:</strong> {ship.currentShield} / {computeEffectiveAttributes(ship).maxShield}</p>
      <p><strong>Armor:</strong> {ship.currentArmor} / {computeEffectiveAttributes(ship).maxArmor}</p>
      <p><strong>XP:</strong> {ship.xp}</p>
    </div>
  );
};

export default PlayerShipPanel;
