export function calcTileType(index, boardSize) {
  let square = '';

  if (index < boardSize) { square = 'top'; }
  if (index > boardSize ** 2 - boardSize - 1) { square = 'bottom'; }

  if (index === boardSize - boardSize
    || index === boardSize - 1
    || index === boardSize ** 2 - boardSize
    || index === boardSize ** 2 - 1) {
    square += '-';
  }

  if (index % boardSize === boardSize - 1) { square += 'right'; }
  if (index % boardSize === 0) { square += 'left'; }

  if (!square) { return 'center'; }

  return square;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
