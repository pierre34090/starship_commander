// src/components/EconomyPanel.tsx

import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { increaseAttack, increaseIncome, repairPlayer } from '../libs/logic/economy/Economy';

export default function EconomyPanel() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState } = context;
  if (!gameState) return null;

  const { economy, player_ship } = gameState;

  const handleIncome = () => {
    const newEconomy = increaseIncome(economy);
    setGameState({ ...gameState, economy: newEconomy });  
  };

  const handleAttack = () => {
    const [newEconomy, newPlayer] = increaseAttack(economy, player_ship);
    setGameState({ ...gameState, economy: newEconomy, player_ship: newPlayer });

  };

  const handleRepair = () => {
    const [newEconomy, newPlayer] = repairPlayer(economy, player_ship);
    setGameState({ ...gameState, economy: newEconomy, player_ship: newPlayer });
    
  };

    return (
    <div className="panel">
        <h2>Économie</h2>

        <div style={{ marginBottom: '1rem' }}>
        <div> Crédits : {economy.credits}</div>
        <div> Income : {economy.income}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
            onClick={handleIncome}
            disabled={economy.credits < economy.ecoCost}
        >
            Upgrade Income ({economy.ecoCost})
        </button>

        <button
            onClick={handleAttack}
            disabled={economy.credits < economy.attackCost}
        >
            Upgrade Attack ({economy.attackCost})
        </button>

        <button
            onClick={handleRepair}
            disabled={
            economy.credits < economy.repairCost ||
            player_ship.hp >= player_ship.maxHp
            }
        >
            Repair ({economy.repairCost})
        </button>
        </div>
    </div>
    );
}
