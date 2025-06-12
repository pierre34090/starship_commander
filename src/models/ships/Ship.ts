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

  /** Inflige des dégâts immuables via updateStats */
  receiveDamage(dmg: number): this {
    return this.updateStats({ hp: this.stats.hp - dmg });
  }

  /** Répare immuablement via updateStats */
  repair(amount: number): this {
    return this.updateStats({ hp: this.stats.hp + amount });
  }

  /**
   * Attaque la cible et renvoie une nouvelle instance blessée de la cible
   */
  attack(target: Ship): Ship {
    return target.receiveDamage(this.stats.attack);
  }

  abstract example_function(target: Ship): void;
}