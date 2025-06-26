// src/libs/state/MetaGameState.ts

export type GameMetaState = {
  gameOver: boolean;
  gameWin: boolean;
  currentStage: number;

  isPaused: boolean;
  roundSpeed: number; // en ms 
};

export const initGameMetaState = (): GameMetaState => ({
  gameOver: false,
  gameWin: false,
  currentStage: 0,

  isPaused: false,
  roundSpeed: 1000,
});
