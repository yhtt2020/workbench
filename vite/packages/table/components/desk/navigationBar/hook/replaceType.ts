import { nanoid } from "nanoid";
/**
 * 替换导航栏图标格式
 * @param list 导航栏数据
 * @returns
 */
export const replaceType = (list) => {
  // 去除无效图标
  // const arr = list.filter((item) => item !== null && item !== undefined);
  // console.log(arr,'arr')

    return list.map((item)=>{
        switch (item.type) {
            case 'systemApp':
              return { ...item,};
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
                  children: replaceType(item.children),
                  id:  item.id || nanoid(6),
                }
              }
              return { ...item }
            default:
              return {
                ...item,
                mode: 'link',
                type: 'default',
                value: item.url || item.value,
              };
          }
    }).map((item) => ({
        ...item,
        bg: item.bg || '',  // 背景色
        isBg:item.isBg || false,  // 是否有背景
        id: item.id ||  nanoid(6),  // id
        isName: true,  // 是否有名称
        radius:0,  // 圆角
        useCount:0,  // 使用次数
        lastUseTime:'',  // 最后使用时间
        iconState:'cover',  // 图标样式
        iconShape:'square',  // 图标形状
        size:item.size || '1x1',  // 图标大小
        attributeEdit:item.value === 'home' ? false : true,  // 是否可编辑
      }));
}
