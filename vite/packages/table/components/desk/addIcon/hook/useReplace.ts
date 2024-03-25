// 统一替换图标字段
import { nanoid } from "nanoid"
export const useReplace = (list) => {
    const arr = list.map((item) => {
        return {
            ...item,
            name: item.name,
            icon: item.icon,
            type: item.type || 'default',
            bg: '',
            isBg: false,
            summary: item.summary || '',
            mode: item.type === 'lightApp' ? 'link' : 'app',
            ext: item.ext || '',
            slot:item.slot || '',
            id:nanoid(6),
        }
    })
    arr.forEach(item => {
        item.value = replaceIcon(item)
    })
    return arr
}


// 统一替换图标value字段
const replaceIcon = (item) =>{
    let type = item.type
    switch (type){
        // 系统图标
        case 'systemApp':
            return item.event
        // 酷应用
        case 'coolApp':
            return item.data
        // 轻应用
        case 'lightApp':
            return {...item}
        // 桌面应用
        case 'tableApp':
            return item.path
        // 网址导航
        case 'default':
            return item.url
        // 文件夹
        case 'folder':
            return ''
        default:
            console.log('未知类型',type)
            return 
    }
}