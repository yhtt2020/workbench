import { ref, onMounted } from "vue"
// 获取窗口大小
const viewWidth = ref(document.documentElement.clientWidth)
const viewHeight = ref(document.documentElement.clientHeight)

export default () => {
  onMounted(() => {
    // 窗口更新返回最新的窗口大小
    window.addEventListener("resize", () => {
      viewWidth.value = document.documentElement.clientWidth
      viewHeight.value = document.documentElement.clientHeight
    })
  })

  return {
    viewWidth,
    viewHeight
  }
}
