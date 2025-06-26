// src/components/debugPanels/PlayerWeaponControlPanel.tsx

import React from 'react';
import { GameContext } from '../../contexts/GameContext';

export default function PlayerWeaponControlPanel() {
  const context = React.useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState } = context;
  const ship = gameState.player_ship;

  const maxEnergy = ship.currentE;
  const weapons = ship.weapons;

  const usedEnergy = weapons
    .filter(w => w.isActive)
    .reduce((sum, w) => sum + (w.electricity_consumption ?? 0), 0);

  const toggleWeapon = (index: number) => {
    const weapon = weapons[index];
    const energyCost = weapon.electricity_consumption ?? 0;

    const wantsToActivate = !weapon.isActive;
    const newUsed = wantsToActivate ? usedEnergy + energyCost : usedEnergy - energyCost;

    if (wantsToActivate && newUsed > maxEnergy) return;

    const newWeapons = [...weapons];
    newWeapons[index] = { ...weapon, isActive: !weapon.isActive };

    setGameState({ ...gameState, player_ship: { ...ship, weapons: newWeapons } });
  };

  return (
    <div style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Armes du joueur</h3>
      <p>Énergie utilisée : {usedEnergy} / {maxEnergy}</p>
      {weapons.map((w, i) => {
        const canActivate =
          !w.isActive && usedEnergy + (w.electricity_consumption ?? 0) > maxEnergy;

        return (
          <div key={i} style={{ marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ flex: 1 }}>{w.name}</span>
            <span>⚡ {w.electricity_consumption}</span>
            <button
              onClick={() => toggleWeapon(i)}
              disabled={canActivate}
            >
              {w.isActive ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
