// src/libs/logic/Combat/RoundManager.ts

import { computeEffectiveAttributes } from '../../state/Ships/ShipLogic';
import { processWeaponRound } from './AttackProcessor';
import { applyElementalStatusEffects } from './ElementalEffectUtils';
import { isShipDead } from '../../state/Ships/ShipLogic';
import { handleStageProgression } from './StageManager';
import { collectCombatReward } from './EndOfCombatUtils';
import { MessageBus } from '../../../contexts/MessageContext';

import type { GameState } from '../../state/GameState';
import type { GameMetaState } from '../../state/MetaGameState';
import type { ShipState } from '../../state/Ships/ShipState';

/**
 * Résout une étape complète de combat :
 * - attaque joueur + réponse ennemi
 * - effets élémentaires + regen
 * - récompense si l'ennemi meurt
 * - progression du stage si besoin
 */
export function runCombatStep(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const player = gameState.player_ship;
  const enemies = gameState.stageEnemies;

  const target = findNextEnemy(enemies);
  if (!target) return [gameState, metaState]; // rien à faire

  const attackerStats = computeEffectiveAttributes(player);
  const defenderStats = computeEffectiveAttributes(target);

  const [playerAfter1, ennemyAfter1] = processWeaponRound(player, attackerStats, target, defenderStats);
  const [ennemyAfter2, playerAfter2] = processWeaponRound(ennemyAfter1, defenderStats, playerAfter1, attackerStats);

  const finalPlayer = applyEffectsAndRegen(playerAfter2);
  const finalEnemy = applyEffectsAndRegen(ennemyAfter2);
  
  const defeated =
    isShipDead(finalEnemy) && target.status === 'alive'
      ? { ...finalEnemy, status: 'dead' as const }
      : undefined;

  const updatedEnemies = enemies.map((e) =>
    e === target ? defeated ?? finalEnemy : e
  );

  const withCombat = {
    ...gameState,
    player_ship: finalPlayer,
    stageEnemies: updatedEnemies,
  };

  const withRewards = defeated
    ? collectCombatReward(withCombat, defeated)
    : withCombat;

  return handleStageProgression(withRewards, metaState);
}

export function findNextEnemy(enemies: ShipState[]): ShipState | null {
  return enemies.find((e) => e.status === 'alive') ?? null;
}

/**
 * Applique les effets élémentaires, puis régénère le bouclier si le vaisseau est en vie.
 */
export function applyEffectsAndRegen(ship: ShipState): ShipState {
  if (ship.currentHp <= 0) return ship;

  let updated = applyElementalStatusEffects(ship);
  if (updated.currentHp <= 0) return updated;

  const stats = computeEffectiveAttributes(updated);
  const before = updated.currentShield ?? 0;
  const after = Math.min(stats.maxShield, before + stats.regenShield);
  const gained = after - before;

  if (gained > 0) {
    MessageBus.send({
      type: 'info',
      text: `${ship.name} regenerates ${gained} shield.`,
    });
  }

  return {
    ...updated,
    currentShield: after,
  };
}
