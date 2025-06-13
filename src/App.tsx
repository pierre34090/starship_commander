// src/App.tsx
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
    // repairValue non nécessaire ici
    enemy,
    gameOver,
    lastResult,
    shipMessage,
    upgradeEconomy,
    upgradeForce,
    generateEnemy,
    fight,
    skip,
    repair,
    restartGame,
  } = useGame();

  return (
    <div className="panel-grid">
      {gameOver ? (
        <GameOverScreen lastResult={lastResult} onRestart={restartGame} />
      ) : (
        <MainScreen
          playerShip={playerShip}
          shipMessage={shipMessage}
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
          onGenerateEnemy={generateEnemy}
          onFight={fight}
          onSkip={skip}
        />
      )}
    </div>
  );
}

export default App;
