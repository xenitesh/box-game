"use client";
import { useGameState } from "./hooks/useGameState";
import GameSetup from "./GameSetup";
import GameBoard from "./GameBoard";
import GameOverModal from "./GameOverModal";

export default function Game() {
  const {
    setupComplete,
    gridSize,
    setGridSize,
    playerCount,
    playerLetters,
    handlePlayerCountChange,
    handlePlayerLetterChange,
    handleSetupSubmit,
    players,
    currentPlayerIndex,
    grid,
    scores,
    handleLineClick,
    gameOver,
    setGameOver,
    gameResult,
  } = useGameState();

  if (!setupComplete) {
    return (
      <GameSetup
        gridSize={gridSize}
        setGridSize={setGridSize}
        playerCount={playerCount}
        playerLetters={playerLetters}
        onPlayerCountChange={handlePlayerCountChange}
        onPlayerLetterChange={handlePlayerLetterChange}
        onSubmit={handleSetupSubmit}
      />
    );
  }

  return (
    <>
      <GameBoard
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        grid={grid}
        gridSize={gridSize}
        scores={scores}
        onLineClick={handleLineClick}
        onReset={() => window.location.reload()}
      />
      <GameOverModal
        gameOver={gameOver}
        gameResult={gameResult}
        players={players}
        scores={scores}
        onAnalyze={() => setGameOver(false)}
        onPlayAgain={() => window.location.reload()}
      />
    </>
  );
}
