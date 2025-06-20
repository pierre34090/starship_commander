//src/libs/state/MetaGameState.ts

export type GameMetaState = {
  gameOver: boolean;
  gameWin: boolean;
  currentStage: number;
};

export const initGameMetaState = (): GameMetaState => ({
  gameOver: false,
  gameWin: false,
  currentStage: 0,
});