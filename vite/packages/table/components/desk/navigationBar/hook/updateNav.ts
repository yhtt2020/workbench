// export const diffItem = (arr,list) => {
//     return arr.map(element => {
//         list.forEach(item => {
//             return findItem(element,item)
//         })
//     })
// }


// export const findItem = (item,target) => {
//     if(item.type === 'coolApp'){
//         return item.value.url !== target.value.url
//     }else if (item.value === 'folder' && target.value === 'folder') {
//         return findItem(item.children,target.children)
//     }else{
//         return item.value !== target.value
//     }
// }




export const diffItem = (arr, list) => {
    return arr.filter(element => {
        return !list.some(item => findItem(element, item));
    });
};

export const findItem = (item, target) => {
    if (item.type === 'coolApp') {
        return item.value.url !== target.value.url;
    } else if (item.value === 'folder') {
        return item.children.some(child => target.children.every(targetChild => findItem(child, targetChild)));
    } else {
        return item.value !== target.value;
    }
}
