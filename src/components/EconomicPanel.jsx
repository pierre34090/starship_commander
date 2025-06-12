import React from "react";

function EconomicPanel({ money, scrap, income, ecoCost, forceCost, onUpgradeEco, onUpgradeForce }) {
  return (
    <div>
      <h2>Economy</h2>
      <p><strong>Money:</strong> {money.toFixed(2)}</p>
      <p><strong>Scrap:</strong> {scrap}</p>
      <p><strong>Income:</strong> {income} / sec</p>
      <button onClick={onUpgradeEco}>Upgrade Economy (cost: {ecoCost})</button>
      <button onClick={onUpgradeForce}>Upgrade Force (cost: {forceCost})</button>
    </div>
  );
}

export default EconomicPanel;