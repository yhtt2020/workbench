import {defineStore} from "pinia";
import dbStorage from "./dbStorage";

// @ts-ignore
export const browserStore = defineStore("browserStore", {
  state: () => ({
    runningTabs:[],
    currentTab:{}
  }),
  actions:{
    bindIPC(){
      ipc.on('updateRunningTableTabs',(event,args)=>{
          console.log(args)
        this.runningTabs=args.tabs
      })
      ipc.on('updateTabCapture',(event,args)=>{
        let tab=this.getTab(args.id)
        if(tab){
          tab.capture=args.image
        }
      })
      ipc.on('updateTabTitle',(event,args)=>{
        let tab=this.getTab(args.id)
        if(tab){
          tab.title=args.title
          if(this.currentTab && this.currentTab.id===args.id){
            this.currentTab=tab
          }
        }

      })
      ipc.on('updateTabFavicon',(event,args)=>{
        let tab=this.getTab(args.id)
        if(tab){
          tab.favicons=args.favicons
          if(this.currentTab && this.currentTab.id===args.id){
            this.currentTab=tab
          }
        }

      })
    },
    getTab(id){
      return this.runningTabs.find(tab=>{
        return tab.id===id
      })
    },
    updateTabCapture(id){
      ipc.send('updateTabCapture',{id:id})
    },

    updateAllCapture(){
      ipc.send('updateRunningTabsCapture')
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})


//updateRunningTableTabs
