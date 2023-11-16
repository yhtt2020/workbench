export function snapToGrid(
  grid: number[],
  x: number,
  y: number,
  screenWidth: number,
  screenHeight: number,
  margin: number
) {
  const cellWidth = grid[0] + 2 * margin;
  const cellHeight = grid[1] + 2 * margin;

  // 将坐标调整为最接近的格子
  let snappedX = Math.round((x - margin) / cellWidth) * cellWidth + margin;
  let snappedY = Math.round((y - margin) / cellHeight) * cellHeight + margin;

  // 计算在屏幕宽度和高度内最多允许的格子数
  const maxGridX = Math.floor((screenWidth - margin) / cellWidth) - 1;
  const maxGridY = Math.floor((screenHeight - margin) / cellHeight) - 1;

  // 确保不超出屏幕的右边和底边，同时不超过最大格子数
  snappedX = Math.min(snappedX, maxGridX * cellWidth);
  snappedY = Math.min(snappedY, maxGridY * cellHeight);

  // 保证不小于0
  snappedX = Math.max(snappedX, margin);
  snappedY = Math.max(snappedY, margin);

  return [snappedX, snappedY];
}
