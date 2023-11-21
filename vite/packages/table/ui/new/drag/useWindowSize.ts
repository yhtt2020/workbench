import { ref, onMounted, onBeforeUnmount } from "vue"

export const useWindowSize = (callback?: Function, timer = 200) => {
  // 创建窗口大小
  const width = ref(document.documentElement.clientWidth)
  const height = ref(document.documentElement.clientHeight)

  let resizeTimer: any = null

  const updateWindowSize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      width.value = window.document.documentElement.clientWidth
      height.value = window.document.documentElement.clientHeight
      callback &&
        callback({
          width,
          height
        })
    }, timer)
  }
  updateWindowSize()
  window.addEventListener("resize", updateWindowSize)

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateWindowSize)
    clearTimeout(resizeTimer)
  })

  return {
    width,
    height
  }
}
