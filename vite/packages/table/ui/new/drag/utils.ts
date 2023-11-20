// 吸附网格实现
export function snapGrid(
  grid: number[],
  x: number,
  y: number,
  screenWidth: number,
  screenHeight: number,
  gridMargin: number
) {
  const cellWidth = grid[0] + 2 * gridMargin
  const cellHeight = grid[1] + 2 * gridMargin

  // 将坐标调整为最接近的格子
  let snappedX = Math.round((x - gridMargin) / cellWidth) * cellWidth + gridMargin
  let snappedY = Math.round((y - gridMargin) / cellHeight) * cellHeight + gridMargin

  // 计算在屏幕宽度和高度内最多允许的格子数
  const maxGridX = Math.floor((screenWidth - gridMargin) / cellWidth) - 1
  const maxGridY = Math.floor((screenHeight - gridMargin) / cellHeight) - 1

  // 确保不超出屏幕的右边和底边，同时不超过最大格子数
  snappedX = Math.min(snappedX, maxGridX * cellWidth)
  snappedY = Math.min(snappedY, maxGridY * cellHeight)

  // 保证不小于0
  snappedX = Math.max(snappedX, gridMargin)
  snappedY = Math.max(snappedY, gridMargin)

  return [snappedX, snappedY]
}

// 检查是否是有效的手柄实现
export function isValidHandle(event: any, handle: string | string[]) {
  if (typeof handle === "string") {
    return event.target?.closest(handle) !== null
  } else if (Array.isArray(handle) && handle.length > 0) {
    return handle.some((selector) => event.target?.closest(selector) !== null)
  }

  return false
}

// 旋转后大小实现
export function rotatedDimensions(width: number, height: number, angle: number) {
  // 将角度转换为弧度
  const radians = angle * (Math.PI / 180)
  // 使用三角函数公式计算旋转后的宽度和高度
  const newWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians))
  const newHeight = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians))
  return [newWidth, newHeight]
}