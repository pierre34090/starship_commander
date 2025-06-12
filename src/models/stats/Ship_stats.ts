// src/models/stats/Ship_stats.ts
export class Ship_stats {
  constructor(
    public hp: number,
    public maxHp: number,
    public attack: number,
    public defense: number,
    public speed: number,
    public cargo: number
  ) {}

  /**
   * Crée une NOUVELLE instance de Ship_stats
   * en appliquant uniquement les propriétés passées en override.
   */
  clone(overrides: Partial<Ship_stats>): Ship_stats {
    return new Ship_stats(
      overrides.hp      ?? this.hp,
      overrides.maxHp   ?? this.maxHp,
      overrides.attack  ?? this.attack,
      overrides.defense ?? this.defense,
      overrides.speed   ?? this.speed,
      overrides.cargo   ?? this.cargo
    );
  }
}