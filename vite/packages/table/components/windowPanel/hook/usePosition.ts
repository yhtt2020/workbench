import { useNavigationStore } from './../../desk/navigationBar/navigationStore';
import { storeToRefs } from 'pinia'
/**
 * 动态调整元素的定位
 * @param e 鼠标点击的位置
 * @param i 元素的宽高
 * @returns 返回元素的位置
 */
export const usePosition = (e,i) => {
    const useNav = useNavigationStore();
    const { navAttribute, currentNavFormat } = storeToRefs(useNav);
    // 系统宽高
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    // 鼠标点击的坐标
    const eWidth = e.x
    const eHeight = e.y
    // 元素的宽高
    const iWidth = i.x
    const iHeight = i.y 

    // 调整元素的定位
    const num = currentNavFormat.value === 'mac' ? 65 : 55

    // console.log(windowWidth, windowHeight, eWidth, eHeight, iWidth, iHeight,eHeight + iHeight > windowHeight )
    // const target = windowHeight - ( windowHeight - eHeight + iHeight )
    // const target = windowHeight - iHeight - 80
    // console.log(target,iHeight,iWidth)
    
    return {
        x: eWidth > windowWidth - (iWidth / 2) ? windowWidth - iWidth : (eWidth - (iWidth / 2) < 0 ? 20 : eWidth - (iWidth / 2)),
        y: 
            eHeight + iHeight > windowHeight ?  
            (- iHeight + eHeight - num) / (navAttribute.value.navSize / 100) : 
            (eHeight + num ) * (navAttribute.value.navSize / 100),
    }
}