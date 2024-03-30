
/**
 * 动态调整元素的定位
 * @param e 鼠标点击的位置
 * @param i 元素的宽高
 * @returns 返回元素的位置
 */
export const usePosition = (e,i) => {
    // 系统宽高
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    // 鼠标点击的坐标
    const eWidth = e.x
    const eHeight = e.y
    // 元素的宽高
    const iWidth = i.x
    const iHeight = i.y 

    // console.log(windowWidth, windowHeight, eWidth, eHeight, iWidth, iHeight,eHeight + iHeight > windowHeight )
    // const target = windowHeight - ( windowHeight - eHeight + iHeight )

    return {
        x: eWidth > windowWidth - (iWidth / 2) ? windowWidth - iWidth : (eWidth - (iWidth / 2) < 0 ? 20 : eWidth - (iWidth / 2)),
        y: eHeight + iHeight > windowHeight ?  - iHeight + eHeight - 30 : eHeight + 30 ,
    }
}