export const useElementSize = (size) => {
  let str = size.split("x");

  const w = str[0];
  const h = str[1];

  return {
    width: useGridToWidth(parseInt(w)),
    height: useGridToHeight(parseInt(h)),
  };
};

export const useGridSize = (data) => {
  const w = useWidthTotGrid(data.width);
  const h = useHeightToGrid(data.height);

  return `${w}x${h}`;
};
/**
 * 计算给定宽度对应的格子数
 *
 * @param width 宽度
 * @returns 返回格子数
 */
export const useWidthTotGrid = (width) => {
  const grid = (width + 12) / (136 + 12);
  return Math.round(grid);
};
/**
 * 计算给定高度对应的格子数
 *
 * @param height 高度
 * @returns 返回格子数
 */
export const useHeightToGrid = (height) => {
  const grid = (height + 12) / (96 + 12);
  return Math.round(grid);
};
/**
 * 根据给定的格子数计算对应的宽度
 *
 * @param w 格子数
 * @returns 返回计算得到的宽度值
 */
export const useGridToWidth = (w) => {
  return w * 134 + w * 12 - 12;
};
/**
 * 根据给定的格子数计算对应的高度值
 *
 * @param w 格子数
 * @returns 返回计算得到的高度值
 */
export const useGridToHeight = (h) => {
  return h * 96 + h * 12 - 12;
};
