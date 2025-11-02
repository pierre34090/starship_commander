# TODO: Implémentation du Damage Report

Objectif : permettre aux fonctions `takeAttack()`, `applyElementalStatusEffects()` et `applyFlatDamageToShip()` de générer un objet `DamageReport` structuré pour affichage ou debug.

---

## 📦 1. Définir le type `DamageReport`

```ts
export type DamageReport = {
  damageType: DamageType;      // 'normal', 'explosive', etc.
  rawDamage: number;
  absorbedByArmor: number;
  toShield: number;
  toHp: number;

  newShield: number;
  newArmor: number;
  newHp: number;
};

## 📦 2. Verifier que chaque chose est un place logique et que le découpage des responsabilités est clair et fluide
