import { defineStore } from "pinia";
import dbStorage from "./dbStorage";

// @ts-ignore
export const steamStore = defineStore("steam", {
  state: () => ({
    steamCC:{id:"cc",name:'国区'},
    data:[],
    dataDetail:{}, // 应用详情
  }),
  actions: {
    // 根据编码分类列表数据存储
    setGameData(value){
      const findIndex = this.data.findIndex(el=>{
        return el.cc === value.cc
      })
      if(findIndex === -1){
        this.data.push(value)
        localStorage.setItem("gameData",JSON.stringify(this.data))
      }else{
        return
      }
    },
    getGameData(){
      const getData = localStorage.getItem('gameData')
      if(getData){
        this.data = JSON.parse(getData)
      }
    },
    // 详情数据存储
    setGameDetail(value){
      this.dataDetail = value
      localStorage.setItem("detail",JSON.stringify(this.dataDetail)) 
    },
    getGameDetail(){
      const getDetail = localStorage.getItem("detail")
      if(getDetail){
        this.dataDetail = JSON.parse(getDetail)
      }
    }
  
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
