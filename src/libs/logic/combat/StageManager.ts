// src/libs/logic/combat/StageManager.ts

import type { GameState } from '../../state/GameState';
import type { GameMetaState } from '../../state/MetaGameState';
import { generateEnemiesForStage } from '../../models/Ships/EnemyFactory';
import { MessageBus } from '../../../contexts/MessageContext';
import { isShipDead } from '../../state/Ships/ShipLogic';

const LAST_STAGE_INDEX = 2;

/**
 * Passe au stage suivant :
 * - Génère une nouvelle liste d'ennemis (5 + boss)
 * - Réinitialise les flags de fin
 * - Met à jour le compteur de stage
 */
export function advanceStage(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const nextStage = metaState.currentStageIndex + 1;
  const stageEnemies = generateEnemiesForStage(nextStage);

  MessageBus.send({
    type: 'success',
    text: `Stage ${nextStage + 1} begins!`,
  });

  return [
    {
      ...gameState,
      stageEnemies,
    },
    {
      ...metaState,
      currentStageIndex: nextStage,
      gameOver: false,
      gameWin: false,
    },
  ];
}

/**
 * Gère la progression logique d’un stage :
 * - Met à jour les statuts des ennemis en fonction de leur HP
 * - Détecte la mort du joueur → game over
 * - Détecte la mort du boss (dernier ennemi) → passage au stage suivant ou victoire
 */
export function handleStageProgression(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  // Mise à jour des statuts "alive"/"dead" en fonction des HP
  const syncedEnemies = gameState.stageEnemies.map(ship => ({
    ...ship,
    status: isShipDead(ship) ? 'dead' : ship.status,
  }));

  const syncedState: GameState = {
    ...gameState,
    stageEnemies: syncedEnemies,
  };

  // Fin du jeu si le joueur est mort
  if (isShipDead(gameState.player_ship)) {
    return [syncedState, { ...metaState, gameOver: true }];
  }

  // Si le boss (dernier ennemi) est mort, on avance
  const boss = syncedEnemies.at(-1);
  const bossDead = boss?.status === 'dead';

  if (bossDead) {
    if (metaState.currentStageIndex >= LAST_STAGE_INDEX) {
      return [syncedState, { ...metaState, gameWin: true }];
    }
    return advanceStage(syncedState, metaState);
  }

  return [syncedState, metaState];
}
