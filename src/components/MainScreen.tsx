// src/components/MainScreen.tsx
import * as React from "react";
import type { Ship } from "../models/ships/Ship";
import type { Weapon } from "../models/weapons/Weapon";
import ShipPanel from "./ShipPanel";
import EconomicPanel from "./EconomicPanel";
import CombatPanel from "./CombatPanel";
import ShopPanel from "./ShopPanel";
import WeaponPanel from "./WeaponPanel";

interface MainScreenProps {
  playerShip: Ship;
  onRepair: () => void;
  onUpgradeAttack: () => void;
  repairCost: number;

  money: number;
  scrap: number;
  income: number;
  ecoCost: number;
  forceCost: number;
  onUpgradeEconomy: () => void;
  onUpgradeForce: () => void;

  enemy: Ship | null;
  lastResult: string | null;
  onGenerateEnemy: () => void;
  onFight: () => void;
  onSkip: () => void;

  weapons: Array<Weapon | null>;
  weaponCost: number;
  onBuyWeapon: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({
  playerShip,
  onRepair,
  onUpgradeAttack,
  repairCost,
  money,
  scrap,
  income,
  ecoCost,
  forceCost,
  onUpgradeEconomy,
  onUpgradeForce,
  enemy,
  lastResult,
  onGenerateEnemy,
  onFight,
  onSkip,
  weapons,
  weaponCost,
  onBuyWeapon,
}) => {
  return (
    <div className="main-screen-container">
      {/* Ici on n’affiche pas generalMessage, car App le fait */}
      <div className="panel-grid">
        <div className="panel">
          <ShipPanel
            ship={playerShip}
            // on retire la prop message
            repairCost={repairCost}
            onRepair={onRepair}
            onUpgradeAttack={onUpgradeAttack}
          />
        </div>
        <div className="panel">
          <EconomicPanel
            money={money}
            scrap={scrap}
            income={income}
            ecoCost={ecoCost}
            forceCost={forceCost}
            onUpgradeEco={onUpgradeEconomy}
            onUpgradeForce={onUpgradeForce}
          />
        </div>
        <div className="panel">
          <CombatPanel
            enemy={enemy}
            onGenerate={onGenerateEnemy}
            onFight={onFight}
            onSkip={onSkip}
            resultMessage={lastResult}
          />
        </div>
        <div className="panel">
          <ShopPanel scrap={scrap} />
        </div>
        <div className="panel">
          <WeaponPanel
            weapons={weapons}
            weaponCost={weaponCost}
            onBuyWeapon={onBuyWeapon}
          />
        </div>
        {/* Si tu as d’autres panels, tu les ajoutes ici */}
      </div>
    </div>
  );
};

export default MainScreen;
