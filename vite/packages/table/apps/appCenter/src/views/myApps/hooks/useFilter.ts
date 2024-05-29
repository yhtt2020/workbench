
export const useFilter = (list, tag, input='') => {
    const arr = list.filter((item) => {
        return item.name.includes(input) && item.type === tag
    })
    return arr
}