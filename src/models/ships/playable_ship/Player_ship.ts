// src/models/ships/playable_ship/Player_ship.ts
import { Ship } from "../Ship";
import { Ship_stats } from '../../stats/Ship_stats';

export class Player_ship extends Ship {
    
  constructor() {
    super(
        new Ship_stats(100, 100, 4, 0, 0, 0),
        'sprites/vessels/player_ship.png');
  }

  example_function(target: Ship) {
  }
}