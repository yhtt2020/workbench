import { defaultData } from "../../../ui/hooks/useDataConversion"
import { nanoid } from "nanoid"
export const useConversionCard = (data) => {
    const index = data.customIndex
    let name = data.desk.cards.find((item) => item.id === index).name
    const icon = data.header.ifyIcon || data.header.icon
    const title = data.header.title
    name = capitalizeFirstLetter(name)
    const cardData = {
        ...defaultData,
        type:'card',
        name:title || name,  // 卡片名称
        value:name,  // 卡片组件名
        icon:icon || 'fluent:cloud-16-regular',
        isBg:true,
        bg:getRandomColor(),
        cardData:{
            customIndex:index,
            customData:data.customData || {customSize:data.customSize},
            customSize:data.customSize,
            desk:data.desk
        },
        id:nanoid(6),
    }
    return cardData

}

/**
 * 首字母大写
 * @param string - 需要首字母大写的字符串
 * @returns 
 */
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 随机颜色
 * @returns 16进制
 */
const getRandomColor = () => {
    // 生成一个随机数，并通过toString(16)转换为十六进制字符串
    // toString(16)会将数字转换为它的十六进制表示
    // substr(-6)确保字符串长度为6，如果生成的十六进制数不足6位，前面会补0
    const color = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    return color;
}

