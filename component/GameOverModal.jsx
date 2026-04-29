"use client";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariants } from "./constants";

export default function GameOverModal({ gameOver, gameResult, players, scores, onAnalyze, onPlayAgain }) {
  return (
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

            <p className="text-lg text-center whitespace-pre-line mb-8">{gameResult}</p>

            <div className="flex gap-4 w-full justify-center items-center">
              <motion.button
                onClick={onAnalyze}
                className="glass-button px-5 py-3 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Analyze
              </motion.button>
              <motion.button
                onClick={onPlayAgain}
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
  );
}
