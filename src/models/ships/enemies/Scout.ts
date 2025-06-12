// src/models/ships/enemies/Scout.ts
import { Ship } from "../Ship";
import { Ship_stats } from '../../stats/Ship_stats';

export class Scout extends Ship {

  constructor() {
    super(
        new Ship_stats(80, 80, 2, 0, 0, 0),
        'sprites/vessels/scout.png');
  }

  example_function(target: Ship) {

  }
}