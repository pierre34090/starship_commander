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
 * Désactive des armes pour compenser une perte d’énergie.
 * On retire exactement la consommation totale des armes désactivées,
 * moins ce qui a déjà été retiré par deallocateEnergyPoint.
 */
export function enforceWeaponEnergyLimit(
  ship: ShipState,
  amountRemoved: number
): ShipState {
  let remainingToDisable = amountRemoved;
  let totalDisabledEnergy = 0;
  const updatedWeapons: typeof ship.weapons = [];

  // On désactive de droite à gauche
  for (let i = ship.weapons.length - 1; i >= 0; i--) {
    const weapon = ship.weapons[i];

    if (weapon.isActive && remainingToDisable > 0) {
      remainingToDisable -= weapon.energyConsumption;
      totalDisabledEnergy += weapon.energyConsumption;

      updatedWeapons.unshift({
        ...weapon,
        isActive: false,
      });
    } else {
      updatedWeapons.unshift(weapon);
    }
  }

  const extraToRemove = Math.max(0, totalDisabledEnergy - amountRemoved);
  const currentAlloc = ship.energyAllocation['weapons'] ?? 0;
  const newAlloc = Math.max(0, currentAlloc - extraToRemove);

  return {
    ...ship,
    weapons: updatedWeapons,
    energyAllocation: {
      ...ship.energyAllocation,
      weapons: newAlloc,
    },
  };
}




/**
 * Inflige des dégâts à un sous-système, met à jour les HP, 
 * et réduit l’allocation d’énergie si nécessaire.
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

  const deltaToRemove = currentAlloc > maxAvailable
    ? currentAlloc - maxAvailable
    : 0;

  const partiallyUpdatedShip: ShipState = {
    ...ship,
    subsystems: updatedSubsystems,
  };

  // On passe par la fonction centrale
  return deltaToRemove > 0
    ? deallocateEnergyPoint(partiallyUpdatedShip, type, deltaToRemove)
    : {
        ...partiallyUpdatedShip,
        energyAllocation: {
          ...partiallyUpdatedShip.energyAllocation,
          [type]: currentAlloc,
        },
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
 * Retire un ou plusieurs points d’énergie alloués à un sous-système.
 * Si le sous-système est "weapons", désactive les armes excédentaires.
 */
export function deallocateEnergyPoint(
  ship: ShipState,
  subsystem: SubsystemType,
  amount: number = 1
): ShipState {
  const current = ship.energyAllocation[subsystem] ?? 0;
  const newAllocation = Math.max(0, current - amount);

  const updatedShip: ShipState = {
    ...ship,
    energyAllocation: {
      ...ship.energyAllocation,
      [subsystem]: newAllocation,
    },
  };

  // Cas particulier : ajuster les armes après retrait d'énergie
  if (subsystem === 'weapons') {
    return enforceWeaponEnergyLimit(updatedShip, amount);
  }

  return updatedShip;
}
