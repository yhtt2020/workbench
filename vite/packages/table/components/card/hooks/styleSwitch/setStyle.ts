import cache from "../cache";
import { BG_COLOR, SECONDARY_BG_COLOR, TEXT_COLOR, WALLPAPER_COLOR } from "./types";

/**
 * 设置背景颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setBgColor = (color) => {
    setStyleName(BG_COLOR, color)
};

/**
 * 设置次要背景颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setSecondaryBgColor = (color) => {
    setStyleName(SECONDARY_BG_COLOR, color, 0.2)
};

/**
 * 设置文字颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setTextColor = (color) => {
    setStyleName(TEXT_COLOR, color)
};


/**
 * 设置壁纸颜色
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 */
export const setWallpaperColor = (color) => {
    setStyleName(WALLPAPER_COLOR, color)
};

/**
 * 统一的设置样式api
 * @param {string} styleName - 必填，样式名称
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 * @param {number} [opacity] - 可选，透明度参数，范围从 0 到 1，默认值为 1
 */
export const setStyleName = (styleName, color, opacity?) => {
    const StyleColor = setColor(styleName, color, opacity);
    cache.set(styleName, StyleColor);
}

/**
 * 修改类名的颜色参数及透明度
 * @param {string} text - 必填，要修改的类名
 * @param {string} color - 必填，颜色参数，支持十六进制和命名颜色
 * @param {number} [opacity] - 可选，透明度参数，范围从 0 到 1，默认值为 1
 * @returns {string} 修改后的颜色参数
 */
export const setColor = (text, color, opacity?) => {
    if (opacity != undefined && opacity < 0 || opacity > 1) {
        console.warn("Opacity value 需要在 0 和 1 之间");
    }
    const rgbaColor = opacity !== undefined ? convertToRGBA(color, opacity) : color;
    document.documentElement.style.cssText += `${text}:${rgbaColor} !important;`;
    return rgbaColor;
};

/**
 * / 将原始颜色转换为RGBA格式
 * @param color  - 必填
 * @param [opacity] - 可选，透明度参数，范围从 0 到 1，默认值为 1
 * @returns 
 */
export const convertToRGBA = (color, opacity) => {
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};