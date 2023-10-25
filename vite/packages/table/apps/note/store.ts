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
      {
        customData:{
          title:'今日事今日毕',
          content:'今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕',
          time:'十分钟前',
          desk:'日常桌面',
          background:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
        },
        id:"",
        
      },
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

    
  }),
  // getters:{},
  actions: {
    // 卡片添加
    // card.addCard(
    //   {
    //     name: "notes",
    //     id: Date.now() + 1,
    //     customData: {...this.templateObj},
    //   },desk
    // ),
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
      tmpList = getDb.docs
      this.deskList = cardStore().desks

      // 需要进行判断 如果用户已经初始化了

      if (getDb.docs.length) {
        // console.log('有数据了，不用初始化');
        this.noteList = getDb.docs
      }else{
        // console.log('没数据，需要初始化');
        if (!this.isSelTab) {
          this.deskList.forEach((item:any) => {
            if (item.cards.length) {
              item.cards.forEach((tmp:any)=>{
                if (tmp.name == 'notes') {
                  if (!tmp.customData.hasOwnProperty('title')) {
                    tmp.customData.title = '桌面便签'
                  }
                  // 这个属性会卡住存储
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
        // console.log('排序好的');
        // console.log(tmpList);
        await tsbApi.db.bulkDocs(tmpList)
      }


      

    },
    // 根据时间进行排序
    sortByTimestamp(obj) {
      obj.sort(function(a, b) {
        return b.id - a.id;
      });
    },

    // 测试tsbApi
    // async test(){
    //   // 测试添加删除桌面便签
    //   // 先获取desk
    //   // console.log('出发了')
    //   // 测试添加成功
    //   let getDb = await tsbApi.db.find({
    //     selector: { 
    //       notes:"notes"
    //     },
    //   })
    //   // console.log(getDb);
    //   // tsbApi.db.remove(getDb.docs[0])
      
    //   getDb = await tsbApi.db.find({
    //     selector: { 
    //       notes:"notes"
    //     },
    //   })
    // },

    async findAll(){
      // console.log(await tsbApi.db.allDocs('note:'))
      // console.log('全部数据');
      // console.log(getDb);
    },

    // 便签切换桌面
    async switchDesk(selNote, selIndex){
      let nowIndex = 0;
      this.deskList.forEach((item,index)=>{
        if (item.id ==this.noteList[selNote].desk.id) {
          nowIndex = index
        }
      })
      //先添加后删除
      // console.log(this.noteList[selNote].id,this.deskList[nowIndex]);
      
      cardStore().addCard({...this.noteList[selNote]},this.deskList[selIndex])
      cardStore().removeCard(this.noteList[selNote].id,this.deskList[nowIndex])
      let tmp = await this.findId(this.noteList[selNote]._id,false)      
      await tsbApi.db.put({
        ...tmp[0],
        desk:this.deskList[selIndex],
        deskName:this.deskList[selIndex].name,
        
      })
      this.getNotes()
    },

    // 在应用里新建便签
    addNote(){
      // 新建一个custom数据 存储到tsb 或者 本文件的存储中


    },
    // 新建便签添加到桌面
    addNoteToDesk(){
      // 将新建的文件取出 通过add方法新建卡片到桌面

    },


    // 将便签移动到回收站
    async moveNote(){
      // console.log(this.noteList);
      
      // console.log( this.noteList[this.selNote].id);
      
      // console.log(this.deskList);
      // console.log(this.selIndex);

      let n = 0
      this.deskList.forEach((item,index)=>{
        if (item.id == this.noteList[this.selNote].desk.id) {
          n = index
        }
      })
      
      // console.log(this.deskList[n]);
      
      cardStore().removeCard(
        this.noteList[this.selNote].id,this.deskList[n]
      )
      let tmp = await this.findId(this.noteList[this.selNote]._id,false)
      let rs= await tsbApi.db.put({
        ...tmp[0],
        isDelete:true,
      })
      this.getNotes()
      this.selNote=-1

    },
    // 将回收站的数据还原到桌面中



    // 测试 一键删除错误数据
    async deTest(){
      // console.log(this.deskList);
      
      let tt = await tsbApi.db.allDocs('note:')
      // console.log(tt);
      for(let i = 0;i<tt.rows.length;i++){
        await tsbApi.db.remove(tt.rows[i].doc)
      }
    },

    async deleteNote(){
      // 彻底remove tsbApi中的数据
      // console.log('触发删除');
      let getDb = await tsbApi.db.find({
        selector: { 
          notes:"notes",
          isDelete:this.isSelTab,
        },
      })
      // console.log(getDb);
      
      await tsbApi.db.remove(getDb.docs[0])
    },

    // 搜索
    searchNotes(){
      // 通过tsbApi方法进行搜索 需要进行isDelete判断
    },
    // 测试删除数据
    deleteTest(){

    },

    // 根据_id搜索数据库中的对象
    async findId(id,isDelete){
      // console.log(id,isDelete);
      
      let getDb = await tsbApi.db.find({
        selector: { 
          // notes:"notes",
          _id: id,
          isDelete:isDelete,
        },
      })
      
      // console.log(getDb.docs);
      if (getDb.docs.length) {
        
        return getDb.docs
      }else{
        console.log('error');
        return 
      }
    }

  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['noteList']
      // state 中的字段名，按组打包储存
    }]
  }
})
