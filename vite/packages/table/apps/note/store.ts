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
    // 桌面测试数据
    noteDesk:[
      {

      }
    ],

    
  }),
  // getters:{},
  actions: {

    //初始化 从全部桌面读取便签
    async getNotes(){
      // 先从tsbApi取
      let getDb = await tsbApi.db.find({
        selector: { 
          notes:"notes"
        },
      })

      // 需要进行判断 如果用户已经初始化了
      // 只需要去读取tsbApi的数据
      // 目前这部分还没加
      // if (getDb.docs.length) {
      // }
      this.noteList = getDb.docs
      console.log(this.noteList);
      let tmpList = [] as any[]
      cardStore().desks.forEach((item:any) => {
        if (item.cards.length) {
          item.cards.forEach((tmp:any)=>{
            if (tmp.name == 'notes') {
              if (!tmp.customData.hasOwnProperty('title')) {
                tmp.customData.title = '桌面便签'
              }
              // 不清楚，这个属性会卡住存储
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
      

      let rs = await tsbApi.db.bulkDocs(tmpList)
      if (rs.ok) {
        return rs.doc
      }

      // 根据时间进行排序
      this.sortByTimestamp(tmpList)
      this.noteList = tmpList
      

    },
    // 根据时间进行排序
    sortByTimestamp(obj) {
      obj.sort(function(a, b) {
        return b.id - a.id;
      });
    },

    // 测试tsbApi
    async test(){
      // console.log(this.noteList);
      // console.log('准备删除');
      
      
      // await tsbApi.db.remove(1697613776946)
      // await tsbApi.db.remove('1697613776946')
      // let tt = await tsbApi.db.allDocs("notes")  //查不出来
      // let tt = await tsbApi.db.allDocs("notes")
      let tt = await tsbApi.db.allDocs("1697693345942")   //能查出来
      // console.log('ceshi',tt); 
      
      await tsbApi.db.remove("  ")
      // console.log('删除结束，开始读取');
      // console.log();
      let getDb = await tsbApi.db.find({
        selector: { 
          notes:"notes"
        },
      })
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

    // this.updateCustomData(customIndex,{
    //   isFull:this.isFull,
    //   isState:this.isState,
    // },desk)


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
