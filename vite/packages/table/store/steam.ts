import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import {compareTime} from '../js/axios/api'

// @ts-ignore
export const steamStore = defineStore("steam", {
  state: () => ({
    steamCC:{id:"cc",name:'国区'},
    data:[],
    dataDetail:{}, // 应用详情
    weekList:[],
    nextWeekLits:[]
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
        const getGame = localStorage.getItem("gameData")
        if(getGame){
          this.data = JSON.parse(getGame)
        }
      }else{
        return
      }
    },
    // 详情数据存储
    setGameDetail(value){
      this.dataDetail = value
      localStorage.setItem("detail",JSON.stringify(this.dataDetail)) 
      const getDetail = localStorage.getItem("detail")
      if(getDetail){
        this.dataDetail = JSON.parse(getDetail)
      }
    },
    // 通过时间更新数据
    updateGameData(value){
       const updateIndex = this.data.find(el => {
          return compareTime(el.expiresDate) === compareTime(value.expiresDate)
       })
       if(updateIndex && updateIndex !== undefined){
        this.data.splice(this.data.indexOf(updateIndex),0,value)
        localStorage.setItem("gameData",JSON.stringify(this.data))
        const getGame = localStorage.getItem("gameData")
        if(getGame){
          this.data = JSON.parse(getGame)
        }
       }
    },
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
