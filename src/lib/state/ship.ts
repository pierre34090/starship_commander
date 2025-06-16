export type ShipState = {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  cargo: number;
};

export const initShipState = (): ShipState => ({
  hp: 100,
  maxHp: 100,
  attack: 1,
  defense: 1,
  speed: 1,
  cargo: 1,
});

export const actions = {
  upgradeShip: (state: ShipState): ShipState => ({
    ...state,
    hp: state.hp + 1,
  }),
};
