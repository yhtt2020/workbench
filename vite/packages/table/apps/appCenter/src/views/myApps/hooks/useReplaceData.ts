import navigationData from '../../../../../../js/data/tableData'
import { mergeData } from '../../../../../../ui/hooks/useDataConversion'
import { useReplace } from '../../../../../../components/desk/addIcon/hook/useReplace'


export const useReplaceData = (data) => {
    let list = useReplace(data)
    list = list.map((item) => {
        return mergeData(item)
    })
    console.log(list,'<<<<<<<,list')
    return list
}