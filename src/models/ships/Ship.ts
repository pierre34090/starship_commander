// src/models/ships/Ship.ts
import { Ship_stats } from '../stats/Ship_stats';

export abstract class Ship {
  constructor(
    public stats: Ship_stats,
    public sprite: string
  ) {}

  /** Vérifie si le vaisseau est détruit */
  isDestroyed(): boolean {
    return this.stats.hp <= 0;
  }

  /** Clone immuable en remplaçant uniquement les stats */
  protected cloneWithStats(stats: Ship_stats): this {
    const clone = Object.create(Object.getPrototypeOf(this)) as this;
    clone.stats  = stats;
    clone.sprite = this.sprite;
    return clone;
  }

  /** Met à jour n'importe quelle stat et renvoie un clone */
  updateStats(overrides: Partial<Ship_stats>): this {
    const newStats = this.stats.clone(overrides);
    return this.cloneWithStats(newStats);
  }

  receiveDamage(dmg: number): this {
    const newHp = Math.max(0, this.stats.hp - dmg);
    return this.updateStats({ hp: newHp });
  }
  repair(amount: number): this {
    const newHp = Math.min(this.stats.maxHp, this.stats.hp + amount);
    return this.updateStats({ hp: newHp });
  }

  attack(target: Ship): Ship {
    return target.receiveDamage(this.stats.attack);
  }

  abstract example_function(target: Ship): void;
}