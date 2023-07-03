import cache from "../../../../page/app/addIcon/hooks/cache";
import { getThemeBgColor, getThemeSecondaryBgColor, getThemeTextColor } from "./getTheme";
import { setColor } from "./theme";
import { THEME_BG_COLOR, THEME_SECONDARY_BG_COLOR, THEME_TEXT_COLOR } from "./types";
const THEME_ARRAY = [THEME_BG_COLOR, THEME_SECONDARY_BG_COLOR, THEME_TEXT_COLOR]
/**
 * 设置主题背景颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setThemeBgColor = (color) => {
    const themeBgColor = setColor(THEME_BG_COLOR, color);
    cache.set(THEME_BG_COLOR, themeBgColor);
};

/**
 * 设置主题次要背景颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setThemeSecondaryBgColor = (color) => {
    const themeSecondaryBgColor = setColor(THEME_SECONDARY_BG_COLOR, color, 0.2);
    cache.set(THEME_SECONDARY_BG_COLOR, themeSecondaryBgColor);
};

/**
 * 设置主题文字颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setThemeTextColor = (color) => {
    setColor(THEME_TEXT_COLOR, color);
    cache.set(THEME_TEXT_COLOR, color);
};

/**
 * 绑定已存在的自定义颜色
 */
export const setTheme = () => {
    THEME_ARRAY.forEach((theme) => {
        const themeColor = cache.get(theme);
        if (themeColor) setColor(theme, themeColor);
    });
};

