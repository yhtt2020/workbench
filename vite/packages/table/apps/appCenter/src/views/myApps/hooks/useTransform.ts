import { nanoid } from "nanoid";
import { defaultData } from "../../../../../../ui/hooks/useDataConversion";

const typeArr = [
    'ttapp',
    'lightApp',
    'systemApp',
]

export const useTransform = (item) => {
    if(item.renewTime) {
        return {
            ...item,
            isStart:item.isStart || false,
        }
    }
    return {
        ...defaultData,
        ...item,
        isStart:item.isStart || false,
        icon:item.icon,
        name:item.name,
        id:item.id || nanoid(4),
        type: item.type || 'coolApp',
        value: typeArr.includes(item.type) ? item.value : item.installPath || item.data,
    };
}


/**
 * 默认开始菜单数据
 * @returns [社群，快捷指令，待办事项，ai，天气，备忘录，剪切板，浏览器，壁纸，游戏助手]
 */
export const defaultStartMenu = [
    'chat',
    'deck',
    'todo',
    'ai',
    'weather',
    'note',
    'clipboard',
    'browser',
    'my',
    'gameIndex',

]