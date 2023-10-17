import type { App } from "vue"

// 创建一个映射表，用于存储元素和回调之间的关系
const map = new WeakMap<Element, any>()

// 创建 ResizeObserver 实例，并在回调函数中处理元素大小变化事件
const observer = new ResizeObserver((entries) => {
  // 获取目标元素和大小
  for (const { target, borderBoxSize } of entries) {
    // 根据目标元素获取对应的回调
    const callback = map.get(target)
    // 解构出目标大小的宽度和高度，并传递给回调函数
    const { inlineSize: width, blockSize: height } = borderBoxSize[0]
    callback?.({ width, height })
  }
})

// 局部注册
export const reSize = {
  mounted: (el: Element, binding: any) => {
    observer.observe(el) // 监听元素大小变化
    map.set(el, binding.value) // 将元素和回调之间的关系存储到映射表中
  },
  unmounted: (el: Element) => {
    observer.unobserve(el) // 取消监听
    map.delete(el) // 从映射表中删除元素和回调之间的关系
  }
}

// 全局注册
export const install = (app: App): void => {
  app.directive("resize", reSize)
}
