### 🚀 Système de Combat — Design Global (FTL-like)

#### 🎮 Flow général

- Combat en **rounds cadencés** (ex: 1 round/s)
- Le joueur peut activer une **pause active** à tout moment
- Chaque round, les armes tirent si elles sont :
  - activées
  - chargées
  - avec une cible définie
  - et que le sous-système "armes" est opérationnel

---

#### ⚡ Système d'énergie

- **Réacteur** : fournit un total de points d'énergie (fixe pendant le combat)
- Ces points sont **répartis entre** :
  - **Armes** : détermine combien de slots sont activables
  - **Boucliers** : influe sur la régénération par round
  - **Moteur** : influe sur l’évasion
- Autres systèmes :
  - **Modules bonus** (ammo regen, réparation…) → **sans coût en énergie**

---

#### 🔫 Armes

- Chaque arme a :
  - Un coût en slot (1 à 3)
  - Un cooldown
  - Une tuile interactive
- **UX tuiles armes** :
  - `clic gauche` : active / mode ciblage si déjà active
  - `clic droit` : désactive
  - `drag & drop` : change l’ordre → détermine l’ordre de tir
  - Clavier `1-4` : sélection rapide
  - Tuile :
    - **grisée** si inactive
    - **bande de chargement** pendant cooldown
    - **halo bleu** si prête à tirer
- Si perte de points d'arme → on désactive de **droite à gauche**

---

#### 🧱 Modules

- Même logique UX que les armes :
  - Active/inactif
  - Drag & drop
- Modules actifs peuvent être :
  - Défensifs
  - Buff passif
  - **(plus tard)** Ciblage comme une arme (ex: Hacking)

---

#### 🛠 Sous-systèmes

- Chaque sous-système a :
  - Un niveau (définit l'effet par énergie allouée)
  - Des **PV** : 
    - Dépendent de `maxHp`, ex:  
      `10 + floor(sqrt(maxHp) * 0.5)`
- Visuellement :
  - Tuiles cliquables
  - Affichage PV (barre)
  - Icône cassée si désactivé
- Interactions :
  - Ciblage offensif
  - **(plus tard)** clic long pour réparation d’urgence

---

#### 🎯 Ciblage

- **Joueur** choisit une cible pour chaque arme manuellement
- **Surbrillance claire** sur les tuiles cibles pendant ciblage
- Autofire optionnel
- **IA ennemie uniquement** : ciblage aléatoire pondéré

---

#### 💥 Dégâts

- Si bouclier actif : tous les dégâts sont absorbés
- Si bouclier tombé :
  - Les **armes du joueur** ciblent un sous-système
  - Les **dégâts touchent à la fois le vaisseau et le sous-système**
  - Si cible sans système → dégâts directs (peut être buffés)

---

#### 🧠 Extensions futures

| Élément              | Prévu plus tard |
|----------------------|-----------------|
| Modules à ciblage    | ✅              |
| Réparation manuelle  | ✅              |
| Systèmes secondaires | ✅              |
| IA avancée           | ✅              |
| Visual feedback détaillé | ✅         |
