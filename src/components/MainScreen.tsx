// src/components/MainScreen.tsx
import React from "react";
import type { Ship } from "../models/ships/Ship";
import ShipPanel from "./ShipPanel";
import EconomicPanel from "./EconomicPanel";
import CombatPanel from "./CombatPanel";
import ShopPanel from "./ShopPanel";

interface MainScreenProps {
  playerShip: Ship;
  shipMessage: string | null;
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

  // éventuellement Shop actions...
}

const MainScreen: React.FC<MainScreenProps> = ({
  playerShip,
  shipMessage,
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
}) => {
  return (
    <>
      {/* Ship panel */}
      <div className="panel">
        <ShipPanel
          ship={playerShip}
          message={shipMessage}
          repairCost={repairCost}
          onRepair={onRepair}
          onUpgradeAttack={onUpgradeAttack}
        />
      </div>
      {/* Economy panel */}
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
      {/* Combat panel */}
      <div className="panel">
        <CombatPanel
          enemy={enemy}
          onGenerate={onGenerateEnemy}
          onFight={onFight}
          onSkip={onSkip}
          resultMessage={lastResult}
        />
      </div>
      {/* Shop panel */}
      <div className="panel">
        <ShopPanel scrap={scrap} />
      </div>
      {/* On pourrait ici ajouter un bouton Restart si on veut qu’il soit toujours visible */}
    </>
  );
};

export default MainScreen;
