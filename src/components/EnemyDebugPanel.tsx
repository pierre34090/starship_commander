import React from 'react';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';
import type { EnemyShipState } from '../libs/state/Ships/EnemyShipState';
import type { WeaponState } from '../libs/state/Items/WeaponState';
import type { ModuleState } from '../libs/state/Items/ModuleState';

export const EnemyDebugPanel: React.FC<{ enemy: EnemyShipState }> = ({ enemy }) => {
  const ship = enemy.ship;
  const base = ship.baseStats;
  const attrs = computeEffectiveAttributes(ship);

  return (
    <div style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8, backgroundColor: '#ffecec', overflowY: 'auto', maxHeight: '80vh' }}>
      <h3>Enemy Debug</h3>
      <p><strong>{ship.name}</strong></p>
      <p>HP: {ship.currentHp}</p>
      <p>Shield: {ship.currentShield}</p>
      <p>Armor: {ship.currentArmor}</p>
      <p>Ammo: {ship.currentAmmo}</p>

      <h4>Base Stats</h4>
      <ul>
        {Object.entries(base).map(([k, v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>

      <h4>Effective Stats</h4>
      <ul>
        {Object.entries(attrs).map(([k, v]) => {
          if (typeof v === 'number') {
            return <li key={k}>{k}: {v.toFixed(2)}</li>;
          } else if (typeof v === 'object' && v !== null) {
            return (
              <li key={k}>
                {k}:
                <ul>
                  {Object.entries(v).map(([subk, subv]) => (
                    <li key={subk}>{subk}: {subv.toFixed(2)}</li>
                  ))}
                </ul>
              </li>
            );
          }
          return null;
        })}
      </ul>

      <h4>Status Effects</h4>
      {ship.statusEffects.length === 0 ? (
        <p>None</p>
      ) : (
        <ul>
          {ship.statusEffects.map((effect, i) => (
            <li key={i}>
              {effect.type} — {effect.remainingTurns} turn{effect.remainingTurns > 1 ? 's' : ''}
            </li>
          ))}
        </ul>
      )}

      <h4>Weapons</h4>
      {ship.weapons.length === 0 ? <p>None</p> : (
        <ul>
          {ship.weapons.map((w: WeaponState, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <strong>{w.name}</strong>: {w.description}<br />
              Type: {w.type}<br />
              Damage: {w.damage ?? 'N/A'}<br />
              Cooldown: {w.cooldown} (Remaining: {w.cooldownRemaining ?? 0})<br />
              Ammo Consumption: {w.ammoConsumption}<br />
              Energy Consumption: {w.energyConsumption}<br />
              Elemental Effect Probability: {(w.elementalEffectProbability * 100).toFixed(1)}%<br />
            </li>
          ))}
        </ul>
      )}

      <h4>Modules</h4>
      {ship.modules.length === 0 ? <p>None</p> : (
        <ul>
          {ship.modules.map((m: ModuleState, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <strong>{m.name}</strong>: {m.description}<br />
              Energy Consumption: {m.energyConsumption}<br />
              Bonuses:<br />
              {m.bonuses ? (
                <ul>
                  {Object.entries(m.bonuses).map(([bonusKey, bonusVal]) => {
                    if (typeof bonusVal === 'object' && bonusVal !== null) {
                      if ('flat' in bonusVal || 'mult' in bonusVal) {
                        return (
                          <li key={bonusKey}>
                            {bonusKey}: flat={bonusVal.flat ?? 0}, mult={bonusVal.mult ?? 0}
                          </li>
                        );
                      } else {
                        return (
                          <li key={bonusKey}>
                            {bonusKey}:
                            <ul>
                              {Object.entries(bonusVal as Record<string, any>).map(([subKey, subVal]) => (
                                <li key={subKey}>
                                  {subKey}: flat={subVal.flat ?? 0}, mult={subVal.mult ?? 0}
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      }
                    } else {
                      return (
                        <li key={bonusKey}>
                          {bonusKey}: {String(bonusVal)}
                        </li>
                      );
                    }
                  })}
                </ul>
              ) : <em>No bonuses</em>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
