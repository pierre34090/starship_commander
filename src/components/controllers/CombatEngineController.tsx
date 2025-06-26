// src/components/controllers/CombatEngineController.tsx
import { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../../contexts/GameContext';
import { runCombatStep } from '../../libs/logic/combat/RoundManager';

/**
 * Ce composant React ne rend rien.
 * Il agit comme contrôleur logique du système de rounds cadencés :
 * - déclenche runCombatStep() toutes les X ms si non en pause
 * - s'arrête automatiquement en pause
 */
export function CombatEngineController() {
  const context = useContext(GameContext);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!context) return;

    const { gameState, metaState, setGameState, setMetaState } = context;

    if (metaState.isPaused) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const [nextGameState, nextMetaState] = runCombatStep(gameState, metaState);
      setGameState(nextGameState);
      setMetaState(nextMetaState);
    }, metaState.roundSpeed ?? 1000); // ms entre chaque round

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [context?.metaState.isPaused, context?.metaState.roundSpeed]);

  return null;
}
