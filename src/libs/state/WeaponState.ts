export type WeaponState = {
    name: string;
    description: string;
    attack: number;
}

export const initWeaponState = (): WeaponState => ({
    name: '',
    description: '',
    attack: 0,
});