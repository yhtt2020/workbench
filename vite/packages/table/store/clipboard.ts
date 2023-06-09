import {defineStore} from "pinia";
import {ClipboardObserver} from '../js/common/clipboardObserver'

export const clipboardStore = defineStore("clipboardStore", {
  state: () => ({
    enable: false,
    items: [],
    clipboardObserver: {},
    settings: {
      duration: 500//ms
    }
  }),
  actions: {
    prepare() {
      this.clipboardObserver = new ClipboardObserver({
        duration: this.settings.duration,
        textChange: this.textChange,
        imageChange: this.imageChange
      })
    },
    start() {
      this.clipboardObserver.start()
    },
    stop() {
      this.clipboardObserver.stop()
    },
    isRunning(){
      return this.clipboardObserver.isRunning()
    },
    textChange(text: string, beforeText: string) {
      let item = {
        type: 'text',
        content: text,
        time: Date.now()
      }
      this.items.push(item)
      console.log('监测到新[文本]剪切板内容', text)
    },
    imageChange(image: any, beforeImage: any) {
      let items = {
        type: 'image',
        content: image,
        time: Date.now()
      }
      this.items.push(image)
      console.log('监测到[图片]新剪切板内容', image)
    }
  }
})
