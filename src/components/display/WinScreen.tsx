// src/components/WinScreen.tsx
import React from 'react';

interface WinScreenProps {
  onRestart: () => void;
}

export default function WinScreen({ onRestart }: WinScreenProps) {
  return (
    <div className="panel">
      <h1>You Win!</h1>
      <button onClick={onRestart}>Restart</button>
    </div>
  );
}
