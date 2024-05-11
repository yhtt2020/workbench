import { useNavigationStore } from './../../desk/navigationBar/navigationStore';
import { storeToRefs } from 'pinia'
/**
 * 动态调整元素的定位
 * @param e 鼠标点击的位置
 * @param i 元素的宽高
 * @returns 返回元素的位置
 */
export const usePosition = (event, itemSize) => {
    const useNav = useNavigationStore();
    const { navAttribute, currentNavFormat, currentNavPosition } = storeToRefs(useNav);

    // 获取窗口尺寸和缩放因子
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scale = navAttribute.value.navSize / 100;

    // 获取鼠标点击位置和元素尺寸
    const mouseX = event.x;
    const mouseY = event.y;
    const itemWidth = itemSize.x;
    const itemHeight = itemSize.y;

    // 最小差值 -- 导航栏和元素的间隙
    const min = 10;
    // 导航栏高度
    const NavH = (currentNavFormat.value === 'mac' ? 90 : 64) * scale;
    // 导航栏当前位置
    const isTop = currentNavPosition.value === 'top' 

    // 计算 x 坐标
    const boundaryX = windowWidth - itemWidth;
    const centerX = mouseX - itemWidth / 2;
    const x = Math.max(20, Math.min(boundaryX, centerX));

    // 计算 y 坐标，并根据导航属性的缩放调整
    const y = isTop ? NavH + min : windowHeight - itemHeight - min - NavH;

    return { x, y: y };
}

/**
 * min = 10
 * mac:80 win:64
 * elementH
 * winH
 * top = winH - elementH - 10 - 80
 * 
 */
