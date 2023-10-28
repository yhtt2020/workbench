import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import cache from "../../components/card/hooks/cache";
// import { cardStore } from '../../../store/card';
import { cardStore } from '../../store/card';
import {mapActions, mapState,mapWritableState} from "pinia";
import { useToast } from "vue-toastification";
import { v4 as uuidv4 } from 'uuid'
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
      "#57BF60",
      "#815BD0",
      "#C8BF55",
      "#DE5D5D",
      "#5898CB",
      "#DE5DB2",
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
      //console.log('getDb');
      //console.log(getDb);
      
      this.deskList = cardStore().desks
      // //console.log(this.deskList);
      
      // //console.log(getDb.docs);
      
      if (getDb.docs.length) {
        //console.log('走上面');
        
        tmpList = getDb.docs
        this.sortByTimestamp(tmpList)
        this.noteList = getDb.docs
      }else{
        //console.log('走下面');
        
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
                  // let tt = tmp._$muuri_id
                  delete tmp._$muuri_id


                  tmpList.push({
                    ...tmp,
                    deskName:item.name,
                    desk:item,
                    notes:'notes',
                    createTime:tmp.id,
                    _id:'note:' +  tmp.id.toString(),
                    '$muuri_id': uuidv4(),
                    isDelete:false,
                  })
                }
              })
            }
          });
        }
        //console.log('tmpList');
        //console.log(tmpList);
        
        // 根据时间进行排序
        this.sortByTimestamp(tmpList)
        this.noteList = tmpList
        //console.log('this.noteList');
        //console.log(this.noteList);
        
        await tsbApi.db.bulkDocs(tmpList)
        
        //console.log('find');
        this.findAll()
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
      //console.log(await tsbApi.db.allDocs('note:'))
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
          cardStore().addCard({
            ...this.noteList[selNote],
            '$muuri_id': uuidv4(),
          },this.deskList[selIndex])
          cardStore().removeCard(this.noteList[selNote].id,this.deskList[nowIndex])
          let tmp = await this.findId(this.noteList[selNote]._id,false)      
          await tsbApi.db.put({
            ...tmp[0],
            desk:this.deskList[selIndex],
            deskName:this.deskList[selIndex].name,
          })
        }
      }
      await this.getNotes()
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
    // 改变桌面卡片颜色
    // async
    // 修改卡片内容
    async saveDeskNote(id,value){
      let now = new Date().getTime()
      let tmp = await this.findId('note:'+id,false)
      //console.log('tmp',tmp);
      

      if (tmp) {
        await tsbApi.db.put({
          ...tmp[0],
          customData:{
            ...tmp[0].customData,
            updateTime:now,
            text:value,
          }
        })
      }
      this.getNotes()
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
          '$muuri_id': uuidv4(),
          isDelete:false,
          createTime:now,
          updateTime:now,
          name:'notes',
          desk:[],
          deskName:'',
        }
        // 新建一个custom数据 存储到tsb 或者 本文件的存储中
        this.noteList.push(obj)
        await tsbApi.db.put(obj)
        this.getNotes()
      }
    },
    // 修改便签数据存储到数据库
    async saveNoteDb(oldval){
      let n = -1;
      oldval>=0?n=oldval:n=this.selNote
      let tmp = [{}]
      tmp =  await this.findId(this.noteList[n]._id,this.isSelTab)
      //console.log('tmp');
      //console.log(tmp);
      
      if(tmp){
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
      }
    },

    // 将便签移动到回收站 删除
    async moveNote(){
      let n = 0
      this.deskList.forEach((item,index)=>{
        if (item.id == this.noteList[this.selNote].desk.id) {
          n = index
        }
      })
      cardStore().removeCard({...this.noteList[this.selNote]},this.deskList[n])
      let tmp =[{}]
      //console.log(this.noteList,this.selNote);
      
      tmp = await this.findId(this.noteList[this.selNote]._id,false)
      //console.log(tmp);
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
      // //console.log('cedilla删除');
      
      // //console.log(this.noteList[this.selNote]);

      await tsbApi.db.remove(this.noteList[this.selNote])
      this.getNotes()
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
        //console.log('error');
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
