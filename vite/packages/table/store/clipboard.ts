import {defineStore} from "pinia";
import {ClipboardObserver} from '../js/common/clipboardObserver'

export const clipboardStore = defineStore("clipboardStore", {
  state: () => ({
    enable: false,
    previewShow:false,    // 控制预览显示
    clipSetShow:true, // 是否打开代码高亮
    showLineNumber:true, // 是否显示行号
    clipSize:4, 
    clipMode:'javascript',  // 存储代码块语言包 默认js
    clipTheme:'dracula',      // 存储代码块的主题颜色 默认monokai
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
      let item = {
        type: 'image',
        content: image,
        time: Date.now()
      }
      this.items.push(item)
      console.log('监测到[图片]新剪切板内容', image)
    },
    changeClipMode(code:string){
      this.clipMode = code
      // console.log('语言包替换成功',this.clipMode);
    },
    isOpenPreview(val:boolean){
      this.previewShow = val
      // console.log('打开预览',this.previewShow);
    },
    isClipLineNumber(val:boolean){
      this.showLineNumber = val
      // console.log('显示行号',this.showLineNumber);
    },
    isSetCodeHighlight(val:boolean){
      this.clipSetShow = val
      // console.log('设置代码高亮',val);
    },
    updateClipSize(val:number){
      console.log('修改代码缩进',val);
      this.clipSize = val
    }
  }
})
