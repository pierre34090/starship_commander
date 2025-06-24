// src/libs/logic/Combat/CombatReportCollector.ts

export type CombatEvent =
  | {
      type: 'attack';
      weaponId: string;
      damageFinal: number;
      damageRaw: number;
      targetId: string;
      absorbedArmor: number;
    }
  | {
      type: 'effectProc';
      effectType: string;
      targetId: string;
      duration: number;
    }
  | {
      type: 'resourceConsumption';
      weaponId: string;
      ammoUsed: number;
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

export class CombatReportCollector {
  public events: CombatEvent[] = [];
  public damageStatsByWeapon: Record<string, DamageStats> = {};

  /** Ajoute un event au rapport */
  addEvent(event: CombatEvent): void {
    this.events.push(event);
  }

  /** Ajoute des dégâts cumulés pour une arme donnée */
  addDamage(weaponId: string, damage: number, ammoUsed: number): void {
    if (!this.damageStatsByWeapon[weaponId]) {
      this.damageStatsByWeapon[weaponId] = {
        totalDamage: 0,
        hits: 0,
        ammoUsed: 0,
        damagePerAmmo: 0,
      };
    }
    const stat = this.damageStatsByWeapon[weaponId];
    stat.totalDamage += damage;
    stat.hits++;
    stat.ammoUsed += ammoUsed;
    stat.damagePerAmmo = stat.ammoUsed > 0 ? stat.totalDamage / stat.ammoUsed : 0;
  }

  /** Vide tous les events et stats */
  reset(): void {
    this.events = [];
    this.damageStatsByWeapon = {};
  }
}
