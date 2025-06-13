// src/App.tsx
import * as React from "react";
import "./App.css";
import "./panel.css";

import { useGame } from "./hooks/useGame";
import GameOverScreen from "./components/GameOverScreen";
import MainScreen from "./components/MainScreen";

function App() {
  const {
    playerShip,
    money,
    scrap,
    income,
    ecoCost,
    forceCost,
    repairCost,

    weapons,
    weaponCost,

    enemy,
    gameOver,
    lastResult,
    generalMessage,

    upgradeEconomy,
    upgradeForce,
    handleGenerateEnemy,
    fight,
    skip,
    repair,
    restartGame,
    handleBuyWeapon,
  } = useGame();

  return (
    <div className="app-container">
      {gameOver ? (
        <GameOverScreen lastResult={lastResult} onRestart={restartGame} />
      ) : (
        // On enveloppe le message et la grille dans .game-content
        <div className="game-content">
          {generalMessage && (
            <div className="panel general-message-panel">
              {generalMessage}
            </div>
          )}
          {/* MainScreen doit contenir la grille (.panel-grid) */}
          <MainScreen
            playerShip={playerShip}
            onRepair={repair}
            onUpgradeAttack={upgradeForce}
            repairCost={repairCost}
            money={money}
            scrap={scrap}
            income={income}
            ecoCost={ecoCost}
            forceCost={forceCost}
            onUpgradeEconomy={upgradeEconomy}
            onUpgradeForce={upgradeForce}
            enemy={enemy}
            lastResult={lastResult}
            onGenerateEnemy={handleGenerateEnemy}
            onFight={fight}
            onSkip={skip}
            weapons={weapons}
            weaponCost={weaponCost}
            onBuyWeapon={handleBuyWeapon}
          />
        </div>
      )}
    </div>
  );
}

export default App;
