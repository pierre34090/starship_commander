import React from "react";

function ShopPanel({ scrap }) {
  return (
    <div>
      <h2>Merchant Bay</h2>
      <img
        src="/sprites/merchant.png"
        alt="Merchant"
        className="sprite"
      />
      <p><strong>Scrap:</strong> {scrap}</p>
      <button disabled={scrap < 10}>Buy mystery item (10 scrap)</button>
    </div>
  );
}

export default ShopPanel;