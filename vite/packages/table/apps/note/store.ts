import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {cardStore} from '../../store/card';
import {mapActions, mapState, mapWritableState} from "pinia";
import {useToast} from "vue-toastification";
import { v4 as uuidv4 } from 'uuid'
const toast = useToast()
// @ts-ignore
export const noteStore = defineStore("noteStore", {
  state: () => ({
    ...mapWritableState(cardStore, ['desks']),
    // 记录用户是否进行过初始化
    initFlag: false,
    noteList: [],
    // 主应用里当前选中
    selNote: -1,
    // 暂存的标题和文本
    selNoteTitle: '',
    selNoteText: '',
    // 背景色
    noteBgColor: [
      "#57BF60",
      "#815BD0",
      "#C8BF55",
      "#DE5D5D",
      "#5898CB",
      "#DE5DB2",
    ],
    // 创建修改卡片的模板数据
    templateObj: {
      background: "#57BF60",
      cardSize: "card",
      colors: '#fff',
      height: 2,
      text: '',
      width: 1,
      title: '桌面便签',
      // content: '',
    },
    // 桌面信息
    deskList: [],
    // 选中桌面
    selIndex: -1,
    // 选中左侧便签 true 回收站
    isTrash: false,
    // 搜索
    searchValue: '',
    // 开关
    flag: true,
  }),
  actions: {
    //初始化 从全部桌面读取便签
    async getNotes() {
      // 先从tsbApi取
      let tmpList = [] as any[]
      this.deskList = cardStore().desks
      let getDb = await tsbApi.db.find({
        selector: {
          notes: "notes",
          isDelete: this.isTrash,
        },
      })
      // 回收站不需要进行检测
      if (!this.isTrash) {
        if (getDb.docs.length) {
          // 走检测机制
          let tmpArr = [] as any[]
          let deskArr = [] as any[]
          let dbArr = [] as any[]
          tmpList = getDb.docs
          tmpArr = tmpList.filter(i => {
            return i.deskName != ''
          })
          dbArr = tmpList.filter(i => {
            return i.deskName == ''
          })
          deskArr = this.searchCardForDesk()
          // 这边添加一个自检测机制 防止桌面卡片遗漏
          if (tmpArr.length != deskArr.length) {
            let tt = await tsbApi.db.allDocs('note:')
            for (let i = 0; i < tt.rows.length; i++) {
              await tsbApi.db.remove(tt.rows[i].doc)
            }
            deskArr.push(...dbArr)
            this.sortByTimestamp(deskArr)
            this.noteList = deskArr
            await tsbApi.db.bulkDocs(deskArr)
          } else {
            this.sortByTimestamp(tmpList)
            this.noteList = getDb.docs
          }
        } else {
          // 判断是否是回收站
          if (!this.isTrash) {
            tmpList = this.searchCardForDesk()
          }
          // 从桌面拿的初始化的数据需要进行排序
          this.sortByTimestamp(tmpList)
          this.noteList = tmpList
          tmpList.forEach(i => {
            delete i._rev
          });
          await tsbApi.db.bulkDocs(tmpList)
        }
      } else {
        this.sortByTimestamp(tmpList)
        this.noteList = getDb.docs
      }
      // 证明用户初始化过
      this.initFlag = true
    },

    // 从桌面找出所以便签卡片
    searchCardForDesk() {
      let tmpList = [] as any[]
      this.deskList.forEach((item: any) => {
        if (item.cards.length) {
          item.cards.forEach((tmp: any) => {
            if (tmp.name == 'notes') {
              if (!tmp.customData.hasOwnProperty('title')) {
                tmp.customData.title = '桌面便签'
              }
              delete tmp._$muuri_id
              delete tmp.$muuri_id
              delete tmp._rev
              tmpList.push({
                ...tmp,
                deskName: item.name,
                deskId: item.id,
                notes: 'notes',
                createTime: tmp.id,
                _id: 'note:' + tmp.id.toString(),
                isDelete: false,
              })
            }
          })
        }
      })
      return tmpList
    },
    // 根据时间进行排序
    sortByTimestamp(obj) {
      obj.sort(function (a, b) {
        return b.id - a.id;
      });
    },
    //测试用 取出全部数据
    async findAll() {
      console.log(await tsbApi.db.allDocs('note:'))
    },

    // 便签切换桌面
    async switchDesk(selNote, selIndex) {
      let nowIndex = -1;
      this.deskList.forEach((item, index) => {
        if (item.id == this.noteList[selNote].deskId) {
          nowIndex = index
        }
      })
      // 判断当前是否选中桌面
      if (selIndex >= 0) {
        //存在桌面 就进行删除
        if (nowIndex >= 0) {
          cardStore().removeCard(this.noteList[selNote].id, this.deskList[nowIndex], true)
        }
        cardStore().addCard({
          ...this.noteList[selNote],
          _$muuri_id:uuidv4()
        }, this.deskList[selIndex], true)
        let tmp = await this.findId(this.noteList[selNote]._id, this.isTrash)

        this.noteList[selNote].deskId = this.deskList[selIndex].id
        this.noteList[selNote].deskName = this.deskList[selIndex].name

        if (tmp.length) {
          await tsbApi.db.put({
            ...tmp[0],
            deskId: this.deskList[selIndex].id,
            deskName: this.deskList[selIndex].name,
          })
        }
      }
      this.getNotes()
    },
    // 改变卡片颜色
    async changeBg(bgColor) {
      let now = new Date().getTime()
      let tmp = await this.findId(this.noteList[this.selNote]._id, this.isTrash)
      if (tmp.length) {
        await tsbApi.db.put({
          ...tmp[0],
          customData: {
            ...tmp[0].customData,
            background: bgColor,
          },
          updateTime: now,
        })
      }
    },
    // 改变桌面卡片颜色
    async changeDeskBg(id, backgroundColor) {
      let now = new Date().getTime()
      let tmp = await this.findId('note:' + id, false)
      if (tmp) {
        await tsbApi.db.put({
          ...tmp[0],
          customData: {
            ...tmp[0].customData,
            background: backgroundColor,
          },
          updateTime: now,
        })

      }

    },

    /**
     * 保存版本历史
     * @param noteId
     * @param content
     */
    async saveHistory(noteId, content) {
      tsbApi.db.createIndex({
        index: {
          fields: ['noteId']
        }
      })
      console.log('写入历史版本',noteId,content)
      return await tsbApi.db.put({
        _id: 'note:history:' + Date.now(),
        noteId: noteId,
        createTime: Date.now(),
        content: content
      })
    },
    /**
     * 删除某个文档的全部历史记录
     * @param noteId
     */
    async removeHistory(noteId){
      let rs= await tsbApi.db.find({
       selector:{
         noteId:noteId
       }
      })
      if(rs.docs){
        for(const doc of rs.docs){
          await tsbApi.db.remove(doc)
        }
      }
    },
    // 修改主应用卡片内容
    async saveAppNote(id, value) {
      let now = new Date().getTime()
      let rs
      let tmp = await this.findId('note:' + id, false)
      if (tmp) {
        let note = {
          ...tmp[0],
          customData: {
            ...tmp[0].customData,
            text: value,
            // content: content
          },
          content: value,
          updateTime: now,
        }
        rs = await tsbApi.db.put(note)
        //记录版本
        await this.saveHistory(note._id, value)
      }
      // 遍历桌面卡片的时候会导致桌面卡片定位失效
      // 暂时解决办法 通过区分桌面便签和主应用便签
      // 分别设置方法进行存储
      // 期待后续优化
      this.getNotes()
      return rs.ok
    },

    // 修改桌面卡片内容
    async saveDeskNote(id, value) {
      let now = new Date().getTime()
      let tmp = await this.findId('note:' + id, false)
      if (tmp) {
        await tsbApi.db.put({
          ...tmp[0],
          customData: {
            ...tmp[0].customData,
            text: value,
            // content: content
          },
          content: value,
          updateTime: now,
        })
        //记录版本
        await this.saveHistory('note:' + id, value)
      }
    },

    // 在应用里新建便签
    async addNote() {
      if (this.flag) {
        this.flag = false
        if (!this.isTrash) {
          let now = new Date().getTime()
          let obj = {
            customData: {
              ...this.templateObj
            },
            id: now,
            notes: 'notes',
            content: '',
            _id: 'note:' + now,
            // '$muuri_id': uuidv4(),
            isDelete: false,
            createTime: now,
            updateTime: now,
            name: 'notes',
            deskId: '',
            deskName: '',
          }
          // 新建一个custom数据 存储到tsb 或者 本文件的存储中
          this.noteList.push(obj)
          await tsbApi.db.put(obj)
          this.getNotes()
          this.selNote = 0
          this.selNoteTitle = '桌面便签'
          this.searchValue = ''
          // this.selNote>=0?this.selNote++:''
        }
        this.flag = true
      }

    },
    // 修改便签数据存储到数据库
    async saveNoteDb(oldval) {
      let n = -1;
      oldval >= 0 ? n = oldval : n = this.selNote
      let tmp = []

      tmp = await this.findId(this.noteList[n]._id, this.isTrash)

      if (tmp) {
        let now = new Date().getTime()
        let rs = await tsbApi.db.put({
          ...tmp[0],
          customData: {
            ...tmp[0].customData,
            title: this.selNoteTitle,
          },
          content: tmp[0].customData.content,
          updateTime: now,
        })
        //记录版本
        await this.saveHistory(this.noteList[n]._id, tmp[0].customData.content)
      }
    },

    // 修改桌面便签标题
    async saveDeskTitle(id, value) {
      let tmp = [{}]

      tmp = await this.findId('note:' + id, false)
      if (tmp) {
        let now = new Date().getTime()
        await tsbApi.db.put({
          ...tmp[0],
          customData: {
            ...tmp[0].customData,
            title: value,
            updateTime: now,
          }
        })
      }
    },


    // 将便签移动到回收站 删除
    async moveToTrash() {
      let n = -1
      this.deskList.forEach((item, index) => {
        if (item.id == this.noteList[this.selNote].deskId) {
          n = index
        }
      })
      if (n >= 0) {
        cardStore().removeCard({...this.noteList[this.selNote]}, this.deskList[n], true)
      }
      let tmp = [{}]
      tmp = await this.findId(this.noteList[this.selNote]._id, false)
      if (tmp) {
        await tsbApi.db.put({
          ...tmp[0],
          isDelete: true,
          deskId:'',
          deskName:'',
        })
      }
      this.selNote = -1
      this.getNotes()
    },
    // 将回收站的数据还原到桌面中
    async restore() {
      let n = -1
      this.deskList.forEach((item, index) => {
        if (item.id == this.noteList[this.selNote].deskId) {
          n = index
        }
      })
      if (n >= 0) {
        cardStore().addCard({
            ...this.noteList[this.selNote], _$muuri_id:uuidv4()
          }
          ,this.deskList[n], true)
      }
      let tmp = await this.findId(this.noteList[this.selNote]._id, true)

      if (tmp) {
        await tsbApi.db.put({
          ...tmp[0],
          isDelete: false,
        })
      }

      this.selNote = -1
      this.getNotes()
    },
    // 测试 一键删除错误数据
    async dbClear() {
      let tt = await tsbApi.db.allDocs('note:')
      for (let i = 0; i < tt.rows.length; i++) {
        await tsbApi.db.remove(tt.rows[i].doc)
      }
    },


    // 彻底remove tsbApi中的数据
    async deleteNote(noteId) {
      if(!noteId){
       noteId=this.noteList[this.selNote]._id
      }
      let tmp = await this.findId(noteId, true)
      if (tmp) {
        await tsbApi.db.remove(tmp[0])
      }
      await this.removeHistory(noteId)
      this.selNote = -1
      this.getNotes()
    },
    // 根据_id搜索数据库中的对象
    async findId(id, isDelete) {
      let getDb = await tsbApi.db.find({
        selector: {
          _id: id,
          isDelete: isDelete,
        },
      })
      if (getDb.docs.length) {
        return getDb.docs
      } else {
        return false
      }
    },
    // 搜索
    async searchNote(searchValue) {
      // 定义索引
      await tsbApi.db.createIndex({
        index: {
          fields: ['deskName', 'title', 'text', 'isDelete']
        }
      })
      let map: any = {
        _id: {
          $regex: new RegExp(`^note:`)
        },
      }
      map.isDelete = this.isTrash
      if (searchValue) {
        //替换掉特殊字符，保证查询准确性
        function escapeSpecialChars(str) {
          // 定义需要转义的特殊字符
          const specialChars = /[.*+?^${}()|[\]\\]/g;
          // 使用正则表达式替换特殊字符
          return str.replace(specialChars, "\\$&");
        }

        const words = escapeSpecialChars(searchValue)
        map['$or'] = [
          {
            deskName: {
              $regex: new RegExp(`.*${words}.*`, 'ig')
            },
          },
          {
            customData: {
              text: {
                $regex: new RegExp(`.*${words}.*`, 'ig')
              }
            },
          },
          {
            customData: {
              title: {
                $regex: new RegExp(`.*${words}.*`, 'ig')
              }
            },
          },
        ]
        let tmp = await tsbApi.db.find({
          selector: map,
          sort: [
            {
              '_id': 'desc'
            }
          ]
        })
        this.noteList = []
        tmp.docs.forEach((item, index) => {
          this.noteList.push(item)
        })
      } else {
        this.getNotes();
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['initFlag']
      // state 中的字段名，按组打包储存
    }]
  }
})
