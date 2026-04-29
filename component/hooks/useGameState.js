"use client";
import { useState } from "react";
import {
  DEFAULT_COLORS,
  DEFAULT_PLAYER_COUNT,
  DEFAULT_PLAYER_LETTERS,
  GRID_SIZE,
} from "../constants";
import {
  buildResultMessage,
  computeScores,
  createGrid,
  syncAdjacentEdge,
  tryClaimBox,
} from "../utils/gameUtils";

export function useGameState() {
  // Setup state
  const [setupComplete, setSetupComplete] = useState(false);
  const [gridSize, setGridSize] = useState(GRID_SIZE.DEFAULT);
  const [playerCount, setPlayerCount] = useState(DEFAULT_PLAYER_COUNT);
  const [playerLetters, setPlayerLetters] = useState(DEFAULT_PLAYER_LETTERS);

  // Game state (populated after setup)
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [grid, setGrid] = useState([]);
  const [scores, setScores] = useState([]);

  // Game-over state
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    const newPlayers = playerLetters.map((letter, idx) => ({
      letter: letter || `P${idx + 1}`,
      color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
    }));
    setPlayers(newPlayers);
    setGrid(createGrid(Number(gridSize)));
    setScores(new Array(newPlayers.length).fill(0));
    setCurrentPlayerIndex(0);
    setSetupComplete(true);
  };

  const handlePlayerCountChange = (num) => {
    setPlayerCount(num);
    setPlayerLetters(
      Array.from({ length: num }, (_, idx) => playerLetters[idx] ?? "")
    );
  };

  const handlePlayerLetterChange = (index, value) => {
    const updated = [...playerLetters];
    updated[index] = value;
    setPlayerLetters(updated);
  };

  const handleLineClick = (row, col, side) => {
    if (grid[row][col][side] !== null) return;

    const newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));
    newGrid[row][col][side] = currentPlayerIndex;
    syncAdjacentEdge(newGrid, row, col, side, currentPlayerIndex, gridSize);

    // Check the current cell and the adjacent cell that shares the clicked edge
    let boxesCompleted = 0;
    if (tryClaimBox(newGrid, row, col, currentPlayerIndex)) boxesCompleted++;
    if (side === "top" && row > 0 && tryClaimBox(newGrid, row - 1, col, currentPlayerIndex)) boxesCompleted++;
    if (side === "bottom" && row < gridSize - 1 && tryClaimBox(newGrid, row + 1, col, currentPlayerIndex)) boxesCompleted++;
    if (side === "left" && col > 0 && tryClaimBox(newGrid, row, col - 1, currentPlayerIndex)) boxesCompleted++;
    if (side === "right" && col < gridSize - 1 && tryClaimBox(newGrid, row, col + 1, currentPlayerIndex)) boxesCompleted++;

    setGrid(newGrid);

    if (boxesCompleted > 0) {
      setScores((prev) => {
        const next = [...prev];
        next[currentPlayerIndex] += boxesCompleted;
        return next;
      });
      // Same player gets another turn – no index change needed
    } else {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }

    // Check if all boxes are claimed
    const totalBoxes = gridSize * gridSize;
    const claimedBoxes = newGrid.flat().filter((c) => c.owner !== null).length;
    if (claimedBoxes === totalBoxes) {
      const finalScores = computeScores(newGrid, players.length);
      setGameResult(buildResultMessage(players, finalScores));
      setGameOver(true);
    }
  };

  return {
    // Setup
    setupComplete,
    gridSize,
    setGridSize,
    playerCount,
    playerLetters,
    handlePlayerCountChange,
    handlePlayerLetterChange,
    handleSetupSubmit,
    // Gameplay
    players,
    currentPlayerIndex,
    grid,
    scores,
    handleLineClick,
    // Game-over
    gameOver,
    setGameOver,
    gameResult,
  };
}
