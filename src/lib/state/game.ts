type GameState = {
  money: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  cargo: number;
  killedEnemies: Ship[];
};

const initState = (): GameState => ({
  money: 500,
  hp: 100,
  maxHp: 100,
  attack: 1,
  defense: 1,
  speed: 1,
  cargo: 1,
  killedEnemies: [],
  ship: {
    hp: 100,
    color: "blue",
    // ...
  },
});

const actions = {
  // upgradeEconomy: (state) => {
  //   state.money = state.money + 1;
  //   return state;
  // },
  upgradeEconomy: (state: GameState): GameState => ({
    ...state,
    money: state.money + 1,
  }),
  attack: (state: GameState): GameState => ({
    ...state,
    attack: state.attack + 1,
  }),
  defense: (state: GameState): GameState => ({
    ...state,
    defense: state.defense + 1,
  }),
  speed: (state: GameState): GameState => ({
    ...state,
    speed: state.speed + 1,
  }),
  cargo: (state: GameState): GameState => ({
    ...state,
    cargo: state.cargo + 1,
  }),
  killEnemy: (state: GameState, enemy: Ship): GameState => ({
    ...state,
    killedEnemies: [...state.killedEnemies, enemy],
  }),
  upgradeShip: (state: GameState): GameState => ({
    ...state,
    ship: {
      ...state.ship,
      hp: state.ship.hp + 1,
    },
  }),
};

const currentState = initState();

export { GameState, actions, currentState };
