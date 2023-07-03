import cache from "../../../../page/app/addIcon/hooks/cache";
import { THEME_BG_COLOR, THEME_SECONDARY_BG_COLOR, THEME_TEXT_COLOR } from "./types";
/**
 * 获取主题背景颜色
 * @returns {string} 主题背景颜色
 */
export const getThemeBgColor = () => cache.get(THEME_BG_COLOR) || "";

/**
 * 获取主题次要背景颜色
 * @returns {string} 主题次要背景颜色
 */
export const getThemeSecondaryBgColor = () => cache.get(THEME_SECONDARY_BG_COLOR) || "";

/**
 * 获取主题文本颜色
 * @returns {string} 主题文本颜色
 */
export const getThemeTextColor = () => cache.get(THEME_TEXT_COLOR) || "";