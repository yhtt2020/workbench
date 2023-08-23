import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {nanoid} from "nanoid";
import {getDateTime} from '../util'

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
    items: [],//剪切板的收集箱内容
    index:0,
    hasNextPage: false,
    totalRows:0,
    collections: [],//我的收藏，收藏的时候从中复制一个出来，方便后面查找。
    settings: {
      enable: false,
      duration: 500,//ms
      previewShow: false,    // 控制预览显示
      codeHighlight: true, // 是否打开代码高亮
      showLineNumber: true, // 是否显示行号
      clipSize: 4,
      clipMode: 'javascript',  // 存储代码块语言包 默认js
      clipTheme: 'dracula',      // 存储代码块的主题颜色 默认monokai
      pageSize: 20,
    },
  }),
  actions: {
    async nextPage(dbKey) {
      if (this.hasNextPage) {
        const rs = await tsbApi.db.allDocsQuery({
          start_key: this.items[this.items.length - 1]._id+'\ufff0',
          end_key: dbKey,
          skip:1,
          descending: true,
          limit: this.settings.pageSize,
          include_docs:true,
        })
        this.hasNextPage = this.settings.pageSize === rs.rows.length //如果页面尺寸大于当前的行数
        rs.rows.forEach(row => {
          const doc = row?.doc
          if(doc){
            this.items.push(doc)
          }
        })
        this.totalRows=rs.total_rows
        return true
      } else {
        return false
      }
    },
    async loadFromDb(key) {
      const rs = await tsbApi.db.allDocsQuery({
        start_key: key + '\ufff0',
        end_key: key,
        // skip: (page - 1) * pageSize,
        // limit:pageSize,
        include_docs: true,
        descending: true,
        limit: this.settings.pageSize
      })
      this.hasNextPage = this.settings.pageSize === rs.rows.length //如果页面尺寸大于当前的行数
      this.items = rs.rows.map(row => {
        const doc = row?.doc
        return doc
      })

  console.log(rs,'查到结果')
      this.totalRows=rs.total_rows
      // console.log('分页后的rs',rs)
      // for await (const results of rs.pages()){
      //   console.log(results)
      // }

      // this.items = rs.rows.map(row => {
      //   const doc = row?.doc
      //   return doc
      // })
      //
      //
      // let resCount=await tsbApi.db.allDocs(key)
      // let totalRows=resCount.total_rows
      //
      // console.log('总行数',resCount)
      // return totalRows
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
    /**
     * 删除剪切板项目
     * @param item
     */
    async remove(item) {
      await tsbApi.db.remove(item)
      let itemIndex = this.items.findIndex(li => {
        if (li._id === item._id) {
          return true
        }
      })
      if (itemIndex > -1) {
        this.items.splice(itemIndex, 1)
      }
    },
    async addToCollection(item) {
      await tsbApi.db.put({
        _id: 'clipboard:collection:' + Date.now(),
        originData: item,
        createTime: Date.now(),
        updateTime: Date.now()
      })
      this.collections.unshift(item)

    },
    /**
     * 清空剪切板
     */
    async clean() {
      let items = await tsbApi.db.allDocs('clipboard:item:')
      for (const item of items.rows) {
        console.log(item, '当前要删除', item.id, item.doc._rev)
        await tsbApi.db.remove(item.doc)
      }
      this.items = []
      this.totalRows=0
      return true
    },
    /**
     * 当文字改变的时候的回调
     * @param text
     * @param beforeText
     */
    async textChange(text: string, beforeText: string) {
      const now = Date.now()
      const time = getDateTime(new Date(now))
      this.index++
      let item = {
        _id: "clipboard:item:" + now,
        type: 'text',
        content: text,
        createTime: now,
        index:this.index,
        updateTime: now,
      }
      this.totalRows++
      this.items.unshift(item)
      await tsbApi.db.put({
        _id: "clipboard:item:" + now,
        content: text,
        index:this.index,
        createTime: now,
        updateTime: now,
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
      paths: ['settings', 'items','totalRows','index']
      // state 中的字段名，按组打包储存
    }]
  }
})
