// src/libs/state/Ships/SubsystemLogic.ts

import type { ShipState } from './ShipState';
import type { Subsystems, SubsystemType } from './ShipSubsystems';


/**
 * Calcule le nombre de slots actuellement disponibles (non détruits).
 */
export function getAvailableSlots(subsystems: Subsystems, type: SubsystemType): number {
  const system = subsystems[type];
  const perLevel = system.hpPerLevel;
  const currentHp = system.currentHp;

  if (currentHp <= 0) return 0;
  return Math.floor((currentHp + perLevel - 1) / perLevel); // équivalent à ceil(currentHp / perLevel)
}

/**
 * Retourne le multiplicateur de bonus effectif pour un sous-système.
 */
export function getSubsystemEffectiveBonus(
  ship: ShipState,
  type: SubsystemType
): number {
  const system = ship.subsystems[type];
  if (!system) return 0;

  const allocated = ship.energyAllocation[type] ?? 0;
  const available = getAvailableSlots(ship.subsystems, type);
  const effective = Math.min(allocated, available);

  return 1 + system.bonusPerLevel * effective;
}

/**
 * Met à jour les HP max et currentHp après changement de niveau (via boutique ou progression).
 */
export function updateSubsystemMaxHp(
  subsystems: Subsystems,
  type: SubsystemType,
  newLevel: number
): Subsystems {
  const system = subsystems[type];
  const newMaxHp = newLevel * system.hpPerLevel;
  const newCurrentHp = Math.min(system.currentHp, newMaxHp);

  return {
    ...subsystems,
    [type]: {
      ...system,
      level: newLevel,
      maxHp: newMaxHp,
      currentHp: newCurrentHp,
    },
  };
}

/**
 * Désactive les armes excédentaires si leur nombre actif dépasse les slots disponibles.
 * On désactive de droite à gauche (fin du tableau).
 */
export function enforceWeaponSlotLimit(ship: ShipState): ShipState {
  const allocatedSlots = ship.energyAllocation['weapons'] ?? 0;
  const activeWeapons = ship.weapons.filter((w) => w.isActive);

  if (activeWeapons.length <= allocatedSlots) return ship;

  const weapons = [...ship.weapons];
  let excess = activeWeapons.length - allocatedSlots;

  for (let i = weapons.length - 1; i >= 0 && excess > 0; i--) {
    if (weapons[i].isActive) {
      weapons[i] = { ...weapons[i], isActive: false };
      excess--;
    }
  }

  return {
    ...ship,
    weapons,
  };
}


/**
 * Inflige des dégâts à un sous-système, et ajuste l'allocation d'énergie si nécessaire.
 */
export function damageSubsystem(
  ship: ShipState,
  type: SubsystemType,
  damage: number
): ShipState {
  const system = ship.subsystems[type];
  const newHp = Math.max(0, system.currentHp - damage);

  const updatedSubsystems = {
    ...ship.subsystems,
    [type]: {
      ...system,
      currentHp: newHp,
    },
  };

  const maxAvailable = getAvailableSlots(updatedSubsystems, type);
  const currentAlloc = ship.energyAllocation[type] ?? 0;
  const adjustedAlloc = Math.min(currentAlloc, maxAvailable);

  const updatedAllocation = {
    ...ship.energyAllocation,
    [type]: adjustedAlloc,
  };

  return {
    ...ship,
    subsystems: updatedSubsystems,
    energyAllocation: updatedAllocation,
  };
}

/**
 * Vérifie si on peut allouer `amount` points au sous-système `type`.
 * - Respecte l’énergie max du vaisseau
 * - Ne dépasse pas les slots disponibles (HP non détruits)
 */
export function canAllocateEnergy(
  ship: ShipState,
  type: SubsystemType,
  amount: number
): boolean {
  const currentAllocation = ship.energyAllocation[type] ?? 0;
  const newAllocation = currentAllocation + amount;

  const availableSlots = getAvailableSlots(ship.subsystems, type);
  if (newAllocation > availableSlots) return false;

  const totalCurrent = Object.values(ship.energyAllocation).reduce((sum, v) => sum + v, 0);
  const totalNew = totalCurrent + amount;

  return totalNew <= ship.maxEnergy;
}


/**
 * Tente d’allouer ou de retirer un point d’énergie pour un sous-système donné.
 * Si l’opération est invalide, retourne l’état inchangé.
 */
export function allocateEnergyPoint(
  ship: ShipState,
  type: SubsystemType,
  delta: number
): ShipState {
  if (!canAllocateEnergy(ship, type, delta)) return ship;

  const current = ship.energyAllocation[type] ?? 0;
  return {
    ...ship,
    energyAllocation: {
      ...ship.energyAllocation,
      [type]: current + delta,
    },
  };
}

/**
 * Retire un point d’énergie alloué à un sous-système.
 * Ne fait rien si le sous-système est déjà à 0.
 */
export function deallocateEnergyPoint(
  ship: ShipState,
  type: SubsystemType
): ShipState {
  const current = ship.energyAllocation[type] ?? 0;
  if (current <= 0) return ship;

  return {
    ...ship,
    energyAllocation: {
      ...ship.energyAllocation,
      [type]: current - 1,
    },
  };
}