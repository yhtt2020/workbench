import cache from "../../../../page/app/addIcon/hooks/cache";
import { BG_COLOR, SECONDARY_BG_COLOR, TEXT_COLOR, WALLPAPER_COLOR } from "./types";
/**
 * 清除背景颜色样式属性
 */
export const delBgColor = () => {
    delColor(BG_COLOR);
};

/**
 * 清除次要背景颜色样式属性
 */
export const delSecondaryBgColor = () => {
    delColor(SECONDARY_BG_COLOR);
};

/**
 * 清除文字颜色样式属性
 */
export const delTextColor = () => {
    delColor(TEXT_COLOR);
};

/**
 * 清除壁纸颜色样式属性
 */
export const delWallpaperColor = () => {
    delColor(WALLPAPER_COLOR);
};

/**
 * 统一删除样式api
 * @param {string} styleName - 必填，要清除样式的类名
 */
export const delColor = (styleName) => {
    document.documentElement.style.removeProperty(styleName);
    cache.del(styleName);
};