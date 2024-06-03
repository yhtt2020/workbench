import { useReplaceData } from './useReplaceData';
import { nanoid } from "nanoid";
import { defaultData } from "../../../../../../ui/hooks/useDataConversion";
import { useAppCenterStore } from './../../../store';
import { storeToRefs } from "pinia";
import navigationData from "../../../../../../js/data/tableData";
import { message } from 'ant-design-vue';

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


export const resetType = (list) => {
    // console.log(list.length, 'list')
    const appCenterStore = useAppCenterStore()
    const { startMenu } = storeToRefs(appCenterStore)
    if(list.length == 0 || !list.some(item => item.type === 'systemApp')){
        message.info('正在为您加载数据，请稍后')
        // console.log(list,'222')
        const sysApps = useReplaceData(navigationData.systemAppList);
        sysApps.forEach((item) => {
            list.push(item)
            let i = defaultStartMenu.find((r) => r === item.value)
            if(i){
                startMenu.value.unshift(item.id)
            }
        })
    }
    console.log(startMenu.value,'<<<<<<<<<<<')
    list = list.map((item) => {
        return useTransform(item)
    })
    return list
}