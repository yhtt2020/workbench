import {defineStore} from "pinia";
const DEFAULT_PAPERS_SETTINGS = {
  enable: true,
  playType: 'my',
  showTime: true,
  showWeather: true,
  showProgress: true,
  usePassword: false,
  password: '',
  showUnreadMessage: true,
  lockTimeout: 180,
  interval: 3,
  savePath: '',
  tipLock: true//在状态栏提示多久锁屏
}
// @ts-ignore
export const paperStore = defineStore('paper', {
  state: () => ({
    myPapers: [],//我的壁纸收藏
    activePapers: [],//当前激活的壁纸
    playingPaper: null,//播放中的壁纸
    settings: DEFAULT_PAPERS_SETTINGS,
    tipLock: true,//在状态栏提示还有多久进入锁屏
    lockTimeout: 300
  }),
  actions:{
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
        this.myPapers.splice(found, 1)
      }
      // this.saveAppData('papers')
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
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: localStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
