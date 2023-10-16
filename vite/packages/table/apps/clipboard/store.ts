import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {getDateTime} from '../../util'

//todo 此处要兼容web版
const {win32} = window.$models
let clipboardChanged = null
win32.watchClipboard(() => {
  if (clipboardChanged) {
    clipboardChanged()
  }
})

const {fs} = window.$models

const clipboard = require('electron').clipboard
// @ts-ignore
export const clipboardStore = defineStore("clipboardStore", {
  state: () => ({
    // 历史和收藏切换数组默认值
    tab: {title: '剪切板历史', icon: 'time-circle', name: 'history'},
    loading: false,//控制加载动画
    items: [],//剪切板的收集箱内容
    filterType: 'all',
    findMap: {},//查询方法
    index: 0,
    hasNextPage: true,
    searchWords: '',//搜索关键词
    totalRows: 0,
    collections: [],//我的收藏，收藏的时候从中复制一个出来，方便后面查找。
    previewShow: false,//预览
    settings: {
      historyCapacity:86400,//历史容量，默认一天
      enable: false,
      duration: 500,//ms
      codeHighlight: true, // 是否打开代码高亮
      showLineNumber: true, // 是否显示行号
      clipSize: 4,//缩进单位
      clipMode: 'javascript',  // 存储代码块语言包 默认js
      clipTheme: 'dracula',      // 存储代码块的主题颜色 默认monokai
      pageSize: 10,//每页显示数量
    },
  }),
  actions: {
    async doSearch() {
      this.items = []
      this.hasNextPage=true
      this.nextPage()
    },
    async nextPage() {
      let dbKey = ''
      if (this.tab.name === 'history') {
        dbKey = 'clipboard:item:'
      } else {
        dbKey = 'clipboard:collection:'
      }

      let time = Date.now()
      if (this.hasNextPage) {
        this.loading = true
        await tsbApi.db.createIndex({
          index: {
            fields: ['type', 'createTime', 'content','searchKey']
          }
        })
        let map: any = {
          _id: {
            $regex: new RegExp(`^${dbKey}`)
          }
        }
        if (this.filterType !== 'all') {
          map.type = this.filterType
        }
        if (this.items.length > 0) {
          map.createTime = {
            $lt: this.items[this.items.length - 1].createTime
          }
        }

        if (this.searchWords) {
          //替换掉特殊字符，保证查询准确性
          function escapeSpecialChars(str) {
            // 定义需要转义的特殊字符
            const specialChars = /[.*+?^${}()|[\]\\]/g;

            // 使用正则表达式替换特殊字符
            return str.replace(specialChars, "\\$&");
          }
          const words=escapeSpecialChars(this.searchWords)
          map['$or'] = [
            {
              content: {
                $regex: new RegExp(`.*${words}.*`,'ig')
              },
            },
            {
              searchKey: {
                $regex: new RegExp(`.*${words}.*`,'ig')
              },
            }
          ]
        }

        console.log('查询调节', map)
        let rsFiltered = await tsbApi.db.find({
          selector: map,
          limit: this.settings.pageSize,
          sort: [
            {
              '_id': 'desc'
            }
          ]
        })


        this.items = this.items.concat(rsFiltered.docs)
        this.loading = false
        this.hasNextPage = this.settings.pageSize === rsFiltered.docs.length
        if (dbKey.includes('collection')) {
          for (const item of rsFiltered.docs) {
            if (!item.type) {
              await tsbApi.db.remove(item)
            }
          }
        }

        return rsFiltered
      }

      // const rs = await tsbApi.db.allDocsQuery({
      //   start_key: this.items[this.items.length - 1]._id + '\ufff0',
      //   end_key: dbKey,
      //   skip: 1,
      //   descending: true,
      //   limit: this.settings.pageSize,
      //   include_docs: true,
      // })
      // this.hasNextPage = this.settings.pageSize === rs.rows.length //如果页面尺寸大于当前的行数
      // rs.rows.forEach(row => {
      //   const doc = row?.doc
      //   if (doc) {
      //     this.items.push(doc)
      //   }
      // })
      // this.totalRows = rs.total_rows
      // return this.hasNextPage
    },
    async loadFromDb(key) {
      // this.loading=true
      // if(this.filterType!=='all'){
      //   await tsbApi.db.createIndex({
      //     index:{
      //       fields:['type','createTime']
      //     }
      //   })
      //
      //   let rsFiltered=await tsbApi.db.find({
      //     selector:{
      //       type:this.filterType,
      //       _id:{
      //         $regex:new RegExp(`^${key}:`)
      //       }
      //     },
      //     limit:this.settings.pageSize,
      //     sort:[
      //       {
      //         '_id':'desc'
      //       }
      //     ]
      //   })
      //   this.items=rsFiltered.docs
      //   this.loading=false
      //   this.hasNextPage = this.settings.pageSize === rsFiltered.docs.length
      //
      //   console.log('find结果',rsFiltered)
      //   return
      // }
      //
      //
      // const rs = await tsbApi.db.allDocsQuery({
      //   start_key: key + '\ufff0',
      //   end_key: key,
      //   // skip: (page - 1) * pageSize,
      //   // limit:pageSize,
      //   include_docs: true,
      //   descending: true,
      //   limit: this.settings.pageSize
      // })
      // this.hasNextPage = this.settings.pageSize === rs.rows.length //如果页面尺寸大于当前的行数
      // this.items = rs.rows.map(row => {
      //   const doc = row?.doc
      //   return doc
      // })
      // this.loading=false
      // this.totalRows = rs.total_rows
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
    async removeExpiredItems() {
      if (this.settings.historyCapacity === 0) {
        return //无限期不做处理
      }
      let timeLimit = Date.now() - this.settings.historyCapacity * 1000 //截止时间
      let map: any = {
        _id: {
          $regex: new RegExp(`^clipboard:item:`)
        }
      }
      map.createTime = {
        $lt: timeLimit
      }
      let rsFiltered = await tsbApi.db.find({
        selector: map,
        limit: this.settings.pageSize,
        sort: [
          {
            '_id': 'desc'
          }
        ]
      })
      for (const item of rsFiltered.docs) {
        await this.remove(item)
      }


    },
    setClipboard(type, item) {
      switch (type) {
        case 'text':
          require('electron').clipboard.writeText(item)
          break;
        case 'image':
          require('electron').clipboard.writeImage(require('electron').nativeImage.createFromPath(item))
          break
        case 'video':
        case 'audio':
          win32.setClipboardFilePaths([item])
          break;
        case 'file':
          win32.setClipboardFilePaths(...item)

      }
    },
    changed() {
      console.log('剪切板内容变化')
      if(!this.settings.enable){
        console.log('因为没有启用，所以阻止了')
        return
      }
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
        this.imageChange(clipboard.readImage())
        return
      }

      if (availableFormats.some((content) => {
        return content.includes('text/uri-list')
      })) {
        this.uriChange(win32.getClipboardFilePaths())
        //是文件
        return
      }
      if (availableFormats.some((content) => {
        return content.includes('text/plain')
      })) {
        //纯文字
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
      return !!this.clipboardChanged
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

      let collectionItem = {
        ...item,
      }
      collectionItem._id = 'clipboard:collection:' + Date.now()
      collectionItem.createTime = Date.now()
      collectionItem.updateTime = Date.now()
      delete collectionItem._rev
      console.log('插入的', collectionItem)

      let rs = await tsbApi.db.put(collectionItem)
      // if(rs.ok){
      //   this.collections.
      // }
      // console.log('插入结果',rs)
      // this.collections.unshift(item)

    },
    /**
     * 清空剪切板
     */
    async clean() {
      let items = await tsbApi.db.allDocs('clipboard:item:')
      for (const item of items.rows) {
        await tsbApi.db.remove(item.doc)
      }
      this.items = []
      this.totalRows = 0
      return true
    },
    /**
     * 当文字改变的时候的回调
     * @param text
     * @param beforeText
     */
    async textChange(text: string, beforeText: string) {
      await this.addItem({
        type: 'text',
        content: text,
      })
    },
    async videoChange(uri) {
      const stat = fs.statSync(uri)
      await this.addItem({
        type: 'video',
        filepath: uri,
        content: '',
        ext: require('path').extname(uri),
        size: stat.size,
        searchKey:uri
      })
    },
    /**
     * 插入一个剪切板内容
     * @param itemInfo
     */
    async addItem(itemInfo) {
      const now = Date.now()
      this.index++
      const _id = "clipboard:item:" + now
      let item: any = {
        _id,
        updateTime: now,
        createTime: now,
        index: this.index,
        ...itemInfo
      }
      let rs = await tsbApi.db.put(item)
      if (rs.ok) {
        this.totalRows++
        item._rev = rs.rev
        //筛选同类且在item上
        if ((this.filterType === item.type || this.filterType === 'all') && this.tab.name === 'history') {
          this.items.unshift(item)
        }
      }
      this.removeExpiredItems()//执行清理
    },
    async uriChange(uri) {
      console.log('uri=', uri)
      if (uri.length === 1) {
        //是单个视频
        let filepath = uri[0]
        let fileExt = require('path').extname(filepath).substring(1)
        if (['mp4', 'mpg', 'rmvb'].indexOf(fileExt) > -1) {
          await this.videoChange(filepath)
          return
        }
        if (['png', 'bmp', 'jpg', 'jpeg'].indexOf(fileExt) > -1) {
          await this.imageChange(filepath)
          return
        }
        if (['wav', 'aiff', 'pcm', 'flac', 'alac', 'mp3', 'ogg', 'aac', 'wma'].indexOf(fileExt) > -1) {
          await this.audioChange(filepath)
          return
        }
      }
      await this.addItem({
        type: 'file',
        content: '',
        count: uri.length,
        files: uri,
        searchKey:uri.join(',')
      })
    },
    async audioChange(audio) {
      const stat = fs.statSync(audio)
      await this.addItem({
        type: 'audio',
        filepath: audio,
        content: '',
        ext: require('path').extname(audio),
        size: stat.size,
        searchKey:audio
      })
    },
    async imageChange(image: any) {
      let filepath = ''
      const now = Date.now()
      if (typeof image === 'string') {
        //是文件，而非图片
        filepath = image
      } else {
        //是图片，而非文件
        //转存图片
        let dataPath = window.globalArgs['user-data-dir']
        const dir = require('path').join(dataPath, 'clipboard')
        fs.ensureDirSync(dir)
        const path = require('path').join(dir, 'image_' + now + '.png')
        filepath = path
        fs.writeFileSync(filepath, image.toPNG())
      }

      try {
        const stat = fs.statSync(filepath)
        await this.addItem({
          type: 'image',
          content: '',
          size: stat.size,
          ext: '.png',
          filename: 'image_' + now + '.png',
          path: filepath,
          filepath:filepath,
          searchKey:filepath,
        })
      } catch (e) {
        console.error('图片写入失败', e)
      }
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
      paths: ['settings', 'items', 'totalRows', 'index']
      // state 中的字段名，按组打包储存
    }]
  }
})
