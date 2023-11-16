export function snapToGrid(
  grid: number[],
  pendingX: number,
  pendingY: number,
  scale = 1,
  screenWidth?: number,
  screenHeight?: number
) {
  const maxX = Math.floor((screenWidth ?? Infinity) / grid[0])
  const maxY = Math.floor((screenHeight ?? Infinity) / grid[1])
  let x = Math.min(maxX, Math.round(pendingX / scale / grid[0])) * grid[0]
  let y = Math.min(maxY, Math.round(pendingY / scale / grid[1])) * grid[1]
  if (screenWidth !== undefined && x + grid[0] > screenWidth) {
    x -= grid[0]
  }

  if (screenHeight !== undefined && y + grid[1] > screenHeight) {
    y -= grid[1]
  }
  return [x, y]
}
