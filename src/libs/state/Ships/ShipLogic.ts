// src/libs/logic/Ships/ShipLogic.ts


import type { BaseModuleBonuses, FlatAndMult } from '../Items/ModuleBonuses';
import type { SubsystemType } from '../Ships/ShipSubsystems';

import { DAMAGE_TYPES, ELEMENTAL_TYPES } from '../../logic/combat/DamageType';

import { ShipState } from '../../state/Ships/ShipState';
import { ShipEffectiveAttributes } from '../../state/Ships/ShipEffectiveAttributes';
import { getSubsystemEffectiveBonus } from './SubsystemLogic';



// --- Effective computation ---

export function computeEffectiveAttributes(ship: ShipState): ShipEffectiveAttributes {
  const base = ship.baseStats;
  const activeModules = ship.modules.filter((mod) => mod.isActive);
  const allocation = ship.energyAllocation ?? {
    shields: 0,
    weapons: 0,
    engines: 0,
    targeting: 0,
  };


  // --- Helpers ---

  function scaledBonus(
    extractor: (b: BaseModuleBonuses) => FlatAndMult | undefined
  ): number {
    let flat = 0;
    let mult = 0;
    for (const mod of activeModules) {
      const b = mod.bonuses && extractor(mod.bonuses);
      flat += b?.flat ?? 0;
      mult += b?.mult ?? 0;
    }
    return flat * (1 + mult);
  }

  function scaledBonusWithBase(
    extractor: (b: BaseModuleBonuses) => FlatAndMult | undefined,
    baseValue: number
  ): number {
    let flat = 0;
    let mult = 0;
    for (const mod of activeModules) {
      const b = mod.bonuses && extractor(mod.bonuses);
      flat += b?.flat ?? 0;
      mult += b?.mult ?? 0;
    }
    return (baseValue + flat) * (1 + mult);
  }

  function scaledBonusByType<T extends string>(
    extractor: (b: BaseModuleBonuses) => Record<T, FlatAndMult> | undefined,
    types: T[]
  ): Record<T, number> {
    return Object.fromEntries(
      types.map((type) => {
        let flat = 0;
        let mult = 0;
        for (const mod of activeModules) {
          const bonuses = mod.bonuses;
          const record = bonuses && extractor(bonuses);
          const entry = record?.[type];
          flat += entry?.flat ?? 0;
          mult += entry?.mult ?? 0;
        }
        return [type, flat * (1 + mult)];
      })
    ) as Record<T, number>;
  }


  // --- Computation ---

  return {
    maxHp: scaledBonusWithBase((b) => b.hp, base.baseHp),
    maxShield: getSubsystemEffectiveBonus(ship, 'shields') *
              scaledBonusWithBase((b) => b.maxShield, base.baseShield),
    maxArmor: scaledBonusWithBase((b) => b.armor, base.baseArmor),

    regenShield: getSubsystemEffectiveBonus(ship, 'shields') *
                scaledBonus((b) => b.regenShield),

    globalDamage: scaledBonusWithBase((b) => b.globalDamage, base.baseGlobalDamage),
    precision: getSubsystemEffectiveBonus(ship, 'targeting') *
              scaledBonusWithBase((b) => b.precision, base.basePrecision),
    evasion: getSubsystemEffectiveBonus(ship, 'engines') *
            scaledBonusWithBase((b) => b.evasion, base.baseEvasion),

    regenAmmo: scaledBonus((b) => b.regenAmmo),
    maxAmmo: scaledBonus((b) => b.maxAmmo),

    elementalEffectProbability: scaledBonus((b) => b.elementalEffectProbability),

    damageByType: scaledBonusByType((b) => b.damageByType, DAMAGE_TYPES),
    elementalDamage: scaledBonusByType((b) => b.elementalDamage, ELEMENTAL_TYPES),
    elementalEffectDuration: scaledBonusByType((b) => b.elementalEffectDuration, ELEMENTAL_TYPES),
  };

}

// Weapon target manager


export function assignWeaponTarget(
  ship: ShipState,
  weaponId: string,
  target: { shipId: string; subsystem: SubsystemType } | null
): ShipState {
  const weapons = ship.weapons.map((w) =>
    w.id === weaponId
      ? { ...w, target: target ?? undefined }
      : w
  );

  return {
    ...ship,
    weapons,
  };
}


// --- Ship wrapper ---

export type ShipComputed = {
  ship: ShipState;
  attributes: ShipEffectiveAttributes;
};

export function computeShip(ship: ShipState): ShipComputed {
  return {
    ship,
    attributes: computeEffectiveAttributes(ship),
  };
}

export function isShipDead(ship: ShipState): boolean {
  return ship.currentHp <= 0;
}

// --- Stat modifiers ---

export function modifyHp(
  ship: ShipState,
  delta: number,
  attrs: ShipEffectiveAttributes
): [ShipState, number] {
  const max = attrs.maxHp;
  const before = ship.currentHp;
  const after = Math.max(0, Math.min(before + delta, max));
  const applied = after - before;
  return [{ ...ship, currentHp: after }, applied];
}

export function modifyShield(
  ship: ShipState,
  delta: number,
  attrs: ShipEffectiveAttributes
): [ShipState, number] {
  const max = attrs.maxShield;
  const before = ship.currentShield;
  const after = Math.max(0, Math.min(before + delta, max));
  const applied = after - before;
  return [{ ...ship, currentShield: after }, applied];
}

export function modifyArmor(
  ship: ShipState,
  delta: number,
  attrs: ShipEffectiveAttributes
): [ShipState, number] {
  const max = attrs.maxArmor;
  const before = ship.currentArmor;
  const after = Math.max(0, Math.min(before + delta, max));
  const applied = after - before;
  return [{ ...ship, currentArmor: after }, applied];
}


