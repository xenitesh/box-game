"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Utility to create a grid of cells
const createGrid = (size) => {
  let grid = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push({
        top: null,
        right: null,
        bottom: null,
        left: null,
        owner: null, // Will hold the index of the player who claimed the box
      });
    }
    grid.push(row);
  }
  return grid;
};

// Default colors for players; if more players are added, colors will cycle.
const defaultColors = [
  "bg-indigo-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-cyan-400",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-lime-500",
];

// Main game component
export default function GameBoard() {
  // Setup state
  const [setupComplete, setSetupComplete] = useState(false);
  const [gridSize, setGridSize] = useState(9);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerLetters, setPlayerLetters] = useState(["N", "P"]);

  // Game state (set after setup)
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [grid, setGrid] = useState([]);
  const [scores, setScores] = useState([]);

  // Game over state and result
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  // Setup submission handler
  const handleSetupSubmit = (e) => {
    e.preventDefault();

    // Create players array with letter and assigned color
    const newPlayers = playerLetters.map((letter, idx) => ({
      letter: letter || `P${idx + 1}`,
      color: defaultColors[idx % defaultColors.length],
    }));
    // Initialize grid and scores based on inputs
    setPlayers(newPlayers);
    setGrid(createGrid(Number(gridSize)));
    setScores(new Array(newPlayers.length).fill(0));
    setCurrentPlayerIndex(0);
    setSetupComplete(true);
  };

  // Handler for changes in player letter inputs
  const handlePlayerLetterChange = (index, value) => {
    const updatedLetters = [...playerLetters];
    updatedLetters[index] = value;
    setPlayerLetters(updatedLetters);
  };

  // Game logic: get the color class for a given player's index
  const getLineColor = (playerIdx) => {
    return players[playerIdx].color;
  };

  const handleLineClick = (row, col, side) => {
    // Prevent drawing over an already drawn line
    if (grid[row][col][side] !== null) return;

    // Create a deep copy of the grid
    let newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));

    // Mark the clicked side with the current player's index
    newGrid[row][col][side] = currentPlayerIndex;

    // Also update the adjacent cell's corresponding side, if it exists
    if (side === "top" && row > 0) {
      newGrid[row - 1][col]["bottom"] = currentPlayerIndex;
    }
    if (side === "bottom" && row < gridSize - 1) {
      newGrid[row + 1][col]["top"] = currentPlayerIndex;
    }
    if (side === "left" && col > 0) {
      newGrid[row][col - 1]["right"] = currentPlayerIndex;
    }
    if (side === "right" && col < gridSize - 1) {
      newGrid[row][col + 1]["left"] = currentPlayerIndex;
    }

    let boxesCompleted = 0;

    // Helper to check and mark if a box is complete
    const checkAndMarkBox = (r, c) => {
      if (
        newGrid[r][c].top !== null &&
        newGrid[r][c].right !== null &&
        newGrid[r][c].bottom !== null &&
        newGrid[r][c].left !== null &&
        newGrid[r][c].owner === null // Only mark if not already claimed
      ) {
        newGrid[r][c].owner = currentPlayerIndex;
        boxesCompleted++;
      }
    };

    // Check the current cell and its adjacent box if applicable
    checkAndMarkBox(row, col);
    if (side === "top" && row > 0) checkAndMarkBox(row - 1, col);
    if (side === "bottom" && row < gridSize - 1) checkAndMarkBox(row + 1, col);
    if (side === "left" && col > 0) checkAndMarkBox(row, col - 1);
    if (side === "right" && col < gridSize - 1) checkAndMarkBox(row, col + 1);

    // Update scores if boxes were completed; otherwise, move to the next player's turn.
    if (boxesCompleted > 0) {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayerIndex] += boxesCompleted;
        return newScores;
      });
      // The same player gets another turn
    } else {
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    }

    // Update grid state
    setGrid(newGrid);

    // Check if game is over: count claimed boxes
    const totalBoxes = gridSize * gridSize;
    let claimedBoxes = 0;
    newGrid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.owner !== null) claimedBoxes++;
      });
    });
    if (claimedBoxes === totalBoxes) {
      // Game is over – compute final scores by re-counting boxes
      let computedScores = new Array(players.length).fill(0);
      newGrid.forEach((row) => {
        row.forEach((cell) => {
          if (cell.owner !== null) {
            computedScores[cell.owner]++;
          }
        });
      });
      // Determine winner(s)
      const maxScore = Math.max(...computedScores);
      const winners = computedScores.reduce((acc, score, idx) => {
        if (score === maxScore) acc.push(idx);
        return acc;
      }, []);
      let resultMessage = "";
      if (winners.length === 1) {
        resultMessage = `🎉 Congrats, Player ${
          players[winners[0]].letter
        }! You totally rocked it! 😎`;
      } else {
        const winnerLetters = winners.map((i) => players[i].letter).join(", ");
        resultMessage = `🤝 It's a tie between: ${winnerLetters}! Better luck next time! 😉`;
      }
      // Tease the losers (all players not in winners)
      const losers = players
        .filter((_, idx) => !winners.includes(idx))
        .map((p) => p.letter)
        .join(", ");
      if (losers) {
        resultMessage += `\nOh, and ${losers}, you gotta step up your game! 😂`;
      }
      setGameResult(resultMessage);
      setGameOver(true);
    }
  };

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const cellVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Modal variants
  const modalVariants = {
    hidden: { opacity: 0, y: "-50%" },
    visible: { opacity: 1, y: "0%", transition: { duration: 0.5 } },
  };

  // Render the setup form if match hasn't started
  if (!setupComplete) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="game-container p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
            Dots & Boxes
          </h1>
          <form onSubmit={handleSetupSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Grid Size (NxN):
              </label>
              <input
                type="range"
                min="3"
                max="12"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="text-center text-2xl font-semibold text-indigo-300">
                {gridSize}×{gridSize}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Number of Players:
              </label>
              <div className="flex justify-between items-center">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setPlayerCount(num);
                      const newLetters = Array.from({ length: num }, (_, idx) =>
                        playerLetters[idx] ? playerLetters[idx] : ""
                      );
                      setPlayerLetters(newLetters);
                    }}
                    className={`glass-button rounded-full w-12 h-12 flex items-center justify-center font-bold ${
                      playerCount === num
                        ? "ring-2 ring-indigo-400 text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Player Letters:
              </label>
              <div className="grid grid-cols-2 gap-4">
                {playerLetters.map((letter, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`${defaultColors[idx]} w-8 h-8 rounded-full flex items-center justify-center`}
                    >
                      <span className="font-bold">{idx + 1}</span>
                    </div>
                    <input
                      type="text"
                      maxLength="1"
                      value={letter}
                      onChange={(e) =>
                        handlePlayerLetterChange(idx, e.target.value)
                      }
                      className="glass-button rounded-lg p-3 w-full text-center uppercase font-bold text-lg"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
            <motion.button
              type="submit"
              className="glass-button mt-4 py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Game
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="game-container p-6 w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              Dots & Boxes
            </h1>
            <p className="text-gray-300">
              Grid size: {gridSize}×{gridSize}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-300 mb-2">Current Turn</p>
            <motion.div
              className={`player-badge font-bold px-5 py-2 text-lg rounded-full ${players[currentPlayerIndex].color}`}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 2, 0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {players[currentPlayerIndex].letter}
            </motion.div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">Scores</p>
            <div className="flex gap-3 justify-center items-center">
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className={`${player.color} player-badge font-bold px-3 py-1 rounded-full`}
                >
                  {player.letter}: {scores[idx]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-auto p-4 flex justify-center">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, auto)`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 game-cell"
                  variants={cellVariants}
                >
                  {/* Dots at corners */}
                  <div className="dot top-0 left-0 glow"></div>
                  {colIndex === gridSize - 1 && (
                    <div className="dot top-0 right-0 glow"></div>
                  )}
                  {rowIndex === gridSize - 1 && (
                    <div className="dot bottom-0 left-0 glow"></div>
                  )}
                  {rowIndex === gridSize - 1 && colIndex === gridSize - 1 && (
                    <div className="dot bottom-0 right-0 glow"></div>
                  )}

                  {/* Top Line */}
                  <motion.div
                    className={`absolute top-0 left-0 w-full h-1.5 rounded-full cursor-cell ${
                      cell.top !== null
                        ? getLineColor(cell.top)
                        : "bg-gray-700 hover:bg-gray-500"
                    }`}
                    onClick={() => handleLineClick(rowIndex, colIndex, "top")}
                    whileHover={{
                      scaleY: 1.5,
                      opacity: cell.top === null ? 0.8 : 1,
                    }}
                    whileTap={{ scaleY: 2 }}
                  />
                  {/* Left Line */}
                  <motion.div
                    className={`absolute top-0 left-0 h-full w-1.5 rounded-full cursor-cell ${
                      cell.left !== null
                        ? getLineColor(cell.left)
                        : "bg-gray-700 hover:bg-gray-500"
                    }`}
                    onClick={() => handleLineClick(rowIndex, colIndex, "left")}
                    whileHover={{
                      scaleX: 1.5,
                      opacity: cell.left === null ? 0.8 : 1,
                    }}
                    whileTap={{ scaleX: 2 }}
                  />
                  {/* Right Line (Only for last column) */}
                  {colIndex === gridSize - 1 && (
                    <motion.div
                      className={`absolute top-0 right-0 h-full w-1.5 rounded-full cursor-cell ${
                        cell.right !== null
                          ? getLineColor(cell.right)
                          : "bg-gray-700 hover:bg-gray-500"
                      }`}
                      onClick={() =>
                        handleLineClick(rowIndex, colIndex, "right")
                      }
                      whileHover={{
                        scaleX: 1.5,
                        opacity: cell.right === null ? 0.8 : 1,
                      }}
                      whileTap={{ scaleX: 2 }}
                    />
                  )}
                  {/* Bottom Line (Only for last row) */}
                  {rowIndex === gridSize - 1 && (
                    <motion.div
                      className={`absolute bottom-0 left-0 w-full h-1.5 rounded-full cursor-cell ${
                        cell.bottom !== null
                          ? getLineColor(cell.bottom)
                          : "bg-gray-700 hover:bg-gray-500"
                      }`}
                      onClick={() =>
                        handleLineClick(rowIndex, colIndex, "bottom")
                      }
                      whileHover={{
                        scaleY: 1.5,
                        opacity: cell.bottom === null ? 0.8 : 1,
                      }}
                      whileTap={{ scaleY: 2 }}
                    />
                  )}
                  {/* Display player's letter in the center if the box is claimed */}
                  {cell.owner !== null && (
                    <motion.div
                      className={`absolute inset-0 flex justify-center items-center text-xl font-bold ${
                        players[cell.owner].color
                      } rounded-md bg-opacity-30`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {players[cell.owner].letter}
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={() => window.location.reload()}
            className="glass-button px-5 py-2 rounded-lg text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Game
          </motion.button>
        </div>
      </motion.div>

      {/* Modal for Game Over */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            <motion.div
              className="game-container p-8 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Game Over!
              </h2>
              <div className="flex flex-wrap gap-3 justify-center items-center mb-6">
                {players.map((player, idx) => (
                  <div
                    key={idx}
                    className={`${player.color} player-badge font-bold px-4 py-2 rounded-full`}
                  >
                    {player.letter}: {scores[idx]}
                  </div>
                ))}
              </div>
              <p className="text-lg text-center whitespace-pre-line mb-8">
                {gameResult}
              </p>
              <div className="flex gap-4 w-full justify-center items-center">
                <motion.button
                  onClick={() => setGameOver(false)}
                  className="glass-button px-5 py-3 rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze
                </motion.button>
                <motion.button
                  onClick={() => window.location.reload()}
                  className="glass-button px-5 py-3 rounded-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
