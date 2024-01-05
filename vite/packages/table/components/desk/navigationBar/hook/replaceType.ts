/**
 * 替换导航栏图标格式
 * @param list 导航栏数据
 * @returns 
 */
export const replaceType = (list) => {
  // 去除无效图标
  const arr = list.filter((item) => item !== null && item !== undefined);
    return arr.map((item)=>{
        switch (item.type) {
            case 'systemApp':
              return { ...item };
            case 'coolApp':
              return {
                ...item,
                mode: 'app',
                value: item.data || item.value
              };
            case 'lightApp':
              return {
                ...item,
                mode: 'link',
                value: item.package || item.value
              };
            case 'tableApp':
              return {
                ...item,
                mode: 'app',
                value: item.path || item.value
              };
            case 'folder':
              if(item.children){
                return {
                  ...item,
                  mode: 'app',
                  value: 'folder',
                  children: replaceType(item.children)
                }
              }
              return { ...item }
            default:
              return {
                ...item,
                mode: 'link',
                type: 'default',
                value: item.url || item.value
              };
          }
    }).map((item) => ({
        ...item,
        bg: '',
        isBg: false
      }));
}