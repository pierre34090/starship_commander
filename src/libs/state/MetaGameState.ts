//src/libs/state/MetaGameState.ts

export type GameMetaState = {
  gameOver: boolean;
  gameWin: boolean;
  generalMessages: string[]; // ou un type { text: string; type: 'info' | 'error' }[]
  currentStage: number;
};

export const initGameMetaState = (): GameMetaState => ({
  gameOver: false,
  gameWin: false,
  generalMessages: [],
  currentStage: 0,
});