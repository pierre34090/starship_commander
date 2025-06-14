// src/components/MainScreen.tsx
import React, { useCallback } from "react";
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
    gameOver,
    restartGame,
  } = useGameContext();

  // Wrapper pour Restart
  const onRestart = useCallback(() => {
    restartGame();
  }, [restartGame]);

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
          {/* CombatPanel prend maintenant en charge le toggle Auto Combat et la boucle interne */}
          <CombatPanel
            enemy={enemy}
            onGenerate={handleGenerateEnemy}
            onFight={fight}
            onSkip={skip}
            resultMessage={lastResult}
            gameOver={gameOver}
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

        <div className="panel">
          <button onClick={onRestart}>Restart</button>
        </div>
      </div>
    </div>
  );
}
