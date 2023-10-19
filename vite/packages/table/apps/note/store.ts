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
    getNotes(){
      let tmpList = [] as any[]
      
      cardStore().desks.forEach((item:any) => {
        if (item.cards.length) {
          item.cards.forEach((tmp:any)=>{
            if (tmp.name == 'notes') {
              
              if (!tmp.customData.hasOwnProperty('title')) {
                tmp.customData.title = '桌面便签'
              }
              tmpList.push({
                ...tmp,
                deskName:item.name,
                desk:item
              })
            }
          })
        }
      });

      this.noteList = tmpList
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
