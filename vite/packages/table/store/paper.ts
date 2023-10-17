import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
const DEFAULT_PAPERS_SETTINGS = {
  enable: true,
  playType: 'my',
  showTime: true,
  showWeather: true,
  showProgress: true,
  usePassword: false,
  password: '',
  showUnreadMessage: true,
  lockTimeout: 1800,
  interval: 30,
  savePath: '',
  tipLock: true,//在状态栏提示多久锁屏
  wallSource:'picking', 
}
// @ts-ignore
export const paperStore = defineStore('paper', {
  state: () => ({
    myPapers: [],//我的壁纸收藏
    activePapers: [],//当前激活的壁纸
    playingPaper: null,//播放中的壁纸
    settings: DEFAULT_PAPERS_SETTINGS,



  }),
  actions:{
    /**
     * 重置全部壁纸设置
     */
    resetPapersSettings() {
      this.settings = DEFAULT_PAPERS_SETTINGS
    },
    /**
     * 添加到我的壁纸
     * @param image
     */
    addToMyPaper(image) {
      let found = this.myPapers.findIndex(img => {
        if (img.src === image.src)
          return true
      })
      if (found === -1) {
        this.myPapers.push(image)
      } else {
        return
      }
      // this.saveAppData('papers')
    },

    /***
     * 移除我的壁纸
     *
    */
    removeToMyPaper(image: { src: any; }){
      let found = this.myPapers.findIndex((img: { src: any; }) => {
        if (img.src === image.src )
        return true
      })
      if (found === -1) {
        this.myPapers.push(image)
      } else {
        this.myPapers.splice(found, 1)
      }
    },

    /**
     * 将壁纸添加到激活的壁纸
     * @param image
     */
    addToActive(image) {
      let found = this.activePapers.findIndex(img => {
        if (img.src === image.src)
          return true
      })
      if (found === -1) {
        this.activePapers.push(image)
      } else {
        this.activePapers.splice(found, 1)
      }
    },

    // 将本地数据存储在myPaper
    addToStaticPaper(image: any){
      let found = this.myPapers.findIndex(img=>{
        if(img.src === image.src) return true
      })
      if (found === -1) {
        this.myPapers.push(image)
      } else {
        return
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [{

      /**
       *  myPapers: [],//我的壁纸收藏
       *     activePapers: [],//当前激活的壁纸
       *     playingPaper: null,//播放中的壁纸
       *     settings: DEFAULT_PAPERS_SETTINGS,
       *
       *
       *     lockTimeout: 1800,//锁屏延迟，默认改为半小时
       */
      paths:['myPapers','activePapers','playingPaper','settings'],
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
