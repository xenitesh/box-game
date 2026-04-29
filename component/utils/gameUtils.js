/**
 * Creates an empty grid of the given size.
 * Each cell tracks which player drew each of its four sides, and who owns the box.
 */
export const createGrid = (size) => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      top: null,
      right: null,
      bottom: null,
      left: null,
      owner: null,
    }))
  );
};

/**
 * Synchronises the shared edge between two adjacent cells when a line is drawn.
 * Mutates newGrid in place.
 */
export const syncAdjacentEdge = (newGrid, row, col, side, playerIndex, gridSize) => {
  if (side === "top" && row > 0) {
    newGrid[row - 1][col].bottom = playerIndex;
  } else if (side === "bottom" && row < gridSize - 1) {
    newGrid[row + 1][col].top = playerIndex;
  } else if (side === "left" && col > 0) {
    newGrid[row][col - 1].right = playerIndex;
  } else if (side === "right" && col < gridSize - 1) {
    newGrid[row][col + 1].left = playerIndex;
  }
};

/**
 * If all four sides of a cell are filled and it has no owner, claim it.
 * Returns true if the box was newly claimed.
 */
export const tryClaimBox = (newGrid, row, col, playerIndex) => {
  const cell = newGrid[row][col];
  if (
    cell.top !== null &&
    cell.right !== null &&
    cell.bottom !== null &&
    cell.left !== null &&
    cell.owner === null
  ) {
    newGrid[row][col].owner = playerIndex;
    return true;
  }
  return false;
};

/**
 * Counts claimed boxes per player across the entire grid.
 */
export const computeScores = (grid, playerCount) => {
  const scores = new Array(playerCount).fill(0);
  for (const row of grid) {
    for (const cell of row) {
      if (cell.owner !== null) scores[cell.owner]++;
    }
  }
  return scores;
};

/**
 * Builds the end-of-game result message.
 */
export const buildResultMessage = (players, scores) => {
  const maxScore = Math.max(...scores);
  const winnerIndices = scores.reduce((acc, score, idx) => {
    if (score === maxScore) acc.push(idx);
    return acc;
  }, []);

  let message =
    winnerIndices.length === 1
      ? `🎉 Congrats, Player ${players[winnerIndices[0]].letter}! You totally rocked it! 😎`
      : `🤝 It's a tie between: ${winnerIndices.map((i) => players[i].letter).join(", ")}! Better luck next time! 😉`;

  const loserLetters = players
    .filter((_, idx) => !winnerIndices.includes(idx))
    .map((p) => p.letter)
    .join(", ");

  if (loserLetters) {
    message += `\nOh, and ${loserLetters}, you gotta step up your game! 😂`;
  }

  return message;
};
