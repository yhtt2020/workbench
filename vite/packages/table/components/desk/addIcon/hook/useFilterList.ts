// 筛选列表
export const useFilterList = (list:string[] | object[] | any,value:string | undefined | any) => {
    const input = value ? value.toLowerCase() : ''
    return list.filter(item => item?.name.toLowerCase().includes(input))
}