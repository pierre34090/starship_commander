import React from "react";

export default function EconomicPanel({ money, income, ecoCost, forceCost, onUpgradeEco, onUpgradeForce }) {
  return (
    <div>
      <h2>Economic Overview</h2>
      <p><strong>Money:</strong> {money.toFixed(2)}</p>
      <p><strong>Income:</strong> {income} / sec</p>

      <button onClick={onUpgradeEco}>⬆ Upgrade economy (cost: {ecoCost})</button><br /><br />
      <button onClick={onUpgradeForce}>⬆ Upgrade combat systems (cost: {forceCost})</button>
    </div>
  );
}