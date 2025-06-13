// src/components/MainScreen.tsx
import { useGameContext } from "../contexts/GameContext";
import ShipPanel from "./ShipPanel";
import EconomicPanel from "./EconomicPanel";
import CombatPanel from "./CombatPanel";
import ShopPanel from "./ShopPanel";
import WeaponPanel from "./WeaponPanel";

export default function MainScreen() {
  const {
    playerShip,
    repair,
    repairCost,
    upgradeForce,
    upgradeEconomy,
    money,
    scrap,
    income,
    ecoCost,
    forceCost,
    enemy,
    lastResult,
    handleGenerateEnemy,
    fight,
    skip,
    weapons,
    weaponCost,
    handleBuyWeapon,
  } = useGameContext();

  return (
    <div className="main-screen-container">
      <div className="panel-grid">
        <div className="panel">
          <ShipPanel
            ship={playerShip}
            repairCost={repairCost}
            onRepair={repair}
            onUpgradeAttack={upgradeForce}
          />
        </div>
        <div className="panel">
          <EconomicPanel
            money={money}
            scrap={scrap}
            income={income}
            ecoCost={ecoCost}
            forceCost={forceCost}
            onUpgradeEco={upgradeEconomy}
            onUpgradeForce={upgradeForce}
          />
        </div>
        <div className="panel">
          <CombatPanel
            enemy={enemy}
            onGenerate={handleGenerateEnemy}
            onFight={fight}
            onSkip={skip}
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
            onBuyWeapon={handleBuyWeapon}
          />
        </div>
        {/* Ajoute d’autres panels ici si besoin */}
      </div>
    </div>
  );
}
