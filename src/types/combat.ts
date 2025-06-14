// src/types/combat.ts
import type { Ship } from "../models/ships/Ship";

// Résultat de resolveFight du logic existant.
// On suppose que resolveFight renvoie un objet contenant newPlayer, newEnemy, lastResult et scrapGain éventuel.
export interface FightResult {
  newPlayer: Ship;
  newEnemy: Ship | null;
  lastResult: string;
  scrapGain?: number;
}

// État du combat exposé par useCombat.
export interface CombatState {
  enemy: Ship | null;
  lastResult: string | null;
  gameOver: boolean;
}

// Actions exposées par useCombat.
// fight prend en entrée le playerShip courant, et retourne éventuellement le résultat pour que le parent mette à jour son playerShip & scrap.
export interface CombatActions {
  generateEnemy: () => void;
  fight: (playerShip: Ship) => FightResult | null;
  skip: () => string | null;       // retourne le message de fuite, ou null si pas d’ennemi
  resetCombat: () => void;         // remet l'état du combat à zéro (null, false, null)
}

// Combine état + actions.
export interface UseCombatReturn extends CombatState, CombatActions {}
