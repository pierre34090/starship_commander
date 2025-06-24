## TODO (tech debt après refonte combat)

- [ ] Refactorer `ModuleState` avec `StatWithBonus` (objet `{ flat, mult }` par stat) + que les stat doivent heriter de damageTYpe au liue d'etr ecrite en liste brute
- [ ] Refaire `computeEffectiveAttributes()` pour s’appuyer sur `ModuleState.hp.flat` etc.
- [ ] Supprimer la logique de parsing `flat("hp")`
- [ ] Évaluer s’il faut aussi faire ça pour les armes plus tard