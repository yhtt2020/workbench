import { onMounted, type App, onBeforeUnmount } from 'vue'

// 创建一个弱映射表，用于存储元素和回调之间的关系
const elementMap = new WeakMap<Element, any>()

// 创建 ResizeObserver 实例，并在回调函数中处理元素大小变化事件
const elementObserver = new ResizeObserver((entries) => {
  // 获取目标元素和大小
  for (const { target, borderBoxSize } of entries) {
    // 根据目标元素获取对应的回调
    const callback = elementMap.get(target)
    // 解构出目标大小的宽度和高度，并传递给回调函数
    const { inlineSize: width, blockSize: height } = borderBoxSize[0]
    callback?.({ width, height })
  }
})

const start = (el: any, cb: any) => {
  elementObserver.observe(el)
  elementMap.set(el, cb)
}
const clear = (el: Element) => {
  elementObserver.unobserve(el) // 取消监听
  elementMap.delete(el) // 从映射表中删除元素和回调之间的关系
}
export const useResize = (el: any, cb: any) => {
  onMounted(() => {
    start(el, cb)
  })
  onBeforeUnmount(() => {
    clear(cb)
  })
}

// 局部注册
export const reSize = {
  mounted: (el: Element, binding: any) => {
    start(el, binding.value)
  },
  unmounted: (el: Element) => {
    clear(el)
  }
}

// 全局注册
export const install = (app: App): void => {
  app.directive('resize', reSize)
}
