import { MessageBus } from '../../../contexts/MessageContext';

export type CombatEvent =
  | {
      type: 'attack';
      weaponId: string;
      weaponName: string;
      attackerId: string;
      attackerName: string;
      defenderId: string;
      defenderName: string;
      damageFinal: number;
      damageRaw: number;
      absorbedArmor: number;
      hitResult: 'hit' | 'miss' | 'critical';
      hitChance: number;
    }
  | {
      type: 'effectProc';
      effectType: string;
      defenderId: string;
      defenderName: string;
      duration: number;
      weaponId: string;
      weaponName: string;
    }
  | {
      type: 'resourceConsumption';
      weaponId: string;
      weaponName: string;
      ammoUsed: number;
      attackerId: string;
      attackerName: string;
    }
  | {
      type: 'endOfRound';
      shieldRegen: number;
      dotDamage: number;
    }
  | {
      type: 'endOfCombat';
      xpGained: number;
      creditsGained: number;
    };

export type DamageStats = {
  totalDamage: number;
  hits: number;
  ammoUsed: number;
  damagePerAmmo: number;
};

type AttackEventPartial = Omit<
  Extract<CombatEvent, { type: 'attack' }>,
  'attackerId' | 'attackerName'
>;

export class CombatReportCollector {
  readonly events: CombatEvent[];
  readonly damageStatsByWeapon: Record<string, DamageStats>;

  constructor(
    events: CombatEvent[] = [],
    damageStatsByWeapon: Record<string, DamageStats> = {}
  ) {
    this.events = events;
    this.damageStatsByWeapon = damageStatsByWeapon;
  }

  // Adds an event, returns a new CombatReportCollector with updated events
  addEvent(event: CombatEvent): CombatReportCollector {
    return new CombatReportCollector([...this.events, event], this.damageStatsByWeapon);
  }

  // Adds damage info for a weapon, returns new instance with updated stats
  addDamage(weaponId: string, damage: number, ammoUsed: number): CombatReportCollector {
    const stats = this.damageStatsByWeapon[weaponId] ?? {
      totalDamage: 0,
      hits: 0,
      ammoUsed: 0,
      damagePerAmmo: 0,
    };

    const updatedStats: DamageStats = {
      totalDamage: stats.totalDamage + damage,
      hits: stats.hits + 1,
      ammoUsed: stats.ammoUsed + ammoUsed,
      damagePerAmmo: (stats.ammoUsed + ammoUsed) > 0 ? (stats.totalDamage + damage) / (stats.ammoUsed + ammoUsed) : 0,
    };

    return new CombatReportCollector(
      this.events,
      { ...this.damageStatsByWeapon, [weaponId]: updatedStats }
    );
  }

  // Merges another CombatReportCollector into this one, returns new instance
  merge(other: CombatReportCollector): CombatReportCollector {
    // Merge events by concatenation
    const mergedEvents = [...this.events, ...other.events];

    // Merge damage stats by weaponId
    const mergedDamageStats: Record<string, DamageStats> = { ...this.damageStatsByWeapon };

    for (const [weaponId, otherStats] of Object.entries(other.damageStatsByWeapon)) {
      const thisStats = mergedDamageStats[weaponId];
      if (thisStats) {
        mergedDamageStats[weaponId] = {
          totalDamage: thisStats.totalDamage + otherStats.totalDamage,
          hits: thisStats.hits + otherStats.hits,
          ammoUsed: thisStats.ammoUsed + otherStats.ammoUsed,
          damagePerAmmo:
            thisStats.ammoUsed + otherStats.ammoUsed > 0
              ? (thisStats.totalDamage + otherStats.totalDamage) / (thisStats.ammoUsed + otherStats.ammoUsed)
              : 0,
        };
      } else {
        mergedDamageStats[weaponId] = otherStats;
      }
    }

    return new CombatReportCollector(mergedEvents, mergedDamageStats);
  }

  // Clears all collected data, returns a fresh instance
  reset(): CombatReportCollector {
    return new CombatReportCollector();
  }

  // Dispatch all events to message bus
  flushToMessageBus(): void {
    sendCombatEventsToMessageBus(this.events);
  }
}

export function sendCombatEventsToMessageBus(events: CombatEvent[]) {
  for (const event of events) {
    switch (event.type) {
      case 'attack':
        MessageBus.send({
          type: 'combat',
          text: `${event.attackerName} hits ${event.defenderName} with ${event.weaponName} for ${event.damageFinal} damage${event.hitResult === 'critical' ? ' (CRITICAL!)' : ''}.`,
        });
        break;

      case 'effectProc':
        MessageBus.send({
          type: 'combat',
          text: `${event.defenderName} is affected by ${event.effectType} for ${event.duration} turns (weapon: ${event.weaponName}).`,
        });
        break;

      case 'resourceConsumption':
        MessageBus.send({
          type: 'combat',
          text: `${event.attackerName} used ${event.ammoUsed} ammo from ${event.weaponName}.`,
        });
        break;

      case 'endOfRound':
        MessageBus.send({
          type: 'info',
          text: `End of round: shield regen ${event.shieldRegen}, damage over time ${event.dotDamage}.`,
        });
        break;

      case 'endOfCombat':
        MessageBus.send({
          type: 'success',
          text: `Combat ended: +${event.xpGained} XP, +${event.creditsGained} credits earned.`,
        });
        break;

      default:
        console.warn('Unknown combat event type:', event);
    }
  }
}
