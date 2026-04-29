"use client";
import { motion } from "framer-motion";
import { cellVariants, containerVariants } from "./constants";

function GameLine({ orientation, drawn, color, onClick }) {
  const base = "absolute rounded-full cursor-cell";
  const positionClass =
    orientation === "top"
      ? "top-0 left-0 w-full h-1.5"
      : orientation === "bottom"
      ? "bottom-0 left-0 w-full h-1.5"
      : orientation === "left"
      ? "top-0 left-0 h-full w-1.5"
      : "top-0 right-0 h-full w-1.5"; // right

  const isHorizontal = orientation === "top" || orientation === "bottom";
  const colorClass = drawn ? color : "bg-gray-700 hover:bg-gray-500";

  return (
    <motion.div
      className={`${base} ${positionClass} ${colorClass}`}
      onClick={onClick}
      whileHover={
        isHorizontal
          ? { scaleY: 1.5, opacity: !drawn ? 0.8 : 1 }
          : { scaleX: 1.5, opacity: !drawn ? 0.8 : 1 }
      }
      whileTap={isHorizontal ? { scaleY: 2 } : { scaleX: 2 }}
    />
  );
}

function GameCell({ cell, rowIndex, colIndex, gridSize, players, onLineClick }) {
  const getColor = (playerIdx) => players[playerIdx].color;

  return (
    <motion.div
      key={`${rowIndex}-${colIndex}`}
      className="relative w-12 h-12 sm:w-14 sm:h-14 game-cell"
      variants={cellVariants}
    >
      {/* Corner dots */}
      <div className="dot top-0 left-0 glow" />
      {colIndex === gridSize - 1 && <div className="dot top-0 right-0 glow" />}
      {rowIndex === gridSize - 1 && <div className="dot bottom-0 left-0 glow" />}
      {rowIndex === gridSize - 1 && colIndex === gridSize - 1 && (
        <div className="dot bottom-0 right-0 glow" />
      )}

      {/* Lines */}
      <GameLine
        orientation="top"
        drawn={cell.top !== null}
        color={cell.top !== null ? getColor(cell.top) : ""}
        onClick={() => onLineClick(rowIndex, colIndex, "top")}
      />
      <GameLine
        orientation="left"
        drawn={cell.left !== null}
        color={cell.left !== null ? getColor(cell.left) : ""}
        onClick={() => onLineClick(rowIndex, colIndex, "left")}
      />
      {colIndex === gridSize - 1 && (
        <GameLine
          orientation="right"
          drawn={cell.right !== null}
          color={cell.right !== null ? getColor(cell.right) : ""}
          onClick={() => onLineClick(rowIndex, colIndex, "right")}
        />
      )}
      {rowIndex === gridSize - 1 && (
        <GameLine
          orientation="bottom"
          drawn={cell.bottom !== null}
          color={cell.bottom !== null ? getColor(cell.bottom) : ""}
          onClick={() => onLineClick(rowIndex, colIndex, "bottom")}
        />
      )}

      {/* Box owner label */}
      {cell.owner !== null && (
        <motion.div
          className={`absolute inset-0 flex justify-center items-center text-xl font-bold ${players[cell.owner].color} rounded-md bg-opacity-30`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {players[cell.owner].letter}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function GameBoard({
  players,
  currentPlayerIndex,
  grid,
  gridSize,
  scores,
  onLineClick,
  onReset,
}) {
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
        {/* Header: title, current turn, scores */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              Dots &amp; Boxes
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

        {/* Grid */}
        <div className="overflow-auto p-4 flex justify-center">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${gridSize}, auto)` }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <GameCell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  gridSize={gridSize}
                  players={players}
                  onLineClick={onLineClick}
                />
              ))
            )}
          </div>
        </div>

        {/* Reset button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={onReset}
            className="glass-button px-5 py-2 rounded-lg text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Game
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
