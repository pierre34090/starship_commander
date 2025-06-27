// src/libs/state/MetaGameState.ts

export type GameMetaState = {
  gameOver: boolean;
  gameWin: boolean;
  currentStageIndex: number;

  isPaused: boolean;
  roundSpeed: number; // en ms 
};

export const initGameMetaState = (): GameMetaState => ({
  gameOver: false,
  gameWin: false,
  currentStageIndex: 0,

  isPaused: false,
  roundSpeed: 1000,
});
