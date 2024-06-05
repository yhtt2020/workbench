import cache from "../components/card/hooks/cache";
import { cardStore } from "../store/card";
import { systemStore } from "./system";
import { SAVE_DATA } from "./consts";
/**
* @param data 需要进行保存的数据
* @param type 保存类型，选择保存的位置
* @param target 保存的索引，便于找寻保存的数据
*/
export const  saveData = async (data, type, target) => {
    const cards: any = cardStore();

    let {customIndex, desk, name} =  target
    
    switch (type) {
        case 'card':
            // 卡片级  数据存储在 卡片的  customData 里面
            await cards.updateCustomData(customIndex, data, desk)
            break;
        case 'desk':
            // 桌面级 数据存储在 桌面的 新 setting 字段
            await cards.updateDeskData(customIndex, data, desk)
            break;
        case 'system':
            // 系统级 数据存储在 pinia 里面 这个会自动判断  根据平台自行切换 localhost db
            const system = systemStore()
            const type_name = SAVE_DATA[name]
            if (customIndex) {
                let customData = system.customData[type_name]
                if(!customData) system.customData[type_name] = {}
                system.customData[type_name][customIndex] = { ...data }
            }else{
                system.customData[type_name] = { ...data }
            }
            break;
        // default:
        //     // 自动 判断 type 类型
        //     console.log('autoSave');
        //     break;
    }
};
