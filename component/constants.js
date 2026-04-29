export const DEFAULT_COLORS = [
  "bg-indigo-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-cyan-400",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-lime-500",
];

export const GRID_SIZE = { MIN: 3, MAX: 12, DEFAULT: 9 };
export const PLAYER_COUNTS = [2, 3, 4];
export const DEFAULT_PLAYER_COUNT = 2;
export const DEFAULT_PLAYER_LETTERS = ["N", "P"];

export const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export const cellVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const modalVariants = {
  hidden: { opacity: 0, y: "-50%" },
  visible: { opacity: 1, y: "0%", transition: { duration: 0.5 } },
};
