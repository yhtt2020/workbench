import cache from "../../../../page/app/addIcon/hooks/cache";
import { BG_COLOR, SECONDARY_BG_COLOR, TEXT_COLOR ,WALLPAPER_COLOR} from "./types";
/**
 * 获取背景颜色
 * @returns {string} 背景颜色
 */
export const getBgColor = () => getStyleColor(BG_COLOR)

/**
 * 获取次要背景颜色
 * @returns {string} 次要背景颜色
 */
export const getSecondaryBgColor = () => getStyleColor(SECONDARY_BG_COLOR)

/**
 * 获取文本颜色
 * @returns {string} 文本颜色
 */
export const getTextColor = () => getStyleColor(TEXT_COLOR)

/**
 * 获取壁纸颜色
 * @returns {string} 壁纸颜色
 */
export const getWallpaperColor = () => getStyleColor(WALLPAPER_COLOR)

/**
 * 统一获取样式数据api
 */
export const getStyleColor = (styleName) => cache.get(styleName, "");