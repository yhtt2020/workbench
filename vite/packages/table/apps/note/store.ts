import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import cache from "../../components/card/hooks/cache";
// import { cardStore } from '../../../store/card';
import { cardStore } from '../../store/card';
import {mapActions, mapState,mapWritableState} from "pinia";
import { useToast } from "vue-toastification";
const toast = useToast()
// @ts-ignore
export const noteStore = defineStore("noteStore", {
  state: () => ({
    ...mapWritableState(cardStore, ['desks']),
    // 测试数据
    noteList:[
      // {
      //   customData:{
      //     title:'桌面',
      //     text:'今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕',
      //     time:'十分钟前',
      //     desk:'日常桌面',
      //     background:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      //   },
      //   id:"",
      // },
    ],
    // 主应用里当前选中
    selNote:-1,
    selNoteTitle:'',
    selNoteText:'',
    // 背景色
    noteBgColor:[
      "linear-gradient(-33deg, #545454 0%, #AC9555 1%, #A3625D 100%)",
      "linear-gradient(-53deg, #545454 0%, #ACA955 1%, #A3865D 100%)",
      "linear-gradient(-33deg, #545454 0%, #90AC55 1%, #5DA36D 100%)",
      "linear-gradient(-53deg, #545454 0%, #5564AC 1%, #7E5DA3 100%)",
      "linear-gradient(-64deg, #545454 0%, #55A2AC 1%, #5D7BA3 100%)",
      // "linear-gradient(-64deg, #545454 0%, #55A2AC 1%, #5D7BA3 100%)",
    ],
    // 创建修改卡片新数据
    templateObj :{
      background:"linear-gradient(-33deg, #545454 0%, #AC9555 1%, #A3625D 100%)",
      cardSize:"card",
      colors:'#fff',
      height:2,
      text:'',
      width:1,
      title:'桌面便签'
    },
    // 桌面信息
    deskList:[],
    // 选中桌面
    selIndex:-1,
    // 选中左侧便签 true 回收站
    isSelTab:false,
    searchValue:'',
  }),
  actions: {
    //初始化 从全部桌面读取便签
    async getNotes(){
      // 先从tsbApi取
      let tmpList = [] as any[]
      let getDb = await tsbApi.db.find({
        selector: { 
          notes:"notes",
          isDelete:this.isSelTab,
        },
      })
      this.deskList = cardStore().desks
      // console.log(this.deskList);
      
      // console.log(getDb.docs);
      
      if (getDb.docs.length) {
        tmpList = getDb.docs
        this.sortByTimestamp(tmpList)
        this.noteList = getDb.docs
      }else{
        
        // 判断是否是回收站
        if (!this.isSelTab) {
          this.deskList.forEach((item:any) => {
            if (item.cards.length) {
              item.cards.forEach((tmp:any)=>{
                if (tmp.name == 'notes') {
                  if (!tmp.customData.hasOwnProperty('title')) {
                    tmp.customData.title = '桌面便签'
                  }

                  // bug
                  delete tmp._$muuri_id


                  tmpList.push({
                    ...tmp,
                    deskName:item.name,
                    desk:item,
                    notes:'notes',
                    createTime:tmp.id,
                    _id:'note:' +  tmp.id.toString(),
                    isDelete:false,
                  })
                }
              })
            }
          });
        }
        // 根据时间进行排序
        this.sortByTimestamp(tmpList)
        this.noteList = tmpList
        await tsbApi.db.bulkDocs(tmpList)
      }
    },
    // 根据时间进行排序
    sortByTimestamp(obj) {
      obj.sort(function(a, b) {
        return b.id - a.id;
      });
    },
    //测试用 取出全部数据 
    async findAll(){
      console.log(await tsbApi.db.allDocs('note:'))
    },

    // 便签切换桌面
    async switchDesk(selNote, selIndex){
      let nowIndex = -1;
      this.deskList.forEach((item,index)=>{
        if (item.id ==this.noteList[selNote].desk.id) {
          nowIndex = index
        }
      })
      // 判断当前是否选中桌面
      if (selIndex>=0) {
        if (nowIndex<0) {
          let tmp = await this.findId(this.noteList[selNote]._id,this.isSelTab)
          await tsbApi.db.put({
            ...tmp[0],
            desk:this.deskList[selIndex],
            deskName:this.deskList[selIndex].name,
          })
          cardStore().addCard({...this.noteList[selNote]},this.deskList[selIndex])
          this.noteList[selNote].desk=this.deskList[selIndex]
          this.noteList[selNote].deskName=this.deskList[selIndex].name
        }else{
          // 先添加后删除
          cardStore().addCard({...this.noteList[selNote]},this.deskList[selIndex])
          cardStore().removeCard(this.noteList[selNote].id,this.deskList[nowIndex])
          let tmp = await this.findId(this.noteList[selNote]._id,false)      
          await tsbApi.db.put({
            ...tmp[0],
            desk:this.deskList[selIndex],
            deskName:this.deskList[selIndex].name,
          })
        }
      }
      this.getNotes()
    },
    // 改变卡片颜色
    async changeBg(bgColor){
      
      let now = new Date().getTime()
      let tmp = await this.findId(this.noteList[this.selNote]._id,this.isSelTab)
      await tsbApi.db.put({
        ...tmp[0],
        customData:{
          ...tmp[0].customData,
          background:bgColor,
          updateTime:now,
        }
      })
      this.findAll()
    },

    // 在应用里新建便签
    async addNote(){
      if (!this.isSelTab) {
        let now = new Date().getTime()
        let obj = {
          customData:{
            ...this.templateObj
          },
          id:now,
          notes:'notes',
          _id:'note:' + now,
          isDelete:false,
          createTime:now,
          updateTime:now,
          name:'notes',
          desk:[],
          deskName:'',
        }
        // 新建一个custom数据 存储到tsb 或者 本文件的存储中
        this.noteList.unshift(obj)
        await tsbApi.db.put(obj)
        this.getNotes()
      }
    },
    // 修改便签数据存储到数据库
    async saveNoteDb(oldval){
      let n = -1;
      oldval>=0?n=oldval:n=this.selNote
      let tmp = await this.findId(this.noteList[n]._id,this.isSelTab)
      let now = new Date().getTime()
      let rs= await tsbApi.db.put({
        ...tmp[0],
        customData:{
          ...tmp[0].customData,
          title:this.selNoteTitle,
          text:this.selNoteText,
          updateTime:now,
        }
      })
    },

    // 将便签移动到回收站
    async moveNote(){
      let n = 0
      this.deskList.forEach((item,index)=>{
        if (item.id == this.noteList[this.selNote].desk.id) {
          n = index
        }
      })
      cardStore().removeCard({...this.noteList[this.selNote]},this.deskList[n])
      let tmp = await this.findId(this.noteList[this.selNote]._id,false)
      let rs= await tsbApi.db.put({
        ...tmp[0],
        isDelete:true,
      })
      this.getNotes()
      this.selNote=-1
    },
    // 将回收站的数据还原到桌面中
    async returnCard(){
      let n = 0
      this.deskList.forEach((item,index)=>{
        if (item.id == this.noteList[this.selNote].desk.id) {
          n = index
        }
      })
      cardStore().addCard(
        this.noteList[this.selNote],this.deskList[n]
      )
      let tmp = await this.findId(this.noteList[this.selNote]._id,true)
      let rs= await tsbApi.db.put({
        ...tmp[0],
        isDelete:false,
      })
      this.getNotes()
      this.selNote=-1
    },
    // 测试 一键删除错误数据
    async deTest(){
      let tt = await tsbApi.db.allDocs('note:')
      for(let i = 0;i<tt.rows.length;i++){
        await tsbApi.db.remove(tt.rows[i].doc)
      }
    },
    // 彻底remove tsbApi中的数据 
    async deleteNote(){
      let getDb = await tsbApi.db.find({
        selector: { 
          notes:"notes",
          isDelete:this.isSelTab,
        },
      })
      await tsbApi.db.remove(getDb.docs[0])
    },
    // 根据_id搜索数据库中的对象
    async findId(id,isDelete){
      let getDb = await tsbApi.db.find({
        selector: { 
          // notes:"notes",
          _id: id,
          isDelete:isDelete,
        },
      })
      if (getDb.docs.length) {
        return getDb.docs
      }else{
        console.log('error');
        return 
      }
    },
    // 搜索
    async searchNote(searchValue){
      // 定义索引
      await tsbApi.db.createIndex({
        index: {
          fields: ['deskName','title','text','isDelete']
        }
      })
      let map: any = {
        _id: {
          $regex: new RegExp(`^note:`)
        },
      }
      map.isDelete = this.isSelTab
      if (searchValue) {
        //替换掉特殊字符，保证查询准确性
        function escapeSpecialChars(str) {
          // 定义需要转义的特殊字符
          const specialChars = /[.*+?^${}()|[\]\\]/g;
          // 使用正则表达式替换特殊字符
          return str.replace(specialChars, "\\$&");
        }
        const words=escapeSpecialChars(searchValue)
        map['$or'] = [
          {
            deskName: {
              $regex: new RegExp(`.*${words}.*`,'ig')
            },
          },
          {
            customData: {
              text:{
                $regex: new RegExp(`.*${words}.*`,'ig')
              }
            },
          },
          {
            customData: {
              title:{
                $regex: new RegExp(`.*${words}.*`,'ig')
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
        tmp.docs.forEach((item,index)=>{
          this.noteList.push(item)
        })
      }else{
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
      paths: []
      // state 中的字段名，按组打包储存
    }]
  }
})
