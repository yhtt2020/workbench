import { getStyleColor } from "./getStyle";
import { setColor } from "./setStyle";
import { STYLE_ARRAY } from "./types";

/**
 * 绑定已存在的自定义颜色
 */
export const initStyle = () => {
    STYLE_ARRAY.forEach((Style) => {
        const styleColor = getStyleColor(Style);
        if (styleColor) setColor(Style, styleColor);
    });
};