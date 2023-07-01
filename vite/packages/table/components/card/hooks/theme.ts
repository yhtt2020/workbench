import cache from "../../../page/app/addIcon/hooks/cache";

export const THEME_BG_COLOR = "--active-bg";
export const THEME_SECONDARY_BG_COLOR = "--active-secondary-bg";
export const THEME_TEXT_COLOR = "--primary-text";

/**
 * 设置主题背景颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setThemeBgColor = (color) => {
  const themeBgColor = setColor(THEME_BG_COLOR, color);
  cache.set(THEME_BG_COLOR, themeBgColor);

  const themeSecondaryBgColor = setColor(THEME_SECONDARY_BG_COLOR, color, 0.2);
  cache.set(THEME_SECONDARY_BG_COLOR, themeSecondaryBgColor);
};

/**
 * 设置主题文本字体颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setThemeTextColor = (color) => {
  setColor(THEME_TEXT_COLOR, color);
  cache.set(THEME_TEXT_COLOR, color);
};

/**
 * 从缓存中获取主题背景颜色
 * @returns {string} 主题背景颜色
 */
export const getThemeBgColor = () => cache.get(THEME_BG_COLOR) || "";

/**
 * 从缓存中获取主题次要背景颜色
 * @returns {string} 主题次要背景颜色
 */
export const getThemeSecondaryBgColor = () => cache.get(THEME_SECONDARY_BG_COLOR) || "";

/**
 * 从缓存中获取主题文本颜色
 * @returns {string} 主题文本颜色
 */
export const getThemeTextColor = () => cache.get(THEME_TEXT_COLOR) || "";

/**
 * 清除主题背景颜色样式属性
 */
export const clearThemeBgColor = () => {
  clearColor(THEME_BG_COLOR);
  cache.del(THEME_BG_COLOR);
  clearColor(THEME_SECONDARY_BG_COLOR);
  cache.del(THEME_SECONDARY_BG_COLOR);
};

/**
 * 清除主题文字颜色样式属性
 */
export const clearThemeTextColor = () => {
  clearColor(THEME_TEXT_COLOR);
  cache.del(THEME_TEXT_COLOR);
};

/**
 * 绑定已存在的自定义颜色
 */
export const setTheme = () => {
  const themeBgColor = getThemeBgColor();
  if (themeBgColor) setColor(THEME_BG_COLOR, themeBgColor);

  const themeSecondaryBgColor = getThemeSecondaryBgColor();
  if (themeSecondaryBgColor) setColor(THEME_SECONDARY_BG_COLOR, themeSecondaryBgColor);

  const themeTextColor = getThemeTextColor();
  if (themeTextColor) setColor(THEME_TEXT_COLOR, themeTextColor);
};

/**
 * 修改类名的颜色参数及透明度
 * @param {string} text - 必填，要修改的类名
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 * @param {number} [opacity] - 可选，透明度参数，范围从 0 到 1，默认值为 1
 * @returns {string} 修改后的颜色参数
 */
export const setColor = (text, color, opacity?) => {
  // 将原始颜色转换为RGBA格式
  const convertToRGBA = (color, opacity) => {
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  if (opacity < 0 || opacity > 1) {
    console.warn("Opacity value 需要在 0 和 1 之间");
  }

  const rgbaColor = opacity !== undefined ? convertToRGBA(color, opacity) : color;
  document.documentElement.style.cssText += `${text}:${rgbaColor} !important;`;
  return rgbaColor;
};

/**
 * 清除指定类名的样式属性
 * @param {string} text - 必填，要清除样式的类名
 */
export const clearColor = (text) => {
  document.documentElement.style.removeProperty(text);
};
