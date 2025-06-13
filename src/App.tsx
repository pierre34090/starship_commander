
import "./App.css";   
import "./panel.css";
import GameOverScreen from "./components/GameOverScreen";
import MainScreen from "./components/MainScreen";
import { useGameContext } from "./contexts/GameContext";

export default function App() {
  const { gameOver, lastResult, restartGame } = useGameContext();

  return (
    <div className="app-container">
      {gameOver ? (
        <GameOverScreen lastResult={lastResult} onRestart={restartGame} />
      ) : (
        <MainScreen />
      )}
    </div>
  );
}
