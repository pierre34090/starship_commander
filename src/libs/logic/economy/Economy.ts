import type { EconomyState } from '../../state/EconomyState';
import type { PlayerShipState } from '../../state/Ships/PlayerShipState';
import { MessageBus } from '../../../contexts/MessageContext';



export function increaseIncome(
  economy: EconomyState
): EconomyState {
  const [canSpend, updatedEconomy] = spendCredits(economy, economy.ecoCost);

  if (!canSpend) {
    MessageBus.send({
        type: 'error',
        text: `You have +${economy.credits} credits instead of +${economy.ecoCost}.`,
    });
    return  economy;
  }

  const upgradedEconomy: EconomyState = {
    ...updatedEconomy,
    income: updatedEconomy.income + 1,
    ecoCost: updatedEconomy.ecoCost + 10,
  };

  MessageBus.send({
    type: 'success',
    text: `Income upgraded to +${upgradedEconomy.income} !`,
  });

  return upgradedEconomy;
}

export function repairPlayer(
  economy: EconomyState,
  playerShip: PlayerShipState
): [EconomyState, PlayerShipState] {
  // Cas 1 : HP déjà au max
  if (playerShip.hp >= playerShip.maxHp) {
    MessageBus.send({
      type: 'info',
      text: 'Your ship is already at full health.',
    });
    return [economy, playerShip];
  }

  // Cas 2 : Pas assez de crédits
  if (economy.credits < economy.repairCost) {
    return [economy, playerShip];
  }

  // Cas 3 : Réparation possible
  const updatedEconomy: EconomyState = {
    ...economy,
    credits: economy.credits - economy.repairCost,
    repairCost: economy.repairCost + 10,
  };

  const updatedPlayerShip: PlayerShipState = {
    ...playerShip,
    hp: Math.min(playerShip.hp + economy.repairValue, playerShip.maxHp),
  };

  MessageBus.send({
    type: 'success',
    text: `+${updatedPlayerShip.hp - playerShip.hp} HP repaired.`,
    });
  return [updatedEconomy, updatedPlayerShip];
}

export function increaseAttack(
  economy: EconomyState,
  playerShip: PlayerShipState
): [EconomyState, PlayerShipState] {
  const [canSpend, updatedEconomy] = spendCredits(economy, economy.attackCost);

  if (!canSpend) {
    return [economy, playerShip];
  }

  const upgradedEconomy: EconomyState = {
    ...updatedEconomy,
    attackCost: updatedEconomy.attackCost + 10,
  };

  const upgradedPlayerShip: PlayerShipState = {
    ...playerShip,
    attack: playerShip.attack + 1,
  };

    MessageBus.send({
        type: 'success',
        text: `Attack upgraded to +${upgradedPlayerShip.attack} !`,
    }); 

  return [upgradedEconomy, upgradedPlayerShip];
}

export function spendCredits(
  economy: EconomyState,
  amount: number
): [boolean, EconomyState] {
  if (economy.credits < amount) {

    MessageBus.send({
        type: 'error',
        text: `You have +${economy.credits} credits instead of +${economy.ecoCost}.`,
    });
    return [false, economy];
  }

  const updatedEconomy: EconomyState = {
    ...economy,
    credits: economy.credits - amount,
  };

  return [true, updatedEconomy];
}
