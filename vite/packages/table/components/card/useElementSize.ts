import { onBeforeUnmount } from "vue"
const map = new WeakMap()
let resize = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const callback = map.get(entry.target)
    if (callback) {
      callback({
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
      })
    }
  })
})
export function useElementSize(el: HTMLElement, callback: Function) {
  map.set(el, callback)
  resize.observe(el)
  onBeforeUnmount(() => {
    resize.unobserve(el)
    map.delete(el)
  })
}

export const vElementSize = {
  mounted: (el: Element, binding: any) => {
    resize.observe(el)
    map.set(el, binding.value)
  },
  unmounted: (el: Element) => {
    resize.unobserve(el)
    map.delete(el)
  }
}
