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
    // 替换英文名称
    title = changeName(title)
    // 首字母强制大写
    name = capitalizeFirstLetter(name)
    const cardData = {
        ...defaultData,
        type:'card', // 卡片类型
        name:title,  // 卡片名称
        value:name,  // 卡片组件名
        icon:icon,   // 卡片图标
        isBg:true,   // 可以修改卡片背景颜色
        bg:getRandomColor(),  // 卡片随机背景颜色
        cardData:{
            customIndex:index,  // 卡片在导航栏中的索引
            customData:data.customData || {customSize:data.customSize}, // 卡片自定义数据
            customSize:data.customSize, // 卡片自定义尺寸
            desk:data.desk // 卡片所在的桌面
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
    const colorList = {
        color1: "#508BFE",
        color2: "#815BD0",
        color3: "#C8BF55",
        color4: "#DE5D5D",
        color5: "#57BF60",
        color6: "#DE5DB3",
        color7: "#808080",
        color8: "#43CADE",
        color9: "#FFFFFF",
    }
    const num = Math.floor(Math.random() * 9);
    const color = colorList[`color${num}`];
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

