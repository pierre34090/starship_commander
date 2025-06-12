// src/models/ships/enemies/Bomber.ts
import { Ship } from "../Ship";
import { Ship_stats } from '../../stats/Ship_stats';

export class Bomber extends Ship {

  constructor() {
    super(
        new Ship_stats(20, 20, 8, 0, 0, 0),
        'sprites/vessels/bomber.png');
  }

  example_function(target: Ship) {
  }
}