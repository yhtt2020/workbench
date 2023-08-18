import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {nanoid} from "nanoid";
//todo 此处要兼容web版
const {win32} = window.$models
let clipboardChanged = null
win32.watchClipboard(() => {
  if (clipboardChanged) {
    clipboardChanged()
  }
})


const clipboard = require('electron').clipboard
// @ts-ignore
export const clipboardStore = defineStore("clipboardStore", {
  state: () => ({
    items: [],
    settings: {
      enable: false,
      duration: 500,//ms
      previewShow: false,    // 控制预览显示
      clipSetShow: true, // 是否打开代码高亮
      showLineNumber: true, // 是否显示行号
      clipSize: 4,
      clipMode: 'javascript',  // 存储代码块语言包 默认js
      clipTheme: 'dracula',      // 存储代码块的主题颜色 默认monokai
    },
  }),
  actions: {
    async loadFromDb() {
      const rs= await tsbApi.db.allDocs('clipboard:item')
      this.items=rs.rows.map(row=>{
        return row?.doc
      })
    },
    prepare() {
      clipboardChanged = this.changed
    },
    changed() {
      console.log('剪切板内容变化')
      const availableFormats = clipboard.availableFormats()
      const formats = [
        'image/png',
        'text/uri-list',
        'text/plain',
        'text/html',
        'text/rtf'
      ]
      if (availableFormats.some((content) => {
        return content.includes('image')
      })) {
        //是图片
        console.log('剪切板图片变化')
        this.imageChange(clipboard.readImage())

        return
      }

      if (availableFormats.some((content) => {

        return content.includes('text/uri-list')
      })) {
        console.log('剪切板uri变化')
        //是文件
        return
      }
      if (availableFormats.some((content) => {

        return content.includes('text/plain')
      })) {
        //纯文字
        console.log('剪切板文本变化')
        this.textChange(clipboard.readText())
      }


    },
    start() {
      clipboardChanged = this.changed
    },
    stop() {
      clipboardChanged = null
    },
    isRunning() {
      return this.clipboardObserver.isRunning()
    },
    async textChange(text: string, beforeText: string) {
      let item = {
        type: 'text',
        content: text,
        time: Date.now()
      }
      this.items.unshift(item)
      await tsbApi.db.put({
        _id: "clipboard:item:" + nanoid(8),
        content: text,
        createTime: Date.now(),
        updateTime: Date.now(),
        type: 'text'
      })
      console.log('监测到新[文本]剪切板内容', text)
    },
    imageChange(image: any) {
      let item = {
        type: 'image',
        content: image,
        time: Date.now(),

      }
      //this.items.unshift(item)
      console.log('监测到[图片]新剪切板内容', image)
    },
    changeClipMode(code: string) {
      this.clipMode = code
      // console.log('语言包替换成功',this.clipMode);
    },
    isOpenPreview(val: boolean) {
      this.previewShow = val
      // console.log('打开预览',this.previewShow);
    },
    isClipLineNumber(val: boolean) {
      this.showLineNumber = val
      // console.log('显示行号',this.showLineNumber);
    },
    isSetCodeHighlight(val: boolean) {
      this.clipSetShow = val
      // console.log('设置代码高亮',val);
    },
    updateClipSize(val: number) {
      console.log('修改代码缩进', val);
      this.clipSize = val
    },
    updateTheme(val: string) {
      // console.log('修改主题色',val);
      this.clipTheme = val
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['settings',]
      // state 中的字段名，按组打包储存
    }]
  }
})
