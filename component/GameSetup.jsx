"use client";
import { motion } from "framer-motion";
import { containerVariants, DEFAULT_COLORS, GRID_SIZE, PLAYER_COUNTS } from "./constants";

export default function GameSetup({
  gridSize,
  setGridSize,
  playerCount,
  playerLetters,
  onPlayerCountChange,
  onPlayerLetterChange,
  onSubmit,
}) {
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
          Dots &amp; Boxes
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {/* Grid size */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Grid Size (NxN):
            </label>
            <input
              type="range"
              min={GRID_SIZE.MIN}
              max={GRID_SIZE.MAX}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="text-center text-2xl font-semibold text-indigo-300">
              {gridSize}×{gridSize}
            </div>
          </div>

          {/* Player count */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Number of Players:
            </label>
            <div className="flex justify-between items-center">
              {PLAYER_COUNTS.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onPlayerCountChange(num)}
                  className={`glass-button rounded-full w-12 h-12 flex items-center justify-center font-bold ${
                    playerCount === num ? "ring-2 ring-indigo-400 text-white" : "text-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Player letters */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Player Letters:
            </label>
            <div className="grid grid-cols-2 gap-4">
              {playerLetters.map((letter, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`${DEFAULT_COLORS[idx]} w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    <span className="font-bold">{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    maxLength="1"
                    value={letter}
                    onChange={(e) => onPlayerLetterChange(idx, e.target.value)}
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
