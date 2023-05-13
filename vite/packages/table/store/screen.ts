import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {forEach} from "lodash";
import _ from "lodash-es";

const tips = {
  zoom: {
    status: true,
    content: '说明：缩放设置是每个分屏默认独立的。部分功能仅可在主屏使用。'
  },
  wallpaper: {
    status: true,
    content: '壁纸功能需要到达等级之后方可解锁全部功能。'
  }
}

declare interface position {
  x: number,
  y: number,
  width: number,
  height: number
}

declare interface Screen {
  title: string,
  key: string,
  closable: boolean,
  running: boolean,
  settings:object,
  domain:string,
  fullDomain:string,
  position?: position
}
const domainSuffix='table.com'

// @ts-ignore
export const screenStore = defineStore('screen', {
  state: () => ({
    screens: [{
      title: '主屏',
      key: 'main',
      closable: false,
      domain:'',
      fullDomain:'',
      settings:{},
      running: true
    }] as [Screen],
    tips: tips,
    currentTip: 'zoom'

  })
  ,
  actions: {

    getFullDomain(domain){
      if(!domain){
        return domainSuffix
      }
      if(domain){
        return domain +'.'+domainSuffix
      }
    },
    /**
     * 从可用的域名中取出一个
     */
    generateDomain(){
      let canUse=['1','2','3','4','5','6','7','8','9','10']
      //遍历一遍，取出数量
      let usedDomain=[]
      this.screens.forEach(s=>{
        if(s.domain && s.key!=='main'){
          usedDomain.push(s.domain)
        }
      })
      canUse=_.pull(canUse,...usedDomain)
      if(canUse.length>0){
        return canUse[0]
      }else{
        throw '已经无法分配域名'
      }


    },
    getScreen(key){
      let screen= this.screens.find(s=>{
        return s.key===key
      })
      if(!screen.settings){
        screen.settings={
          skipTaskbar:false
        }
      }
      if(!screen.domain && screen.key!=='main'){
        //非主屏，但是还没分配domain
        screen.domain= this.generateDomain()
      }
      screen.fullDomain=this.getFullDomain(screen.domain)
      return screen
    },
    getScreenIndex(key){
      return  this.scrrens.findIndex(s=>{
        return s.key===key
      })
    },
    reset() {
      this.screens = [{
        title: '主屏',
        key: 'main',
        closable: false,
      }]
    },
    resetTips() {
      this.tips = tips
    },
    /**
     * 启动分屏
     * @param key
     */
    startupScreen(key){
      let screen=JSON.parse(JSON.stringify(this.getScreen(key)))
      console.log('接收到指令启动分配',screen)
      ipc.send('startupScreen',{screen:screen})
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      storage: dbStorage,
    }]
  }

})
