/**
 * 计算给定宽度对应的格子数
 *
 * @param width 宽度
 * @returns 返回格子数
 */
export const widthTotGrid = (width) => {
  const grid = (width + 12) / (136 + 12);
  return Math.round(grid);
};
/**
 * 计算给定高度对应的格子数
 *
 * @param height 高度
 * @returns 返回格子数
 */
export const heightToGrid = (height) => {
  const grid = (height + 12) / (96 + 12);
  return Math.round(grid);
};
/**
 * 根据给定的格子数计算对应的宽度
 *
 * @param w 格子数
 * @returns 返回计算得到的宽度值
 */
export const gridToWidth = (w) => {
  return w * 134 + w * 12 - 12;
};
/**
 * 根据给定的格子数计算对应的高度值
 *
 * @param w 格子数
 * @returns 返回计算得到的高度值
 */
export const gridToHeight = (h) => {
  return h * 96 + h * 12 - 12;
};
