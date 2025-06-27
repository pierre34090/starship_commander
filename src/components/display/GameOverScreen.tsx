// src/components/GameOverScreen.tsx

import React from 'react';

interface GameOverScreenProps {
  onRestart: () => void;
}

export default function GameOverScreen({ onRestart }: GameOverScreenProps) {
  return (
    <div className="panel">
      <h1>Game Over</h1>
      <button onClick={onRestart}>Restart</button>
    </div>
  );
}

