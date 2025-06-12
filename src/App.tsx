import React, { useState, useEffect } from "react";
import "./App.css";
import "./panel.css";

import CombatPanel from "./components/CombatPanel";
import EconomicPanel from "./components/EconomicPanel";
import ShipPanel from "./components/ShipPanel";
import ShopPanel from "./components/ShopPanel";

import { generateEnemy } from "./logic/generate_enemy";
import { resolveFight } from "./logic/fight_manager";
import { Player_ship } from "./models/ships/playable_ship/Player_ship";
import type { Ship } from "./models/ships/Ship";

function App() {
  // Player ship state
  const [playerShip, setPlayerShip] = useState<Ship>(() => new Player_ship());
  // Economy state
  const [money, setMoney] = useState(500);
  const [scrap, setScrap] = useState(0);
  const [income, setIncome] = useState(1);

  // Upgrade costs
  const [ecoCost, setEcoCost] = useState(15);
  const [forceCost, setForceCost] = useState(20);
  const [repairCost, setRepairCost] = useState(10);
  const [repairValue, setRepairValue] = useState(10);
  // Combat state
  const [enemy, setEnemy] = useState<Ship | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [shipMessage, setShipMessage] = useState<string | null>(null);

  // Passive income
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((m) => m + income * 0.25);
    }, 250);
    return () => clearInterval(interval);
  }, [income]);

  // Economy upgrade
  const upgradeEconomy = () => {
    if (money >= ecoCost) {
      setMoney((m) => m - ecoCost);
      setIncome((i) => Math.round(i * 1.5));
      setEcoCost((c) => Math.round(c * 2));
    }
  };

  // Force (attack) upgrade via Ship.updateStats
  const upgradeForce = () => {
    if (money >= forceCost) {
      setMoney((m) => m - forceCost);
      setPlayerShip((ps) => ps.updateStats({ attack: ps.stats.attack + 1 }));
      setForceCost((c) => Math.round(c * 1.8));
    }
  };

  // Generate a new enemy
  const handleGenerateEnemy = () => {
    const newEnemy = generateEnemy();
    setEnemy(newEnemy);
    setLastResult(null);
    setGameOver(false);
  };

  // Fight logic using resolveFight
  const fight = () => {
    if (!enemy || gameOver) return;

    const { newPlayer, newEnemy, lastResult: resultMsg, scrapGain } = resolveFight(playerShip, enemy);
    setPlayerShip(newPlayer);
    if (scrapGain) setScrap((s) => s + scrapGain);
    setEnemy(newEnemy);
    // Determine gameOver: playerDead or both dead
    const playerDead = resultMsg.startsWith("☠️ Defeat") || resultMsg === "☠️ Both you and the enemy were destroyed";
    if (playerDead) setGameOver(true);
    setLastResult(resultMsg || null);
  };

  // Skip/flee
  const skip = () => {
    if (!enemy) return;
    const enemyName = enemy.constructor.name;
    setLastResult(`⏭ You fled from ${enemyName}`);
    setEnemy(null);
  };

  // Restart game to initial state
  const restartGame = () => {
    setPlayerShip(new Player_ship());
    setMoney(500);
    setScrap(0);
    setIncome(1);
    setEcoCost(15);
    setForceCost(20);
    setRepairCost(10);
    setRepairValue(10)
    setEnemy(null);
    setGameOver(false);
    setLastResult(null);
  };

  return (
    <div className="panel-grid">
      {gameOver ? (
        <div className="game-over-screen" style={{ backgroundColor: '#fff', color: '#000', padding: '1rem', textAlign: 'center' }}>
          <h2 style={{ color: '#000' }}>Game Over</h2>
          <p style={{ color: '#000', fontWeight: 'bold' }}>{lastResult}</p>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : (
        <>
          <div className="panel">
            <ShipPanel
              ship={playerShip}
              message={shipMessage}
              repairCost={repairCost}
              onRepair={() => {
                if (playerShip.stats.hp >= playerShip.stats.maxHp) {
                  setShipMessage("Already at full HP");
                  return;
                }
                if (money < repairCost) {
                  setShipMessage("Not enough money to repair");
                  return;
                }
                
                setMoney(m => m - repairCost);
                setRepairCost(r => Math.round(r * 1.5));

                

                if (playerShip.stats.hp > playerShip.stats.maxHp - repairValue){
                  const maxValue = playerShip.stats.maxHp - playerShip.stats.hp;
                  const repaired = playerShip.repair(maxValue);
                  setPlayerShip(repaired);
                  setShipMessage(`Repaired ${maxValue} HP`);
                }
                else{
                  const repaired = playerShip.repair(repairValue);
                  setPlayerShip(repaired);
                  setShipMessage(`Repaired ${repairValue} HP`);
                }

              }}
              onUpgradeAttack={() => {
                setPlayerShip(ps => ps.updateStats({ attack: ps.stats.attack + 1 }));
                setMoney(m => m - forceCost);
                setShipMessage("Attack increased");
              }}
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
          {/* Restart only shown on gameOver, removed here */}
        </>
      )}
    </div>
  );
}

export default App;
