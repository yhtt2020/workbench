import { defaultData } from "../../../ui/hooks/useDataConversion"
import { nanoid } from "nanoid"

/**
 * 统一添加到到导航栏的卡片数据
 * @param data - 卡片数据
 * @returns 
 */
export const useConversionCard = (data) => {
    const index = data.customIndex
    let name = data.desk.cards.find((item) => item.id === index).name
    const icon = data.header.ifyIcon || data.header.icon || 'fluent:cloud-16-regular'
    let title = data.header.title || name
    title = changeName(title)
    name = capitalizeFirstLetter(name)
    // console.log(title,name,'title<<<<<<<<<<<<<<<')
    const cardData = {
        ...defaultData,
        type:'card',
        name:title,  // 卡片名称
        value:name,  // 卡片组件名
        icon:icon,
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

const nameObj = {
    'Clock':'闹钟',
    'TimerClock':'番茄钟',
    'Remote':'外部小组件',
    "CustomAssembly":"自定义图片组件",
    "clock":"闹钟",
    "timerClock":"番茄钟",
    "remote":"外部小组件",
    "customAssembly":"自定义图片组件",
    "TimerChart":"本周番茄时间",
    "timerChart":"本周番茄时间",
}

/**
 * 替换卡片英文名称
 * @param name 名字
 * @returns 
 */
const changeName = (name) => {
    if(nameObj[name]){
        name = nameObj[name]
        // console.log(nameObj[name],name,'nameObj[name]')
    }
    return name
}

