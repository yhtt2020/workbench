export const replaceIcon = (item) =>{
    let type = item.type
    switch (type){
        case 'systemApp':
            return item.event
        case 'coolApp':
            return item.data
        case 'lightApp':
            return {url:item.url || '',package:item.package || '',id:item.appid || '',...item}
        case 'tableApp':
            return item.path
    }
}