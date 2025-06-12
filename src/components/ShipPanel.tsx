import type * as React from 'react';
import type { Ship } from '../models/ships/Ship';

interface ShipPanelProps {
  ship: Ship;                       // l’objet vaisseau à afficher
  message?: string | null; 
  repairCost?: number;         // feedback optionnel (ex: “Réparé +10 HP”)
  onRepair?: () => void;            // callback facultatif pour réparer
  onUpgradeAttack?: () => void;     // callback facultatif pour augmenter l’attaque
}

const ShipPanel: React.FC<ShipPanelProps> = ({
  ship,
  message,
  repairCost,
  onRepair,
  onUpgradeAttack,
}) => {
  const { attack, hp, maxHp } = ship.stats;
  const name = ship.constructor.name;

  return (
    <div>
      <h2>{'Your Ship'}</h2>
      <img
            src={`/${ship.sprite}`}
            alt={ship.constructor.name}
            className="enemy-sprite"
      />
      {message && <div className="ship-result">{message}</div>}
      <p><strong>Attack:</strong> {attack}</p>
      <p><strong>HP:</strong> {hp} / {maxHp}</p>
      <div>
        {onRepair && <button onClick={onRepair}>
            Repair
            {repairCost !== undefined ? ` (${repairCost})` : ''}
        </button>}
        {onUpgradeAttack && <button onClick={onUpgradeAttack}>Upgrade Attack</button>}
      </div>
    </div>
  );
};

export default ShipPanel;


