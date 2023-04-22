import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import {sendRequest} from '../js/axios/api'

// @ts-ignore
export const steamStore = defineStore("steam", {
  state: () => ({
    steamCC:{id:"cc",name:'国区'},
    gameData:[],
  }),
  actions: {
    setGameData(value: any){
      const dataArr:Array<any> = []
      dataArr.push(value)
      this.gameData = dataArr
      localStorage.setItem('gameData',JSON.stringify(this.gameData))
    },
    // getGameData(){
    //   // const getData = localStorage.getItem('gameData')
    //   // this.gameData = JSON.parse(getData)
    // }
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
