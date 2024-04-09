import { navStore } from './../../../store/nav';
import { storeToRefs } from 'pinia';

/**
 * 查看其他两个存在的导航栏的数据
 * @param nav 'left' | 'right' | 'foot'
 * @returns 返回其他两个显示导航栏的数据
 */
export const useOtherNav = (nav : 'left' | 'right' | 'foot') => {
    const useNav = navStore()
    const { copyFootNav, sideNavigationList, rightNavigationList, navigationToggle } = storeToRefs(useNav)
    const obj = { 
        'foot' : () => {
            let left = navigationToggle.value[0] ? sideNavigationList.value : []
            let right = navigationToggle.value[1] ? rightNavigationList.value : []
            return [...left, ...right]
        },
        'left' : () => {
            let foot = navigationToggle.value[2] ? copyFootNav.value : []
            let right = navigationToggle.value[1] ? rightNavigationList.value : []
            return [...foot, ...right]
        },
        'right' : () => {
            let foot = navigationToggle.value[2] ? copyFootNav.value : []
            let left = navigationToggle.value[0] ? sideNavigationList.value : []
            return [...foot, ...left]
        }
    }
    return obj[nav]()
}

/**
 * 查看其他两个存在的导航栏中是否有目标数据
 * @param nav 'left' | 'right' | 'foot'
 * @param checkFunction (item: { value: string; type: string; children: any }) => boolean 自定义函数
 * @returns Boolean
 */
export const checkTarget = (
    nav: 'left' | 'right' | 'foot',
    checkFunction: (item: { value: string; type: string; children: any }) => boolean
  ) => {
    const list = useOtherNav(nav);
    const target = list.find((item: { value: string; type: string; children: any }) => {
      if (item.type === 'folder') {
        return item.children.some(checkFunction);
      } else {
        return checkFunction(item);
      }
    });
    return target;
  };
  