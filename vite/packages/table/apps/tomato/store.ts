import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import cache from "../../components/card/hooks/cache";


// @ts-ignore
export const tomatoStore = defineStore("tomatoStore", {
  state: () => ({
    aggList:{
      type:'work'
    },
    totalTime: {
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    hours: 0,
    minutes: 0,
    seconds: 0,
    tick: 1000,
    // 当前是否运行
    running: false,
    // 当前是否暂停
    isPause:false,
    // 控制背景
    isColor:"#E7763E",
    // 开关
    isFlag:true,
    // 是否全屏
    isFullScreen:false,
    // 是否自动全屏
    isFull:false,
    // 是否显示在状态栏
    isState:false,
    tomatoNum:0,
  }),
  // getters:{},
  actions: {
    // 加载目前的番茄
    getTomatoNum(){
      this.tomatoNum = cache.get('tomatoNum');
      console.log('拿到了？')
    },
    // 添加番茄
    addTomatoNum(){
      this.tomatoNum++
      var now = new Date();
      var midnight = new Date();
      midnight.setHours(23, 59, 59, 999); // 设置时间为今天的最后一秒
      var remainingTime = midnight.getTime() - now.getTime(); // 计算剩余时间戳
      cache.set("tomatoNum",this.tomatoNum,remainingTime)
    },
    // 开始
    onPlay(){
      if (this.isFull) {
        this.isFullScreen = true
      }
      this.running = true;
      this.isPause = false
      this.reset(0, 25, 0)
      this.timer = setInterval(this.interval, this.tick)
      this.isColor ="#e5b047";
    },
    // 结束
    onStop(){
      this.isPause = true
      this.running = false;
      this.clearInterval()
      this.reset(0, 0, 0)
      this.isColor ="#E7763E";
    },
    // 暂停
    onPause () {
      // 这个数据
      if (this.isFlag) {
        this.isFlag = false
        if(this.running){
          if (this.timer === null) {
            this.timer = setInterval(this.interval, this.tick)
            this.isPause = false
          } else {
            this.isPause = true
            this.clearInterval()
          }
        }
        this.isFlag = true
      }
    },
    // 定时器结束
    finish () {
      this.running = false
      this.clearInterval()
      this.reset()
      this.addTomatoNum()
    },
    // 设置定时器
    interval () {
      if (!this.running) return
      if (this.seconds <= 0) {
        if (this.minutes === 0) {
          if (this.hours === 0) {
            this.finish()
          } else {
            this.hours--
            this.minutes = 59
          }
        } else {
          this.minutes--
        }
        if(!this.running){
          this.seconds=0
          return
        }
        this.seconds = 59
      } else {
        this.seconds--
      }
    },
    // 重置时间
    reset (hours = 0, minutes = 0, seconds = 0) {
      this.totalTime = {
        hours,
        minutes,
        seconds
      }
      this.hours = this.totalTime.hours
      this.minutes = this.totalTime.minutes
      this.seconds = this.totalTime.seconds
    },

    // 结束定时器
    clearInterval () {
      clearInterval(this.timer)
      this.timer = null
    },
    // 控制是否全屏
    onFullScreen(){
      this.isFullScreen = true;
    },
    // 退出全屏
    exit(){
      this.isFullScreen = false;
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: []
      // state 中的字段名，按组打包储存
    }]
  }
})
