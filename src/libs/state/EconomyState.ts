export type EconomyState = {
    credits: number;
    scrap: number;
    income: number;
    ecoCost: number;
    forceCost: number;
    repairCost: number;
    repairValue: number;
};


export const initEconomyState = (): EconomyState => ({
    credits: 1000,
    scrap: 0,
    income: 0,
    ecoCost: 0,
    forceCost: 1,
    repairCost: 1,
    repairValue: 10,
});