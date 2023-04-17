import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
// @ts-ignore
export const steamStore = defineStore('steam', {
  state: () => ({
    gameData:[], // 获取所有数据
    randomData:[], // 随机获取steam的优惠数据
    randomGameApp:[], // 随机获取app应用列表
  }), 
  actions: {
    saveGameData(){
      // 保存数据
      window.localStorage.setItem('gameData',JSON.stringify(this.gameData))
      // 更新时间戳
      this.updatedAt = new Date()
      window.localStorage.setItem('updateGameData',this.updatedAt.toISOString())
    },
    
    // 获取更新后数据
    loadGameData(){
      const saveData = localStorage.getItem('gameData')
      const savedUpdatedAt = localStorage.getItem('updateGameData')
      if (saveData) {
        this.gameData = JSON.parse(saveData)
      }
      if (savedUpdatedAt) {
        this.updatedAt = new Date(savedUpdatedAt)
      }
    },

    getGameOffers(value: any){
      this.gameData = value
      this.saveGameData()
    },

    // 判断数据是否超时
    isDataOutdated(){
      if(!this.updatedAt){
        return true
      }
      const now = new Date()
      const diffMs = now.getTime() - this.updatedAt.getTime() // 当前时间和更新时间的差
      const diffMins = diffMs / (1000 * 60)
      return diffMins > 10 // 时间差大于10分钟返回true，表示数据已过时
    },

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