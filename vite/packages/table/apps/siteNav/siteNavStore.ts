import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";

export const siteNavStore = defineStore('siteNavStore', {
  state: () => ({
    mySites:[],
    isMy:false,
    showActionBar:true
  }),
  actions:{
    toggleMySite(item){
      console.log(this.mySites)
      let foundIndex=this.mySites.findIndex(li=>{
        return li.id===item.id
      })
      if(foundIndex>-1){
        //已经是了
        let sites=this.mySites.filter(li => {
          return li.id !== item.id
        })
        console.log(sites,'after')
        this.mySites=sites
        return false
      }else{
        this.mySites.unshift({
          id:item.id,
          alias:item.name,
          order:item.order,
        })
        return true
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      // paths: [
      //   'mySite'
      // ],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
}, {})
