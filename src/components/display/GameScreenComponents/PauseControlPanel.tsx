// src/components/GameScreenComponents/PauseControlPanel.tsx

import React, { useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import '../../../css/GameScreenComponents/PauseControlPanel.css';

const PauseControlPanel: React.FC = () => {
  const context = useContext(GameContext);
  if (!context) return null;

  const { metaState, setMetaState } = context;

  const updatePause = (val: boolean) =>
    setMetaState({ ...metaState, isPaused: val });

  const updateSpeed = (ms: number) =>
    setMetaState({ ...metaState, roundSpeed: ms });

  const getSpeedLabel = () => {
    switch (metaState.roundSpeed) {
      case 1000: return 'x1';
      case 500: return 'x2';
      case 250: return 'x4';
      default: return `${1000 / metaState.roundSpeed}x`;
    }
  };

  return (
    <div className="pause-control-panel">
      <div className="pause-label">
        {metaState.isPaused ? '⏸ Paused' : '▶️ Playing'} – {getSpeedLabel()}
      </div>
      <div className="controls-row">
        <button onClick={() => updatePause(false)}>▶</button>
        <button onClick={() => updatePause(true)}>⏸</button>
      </div>
      <div className="controls-row">
        <button onClick={() => updateSpeed(1000)}>x1</button>
        <button onClick={() => updateSpeed(500)}>x2</button>
        <button onClick={() => updateSpeed(250)}>x4</button>
      </div>
    </div>
  );
};

export default PauseControlPanel;
