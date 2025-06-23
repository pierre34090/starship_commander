// src/libs/logic/Combat/CombatEngine.ts

import { getHitChance, computeRawDamage, applyArmorReduction, splitDamageBetweenShieldAndHP } from './DamageModel';
import type { ShipState } from '../../state/Ships/ShipState';
import type { WeaponState } from '../../state/Items/WeaponState';
import type { ShipEffectiveAttributes } from '../../state/Ships/ShipEffectiveAttributes';
import type { DamageType } from './DamageMultipliers';

import { MessageBus } from '../../../contexts/MessageContext';

export type DamageReport = {
  evaded: boolean;
  damageType: DamageType;
  rawDamage: number;
  absorbedByArmor: number;
  toShield: number;
  toHp: number;
  newShield: number;
  newArmor: number;
  newHp: number;
};

export function takeAttack(
  defender: ShipState,
  attackerStats: ShipEffectiveAttributes,
  defenderStats: ShipEffectiveAttributes,
  weapon: WeaponState
): [ShipState, DamageReport] {
  const hitChance = getHitChance(attackerStats.precision, defenderStats.evasion);
  const hit = Math.random() < hitChance;

  if (!hit) {
    MessageBus.send({
      type: 'combat',
      text: `${defender.name} dodge ${weapon.name} attack.`,
    });
    return [
      { ...defender },
      {
        evaded: true,
        damageType: weapon.type,
        rawDamage: 0,
        absorbedByArmor: 0,
        toShield: 0,
        toHp: 0,
        newShield: defender.currentShield ?? 0,
        newArmor: defender.currentArmor ?? 0,
        newHp: defender.currentHp,
      },
    ];
  }

  const rawDamage = computeRawDamage(weapon, attackerStats);

  const {
    damageAfterArmor,
    absorbedByArmor,
    newCurrentArmor,
  } = applyArmorReduction(rawDamage, weapon.type, defenderStats, defender.currentArmor ?? 0);

  const {
    toShield,
    toHp,
  } = splitDamageBetweenShieldAndHP(damageAfterArmor, weapon.type, defender.currentShield ?? 0);

  const newShield = Math.max(0, (defender.currentShield ?? 0) - toShield);
  const newHp = Math.max(0, defender.currentHp - toHp);

  const updatedDefender: ShipState = {
    ...defender,
    currentShield: newShield,
    currentArmor: newCurrentArmor,
    currentHp: newHp,
  };

  MessageBus.send({
      type: 'combat',
      text: `${defender.name} get hit by ${weapon.name} attack. He take ${toHp} hp damage and ${toShield} shield damage. Armor absorbed ${absorbedByArmor} damage.`,
    });

  return [
    updatedDefender,
    {
      evaded: false,
      damageType: weapon.type,
      rawDamage,
      absorbedByArmor,
      toShield,
      toHp,
      newShield,
      newArmor: newCurrentArmor,
      newHp,
    },
  ];
}

export function processWeaponRound(
  attacker: ShipState,
  attackerStats: ShipEffectiveAttributes,
  defender: ShipState,
  defenderStats: ShipEffectiveAttributes
): [ShipState, WeaponState[], DamageReport[]] {
  const updatedWeapons: WeaponState[] = [];
  let updatedDefender = defender;
  const reports: DamageReport[] = [];

  for (const weapon of attacker.weapons) {
    if (!weapon.isActive) {
      updatedWeapons.push(weapon);
      continue;
    }

    if (weapon.cooldownRemaining > 0) {
      updatedWeapons.push({
        ...weapon,
        cooldownRemaining: weapon.cooldownRemaining - 1,
      });
      continue;
    }

    const [newDefender, report] = takeAttack(
      updatedDefender,
      attackerStats,
      defenderStats,
      weapon
    );

    updatedDefender = newDefender;
    reports.push(report);

    updatedWeapons.push({
      ...weapon,
      cooldownRemaining: weapon.cooldown,
    });
  }

  return [updatedDefender, updatedWeapons, reports];
}
