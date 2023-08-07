import {ISort} from "./interfaces";

const DataSourceTypes = {
    LOCAL_STORAGE: 'localStorage'
}
const MenuState = {
    FOLD: '1',
    UN_FOLD: '0'
}
const sortType = {
    TIME:<ISort> {
        title: '时间',
        value: 1
    },//时间
    TITLE:<ISort> {title: '标题', value: 2},//标题
    LIST: <ISort>{title: '清单', value: 3},//清单
}
export {
    DataSourceTypes, MenuState, sortType
}

