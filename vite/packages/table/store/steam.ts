import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sendRequest} from '../js/axios/api'
// @ts-ignore
export const steamStore = defineStore('steam', {
  state: () => ({
    gameData:[], 
    gameRegion:'cn', // 默认中国区
    detailData:{},
    updatedAt:null,
    updatedTypeAt :null
  }), 
  actions: {
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
    // 获取更新后的卡片标识参数
    updateLogoType(){
       const getLogoType = localStorage.getItem('gameRegion')
       const getUpdateAt = localStorage.getItem('updateGameData')
       if (getLogoType) {
        this.gameRegion = JSON.parse(getLogoType )
      }
      if (getUpdateAt) {
        this.updatedTypeAt = new Date(getUpdateAt)
      }
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

    // 根据地区设置保存当前地区参数
    saveRegion(value:any,id:number): void{
      this.gameRegion = {
        id,
        value
      }
      window.localStorage.setItem('gameRegion',JSON.stringify(this.gameRegion))
      this.updatedTypeAt = new Date()
      window.localStorage.setItem('updateGameDataType',this.updatedTypeAt.toISOString())
    },
    fetchData(){
      const fetchRegion = window.localStorage.getItem('gameRegion')
      if(fetchRegion){
        const parseRegion = JSON.parse(fetchRegion)
        sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${parseRegion.id}&l=${parseRegion.id}`,3).then(res=>{
          window.localStorage.setItem('gameData',JSON.stringify(res?.data.specials.items))
          // 更新时间戳
          this.updatedAt = new Date()
          window.localStorage.setItem('updateGameData',this.updatedAt.toISOString())
        })
      }
    },
    fetchDetail(id,regId){
      sendRequest(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=${regId}&l=${regId}`,3).then(res=>{
        const detailData = res?.data[id].data
        const detailShow = res?.data[id].success
        if(detailShow){
          window.localStorage.setItem('detailData',JSON.stringify(detailData))
        }
      })
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