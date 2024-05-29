import cache from "../components/card/hooks/cache";
import { cardStore } from "../store/card";
import { systemStore } from "./system";
import { SAVE_DATA } from "./consts";

/**
* @param type 需要检索的类型
* @param target 保存的索引，便于找寻保存的数据
* @returns 检索到的数据
*/
export const  loadData = async (type, target) => {
    const cards: any = cardStore();
    let {customIndex, desk, name} =  target
    switch (type) {
        case 'card':
            return await cards.getCustomData(customIndex, desk)
        case 'desk':
            return await cards.getDeskData(customIndex, desk)
        case 'system':
            const system = systemStore()
            if (!name) {
              throw '未提交name参数，此参数必须提供'
            }
            const type_name = SAVE_DATA[name]

            if(!system.customData[type_name]) system.customData[type_name] = {}
            
            if (customIndex) {
                return system.customData[type_name][customIndex]
            }else{
                return system.customData[type_name]
            }
    }
};