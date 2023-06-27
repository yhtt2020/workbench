import {defineStore} from "pinia";
import dbStorage from "./dbStorage";

export const captureStore = defineStore("captureStore", {
  state: () => ({
    sources: [],
    settings: {
      //截图保存位置
      imageSavePath: '',
      //录屏保存位置
      videoSavePath: '',
      videoBitsPerSecond:1.5e6
    },
    images:[],
    videos:[]
  }),
  actions: {
    bindCaptureIPC() {
      console.log('绑定capture事件')
      ipc.on('gotRecordSource', (event, args) => {
        console.log('回传消息=', args)
        this.sources = args.sources
      })
    },
    getSource() {
      ipc.send('getRecordSource')
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
