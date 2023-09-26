import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";


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
    running: false,
    isPause:false,



  }),
  // 计算属性 可以去查阅ai
  // vite\packages\table\store\ai.ts
  // getters:{},
  actions: {

    // 开始
    onPlay(){
      console.log("触发从头开始");

      this.running = true;
      // this.options.background ="#E7763E";
      this.reset(0, 25, 0)
      this.timer = setInterval(this.interval, this.tick)
    },
    // 结束
    onStop(){
      console.log("触发停止番茄钟");
      this.running = false;
      // this.options.background ="#e5b047";
      this.clearInterval()
      this.reset(0, 0, 0)
    },
    // 暂停
    onPause () {
      // 这个数据
      console.log("触发开始/暂停");
      if (this.timer === null) {
        this.isPause = false
        this.timer = setInterval(this.interval, this.tick)
      } else {
        console.log("开始/暂停2");
        this.isPause = true
        this.clearInterval()
      }
    },
    // 定时器结束
    finish () {
      console.log("时间到了");
      this.running=false
      this.clearInterval()
      this.reset()
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
      console.log("触发重置");
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
      console.log("触发停止定时器");
      clearInterval(this.timer)
      this.timer = null
    },
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // 这里的字段会保存到全局 好像
      paths: []
      // state 中的字段名，按组打包储存
    }]
  }
})
