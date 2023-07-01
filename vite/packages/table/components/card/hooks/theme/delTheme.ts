import cache from "../../../../page/app/addIcon/hooks/cache";
import { delColor } from "./theme";
import { THEME_BG_COLOR, THEME_SECONDARY_BG_COLOR, THEME_TEXT_COLOR } from "./types";
/**
 * 清除主题背景颜色样式属性
 */
export const delThemeBgColor = () => {
    delColor(THEME_BG_COLOR);
    cache.del(THEME_BG_COLOR);
};

/**
 * 清除主题次要背景颜色样式属性
 */
export const delThemeSecondaryBgColor = () => {
    delColor(THEME_SECONDARY_BG_COLOR);
    cache.del(THEME_SECONDARY_BG_COLOR);
};

/**
 * 清除主题文字颜色样式属性
 */
export const delThemeTextColor = () => {
    delColor(THEME_TEXT_COLOR);
    cache.del(THEME_TEXT_COLOR);
};
