// src/components/PlayerShipPanel.tsx

import type { PlayerShipState } from '../libs/state/Ships/PlayerShipState';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';

interface ShipPanelProps {
  ship: PlayerShipState;
}

const PlayerShipPanel: React.FC<ShipPanelProps> = ({ ship }) => {
  const s = ship.ship;
  const attrs = computeEffectiveAttributes(s);

  return (
    <div className="panel">
      <h2>{s.name}</h2>
      <img src={s.sprite} alt={s.name} className="your_ship-sprite" />
      <p><strong>HP:</strong> {s.currentHp} / {attrs.maxHp}</p>
      <p><strong>Shield:</strong> {s.currentShield} / {attrs.maxShield}</p>
      <p><strong>Armor:</strong> {s.currentArmor} / {attrs.maxArmor}</p>
      <p><strong>XP:</strong> {ship.xp}</p>
    </div>
  );
};

export default PlayerShipPanel;
