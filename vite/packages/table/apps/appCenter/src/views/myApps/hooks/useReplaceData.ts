import navigationData from '../../../../../../js/data/tableData'
import { mergeData } from '../../../../../../ui/hooks/useDataConversion'
import { useReplace } from '../../../../../../components/desk/addIcon/hook/useReplace'


export const useReplaceData = (data) => {
    let list = useReplace(data)
    list = list.map((item) => {
        return mergeData(item)
    })
    return list
}

// 根据开始菜单的状态，进行重新排序
export const reloadList = (list) => {
    return list.reduce((acc, item) => {
        if (item.isStart) {
            acc.unshift(item);
        } else {
            acc.push(item);
        }
        return acc;
    }, []);
};