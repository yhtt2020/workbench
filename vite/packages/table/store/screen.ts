import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {isMain} from '../js/common/screenUtils'
import _ from "lodash-es";
import {subIPC,mainIPC} from '../js/common/screenIPC'
import {nanoid} from "nanoid";
import {appStore} from "../store";
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
    currentTip: 'zoom',
    taggingScreen:false,//标记屏幕
    screenDetail:{},//当前屏幕信息

    timerTag:0,
  })
  ,
  actions: {
    add(){
      let s={
        key: nanoid(6),
        title: '分屏',
        closable: true,
        settings:{
          autoRun:true
        },
        apps: {
          deck: false
        }
      }
      this.screens.push(s)
      return s
    },
    /**
     * 副屏专门绑定的IPC信息
     */
    bindSubIPC(){
      console.log('绑定副屏事件')
      subIPC.on('tagScreen',()=>{this.tagScreen()})
      subIPC.on('updateDetail',(event,args)=>{
        this.screenDetail=args.detail
      })
      subIPC.on('restore',()=>{
        window.restore()
      })
      subIPC.on('setScreen',(event,args)=>{
        console.log(args)
        appStore().exitFullScreen(false)
        tsbApi.window.setBounds({
          x:args.bounds.x,
          y:args.bounds.y,
          width:0,
          height:0
        })
        setTimeout(()=> {
          tsbApi.window.setBounds(args.bounds)
          console.log(args.bounds)
          tsbApi.window.focus()
          if (args.fullscreen) {
            appStore().enterFullScreen()
          }
        },500)

      })
    },

    /**
     * 主屏专门绑定的IPC
     */
    bindMainIPC(){
      console.log('绑定主屏事件')
      mainIPC.on('updateCapture',(event,args)=>{
        console.log(args,'获取到屏幕截图')
        this.getScreen(args.key).capture=args.image
        this.getScreen(args.key).running=true
      })
    },
    //运行在全部屏幕中
    tagScreen(){
      this.taggingScreen=true
      if(isMain()){
        //主窗口则发送到子窗口
        mainIPC.sendToSubs('tagScreen')
      }
      if(this.timer){
        clearTimeout(this.timerTag)
      }
      this.timer= setTimeout(()=>{
        this.taggingScreen=false
        clearTimeout(this.timerTag)
      },3000)
    },

    async onTableStarted(){
      this.runAutoRun()
    },
    runAutoRun(){
      this.screens.forEach(s=>{
        if(s.key!=='main'){
          if(s.settings.autoRun){
            this.startupScreen(s.key)
          }
        }
      })
    },

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
      ipc.send('startupScreen',{screen:screen})
    },
    /**
     * 关闭分屏
     * @param key
     */
    stopScreen(key){
      let screen=JSON.parse(JSON.stringify(this.getScreen(key)))
      ipc.send('stopScreen',{screen:screen})
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      storage: dbStorage,
    }]
  }

})
