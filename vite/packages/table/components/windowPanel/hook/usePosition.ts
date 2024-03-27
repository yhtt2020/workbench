
export const usePosition = (e,i) => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const eWidth = e.x
    const eHeight = e.y > 200 ? windowHeight - e.y : e.y
    const iWidth = i.x
    const iHeight = i.y 

    // console.log(windowWidth, windowHeight, eWidth, eHeight, iWidth, iHeight)

    return {
        x: eWidth > windowWidth - (iWidth / 2) ? windowWidth - iWidth : (eWidth - (iWidth / 2) < 0 ? 0 : eWidth - (iWidth / 2)),
        y: eHeight + iHeight > windowHeight ? eHeight + 30 : windowHeight - iHeight - eHeight - 30,
    }
}