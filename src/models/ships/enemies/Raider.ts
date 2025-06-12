// src/models/ships/enemies/Raider.ts
import { Ship } from "../Ship";
import { Ship_stats } from '../../stats/Ship_stats';

export class Raider extends Ship {

  constructor() {
    super(
        new Ship_stats(40, 40, 4, 0, 0, 0),
        'sprites/vessels/raider.png');
  }

  example_function(target: Ship) {
  }
}