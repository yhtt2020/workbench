import { onBeforeUnmount, ref } from "vue"
import type { App } from "vue"
let resizeObserver: ResizeObserver

function createResizeObserver(callback: Function, width?: any, height?: any) {
  resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (callback) {
        callback({
          width: entry.borderBoxSize[0].inlineSize,
          height: entry.borderBoxSize[0].blockSize
        })
      }
      if (width !== undefined && height !== undefined) {
        width.value = entry.borderBoxSize[0].inlineSize
        height.value = entry.borderBoxSize[0].blockSize
      }
    })
  })
}

export function useElementSize(el: HTMLElement, callback: Function = () => {}) {
  const width = ref(0)
  const height = ref(0)
  createResizeObserver(callback, width, height)
  resizeObserver.observe(el)
  onBeforeUnmount(() => {
    resizeObserver.unobserve(el)
    console.log("resizeObserver销毁了");

  })
  return { width: width, height: height }
}

export const vElementSize = {
  mounted: (el: Element, binding: any) => {
    createResizeObserver(binding.value)
    resizeObserver.observe(el)
  },
  unmounted: (el: Element) => {
    resizeObserver.unobserve(el)
    console.log("resizeObserver销毁了");

  },
  install: (app: App) => {
    app.directive("elementSize", vElementSize)
  }
}
