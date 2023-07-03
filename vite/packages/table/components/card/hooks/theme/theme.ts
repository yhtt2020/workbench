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
export const delColor = (text) => {
    document.documentElement.style.removeProperty(text);
};
