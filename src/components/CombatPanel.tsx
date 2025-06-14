// src/components/CombatPanel.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Ship } from "../models/ships/Ship";
import ToggleSwitch from "./ToggleSwitch"; // Assurez-vous que le chemin est correct

interface CombatPanelProps {
  enemy: Ship | null;
  onGenerate: () => void;
  onFight: () => void;
  onSkip: () => void;
  resultMessage?: string | null;
  gameOver: boolean;
}

const CombatPanel: React.FC<CombatPanelProps> = ({
  enemy,
  onGenerate,
  onFight,
  onSkip,
  resultMessage,
  gameOver,
}) => {
  // État local pour le mode auto-combat
  const [autoCombat, setAutoCombat] = useState(false);
  // Indique qu’on a planifié la prochaine action et qu’on attend
  const [isWaitingNext, setIsWaitingNext] = useState(false);
  // Ref pour stocker l’ID du timeout
  const timeoutRef = useRef<number | null>(null);

  // Références stables pour les callbacks, afin que la boucle ne se réinitialise pas
  const onGenerateRef = useRef(onGenerate);
  useEffect(() => {
    onGenerateRef.current = onGenerate;
  }, [onGenerate]);

  const onFightRef = useRef(onFight);
  useEffect(() => {
    onFightRef.current = onFight;
  }, [onFight]);

  const stopAutoCombat = useCallback(() => {
    setAutoCombat(false);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsWaitingNext(false);
  }, []);

  // Effet principal : boucle auto-combat à 1 action/seconde
  useEffect(() => {
    if (!autoCombat) {
      // Si on désactive le mode auto, on nettoie le timeout en cours
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsWaitingNext(false);
      return;
    }
    // Si on active auto mais que la partie est déjà finie, on arrête immédiatement
    if (gameOver) {
      setAutoCombat(false);
      return;
    }
    // Planification de la prochaine action
    setIsWaitingNext(true);
    const doNext = () => {
      setIsWaitingNext(false);
      // Au moment d’exécuter, vérifier encore gameOver
      if (gameOver) {
        setAutoCombat(false);
        return;
      }
      if (!enemy) {
        onGenerateRef.current();
      } else {
        onFightRef.current();
      }
      // Après cet appel, React mettra à jour `enemy` ou `gameOver`, déclenchant de nouveau cet effet
    };
    // Planifier doNext dans 1000ms
    timeoutRef.current = window.setTimeout(doNext, 1000);

    return () => {
      // Cleanup si autoCombat devient false ou si dependencies changent
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsWaitingNext(false);
    };
    // Dépendances : autoCombat, enemy, gameOver
  }, [autoCombat, enemy, gameOver]);

  // Effet pour stopper la boucle si gameOver devient true en dehors de doNext
  useEffect(() => {
    if (gameOver && autoCombat) {
      stopAutoCombat();
    }
  }, [gameOver, autoCombat, stopAutoCombat]);

  // Optionnel : si, lors d’un restart du parent, on veut s’assurer d’arrêter auto
  // on peut observer une prop resetKey ou bien gameOver/enemy remontés par le contexte.
  // Ici, si parent remet enemy=null et gameOver=false à la nouvelle partie, autoCombat reste false
  // car on a stoppé auto lors du gameOver ou via stopAutoCombat du parent.

  return (
    <div>
      <h2>Combat</h2>

      {/* Toggle auto-combat */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
        <ToggleSwitch
          id="auto-combat-toggle"
          checked={autoCombat}
          onChange={(checked) => setAutoCombat(checked)}
          disabled={gameOver}
        >
          Auto Combat
        </ToggleSwitch>
      </div>

      {/* Message du dernier résultat de combat */}
      {resultMessage && (
        <div
          className="combat-result"
          style={{
            backgroundColor: "#fff",
            color: "#000",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "4px",
          }}
        >
          {resultMessage}
        </div>
      )}

      {/* Boutons / affichage ennemi */}
      {!enemy ? (
        <button onClick={onGenerate} disabled={autoCombat || gameOver}>
          🔍 Search for Enemy
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={`/${enemy.sprite}`}
            alt={enemy.constructor.name}
            className="enemy-sprite"
          />
          <p style={{ margin: 0 }}>
            <strong>{enemy.constructor.name}</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Attack:</strong> {enemy.stats.attack}
          </p>
          <p style={{ margin: 0, marginBottom: "0.5rem" }}>
            <strong>HP:</strong> {enemy.stats.hp} / {enemy.stats.maxHp}
          </p>
          <div>
            <button onClick={onFight} disabled={autoCombat || gameOver}>
              Fight
            </button>{" "}
            <button onClick={onSkip} disabled={autoCombat || gameOver}>
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatPanel;
