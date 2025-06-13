// src/components/WeaponPanel.tsx
import * as React from "react";
import { Weapon } from "../models/weapons/Weapon";

export interface WeaponPanelProps {
  weapons: Array<Weapon | null>;
  weaponCost: number;
  onBuyWeapon: () => void;
}

const WeaponPanel: React.FC<WeaponPanelProps> = ({ weapons, weaponCost, onBuyWeapon }) => {
  return (
    <div>
      <h2>Weapons</h2>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {weapons.map((w, idx) => (
          <div
            key={idx}
            style={{
              width: "80px",
              height: "80px",
              border: "1px solid #888",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: w ? "#333" : "#111",
              color: "#fff",
              fontSize: "0.8rem",
              textAlign: "center",
              padding: "4px",
            }}
          >
            {w ? w.name : "Vide"}
          </div>
        ))}
      </div>
      <button
        onClick={onBuyWeapon}
        style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
      >
        Buy random weapon({weaponCost})
      </button>
    </div>
  );
};

export default WeaponPanel;
