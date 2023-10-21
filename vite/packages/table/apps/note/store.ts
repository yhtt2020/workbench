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
    // 选中左侧便签
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
      // console.log('从那里拿的');
      
      // console.log(getDb);
      tmpList = getDb.docs
      

      // 需要进行判断 如果用户已经初始化了

      // if (getDb.docs.length) {
      // }
      // this.noteList = getDb.docs
      // console.log(this.noteList);

      if (!this.isSelTab) {
        
        
        this.deskList = cardStore().desks
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
                  _id:tmp.id.toString(),
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
      // console.log('排序好的卡片顺序');
      // console.log(this.noteList);

      await tsbApi.db.bulkDocs(tmpList)

      
      
      

    },
    // 根据时间进行排序
    sortByTimestamp(obj) {
      obj.sort(function(a, b) {
        return b.id - a.id;
      });
    },

    // 测试tsbApi
    async test(){
      // 测试添加删除桌面便签
      // 先获取desk
      // console.log('出发了')
      // 测试添加成功
      let getDb = await tsbApi.db.find({
        selector: { 
          notes:"notes"
        },
      })
      // console.log(getDb);
      tsbApi.db.remove(getDb.docs[0])
      
      getDb = await tsbApi.db.find({
        selector: { 
          notes:"notes"
        },
      })
      // console.log(getDb);


      // await tsbApi.db.createIndex({
      //   index: {
      //     fields: ['isDelete']
      //   }
      // })






      // 切换桌面就是先添加后删除

      // console.log('开始添加');
      // 新建
      // cardStore().addCard(
      //   {
      //     name: "notes",
      //     id: Date.now(),
      //     customData: {...this.templateObj},
      //   },this.deskList[3]
      // )

      // console.log(this.noteList);
      // console.log('准备删除');
      
      
      // await tsbApi.db.remove(1697613776946)
      // await tsbApi.db.remove('1697613776946')
      // let tt = await tsbApi.db.allDocs("notes")  //查不出来
      // let tt = await tsbApi.db.allDocs("notes")
      // let tt = await tsbApi.db.allDocs("1697693345942")   //能查出来
      // console.log('ceshi',tt); 
      
      // await tsbApi.db.remove("  ")
      // console.log('删除结束，开始读取');
      // console.log();
      // let getDb = await tsbApi.db.find({
      //   selector: { 
      //     notes:"notes"
      //   },
      // })
      // console.log('读取结束');

      // console.log('getDb');
      
      
      // 
      // 测试 产尝试创建新索引
      // await tsbApi.db.createIndex({
      //   index: {
      //     fields: ['notes']
      //   }
      // })

      // console.log('触发了');

      // 测试 获取数据
      // let rs = await tsbApi.db.find({
      //   selector: { 
      //     notes:"notes"
      //   },
      //   sort: [
      //     {
      //       '_id': 'desc'
      //     }
      //   ]
      // })
      // console.log(rs);

      // 测试 删除数据
      

      // let rs = await tsbApi.db.put({
      //   notes:'123',
      //   _id:new Date().getTime().toString(),
      //   data:{
      //     a:1,
      //     b:2,
      //   }
      // })
      // if (rs.ok) {
      //   return rs.doc
      // }


      // console.log(tsbApi.db);
      // console.log(rs);
      
      // console.log(tsbApi.db.find({
      //   selector: map,
      //   limit: size,
      //   sort: [
      //     {
      //       '_id': 'desc'
      //     }
      //   ]
      // }));
      
    },

    // 便签切换桌面
    switchDesk(selNote, selIndex){
      let nowIndex = 0;
      this.deskList.forEach((item,index)=>{
        if (item.id ==this.noteList[selNote].desk.id) {
          nowIndex = index
        }
      })
      //先添加后删除
      cardStore().addCard(
        {...this.noteList[selNote]},this.deskList[selIndex]
      )
      
      cardStore().removeCard(
        this.noteList[selNote].id,this.deskList[nowIndex]
      )
      this.getNotes()
    },

    // 新建便签添加到桌面
    addNoteToDesk(){

    },

    // 在应用里新建便签
    addNote(){

    },

    // 将便签放进回收站
    deleteNote(){
      // console.log('触发删除');
      
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
