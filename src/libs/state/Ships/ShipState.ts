//src/libs/state/Ships/ShipState.ts

import type { WeaponState } from '../WeaponState'


export type ShipState = {
    name: string;
    description: string;
    sprite: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    weapons: WeaponState[];
};

export const initShipState = (): ShipState => ({
    name: '',
    description: '',
    sprite: '',
    hp: 0,
    maxHp: 0,
    attack: 0,
    defense: 0,
    weapons: [],
});
