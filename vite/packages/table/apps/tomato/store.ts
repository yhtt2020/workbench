import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import cache from "../../components/card/hooks/cache";
// import { cardStore } from '../../../store/card';
import { cardStore } from '../../store/card';
import {mapActions, mapState,mapWritableState} from "pinia";
import { useToast } from "vue-toastification";
const toast = useToast()
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
    minutes: 25,
    seconds: 0,
    tick: 1000,
    // 当前是否运行
    running: false,
    // 当前是否暂停
    isPause:false,
    // 控制背景
    isColor:"#e5b047",
    // 开关
    isFlag:true,
    // 是否全屏
    isFullScreen:false,
    // 是否自动全屏
    isFull:false,
    // 是否显示在状态栏
    isState:true,
    isFullState:false,

    tomatoNum:0,
    tomatoList:[0,0,0,0,0,0,0],
    weekTime:'',
    maxTomato:0,
    customIndex:'',
    desk:'',
    customData:'',
  }),
  // getters:{},
  actions: {
    ...mapActions(cardStore, ['updateCustomData']),
    // 加载目前的番茄
    getTomatoNum(){
      let remainingTime = this.getMainingTime();
      if(cache.get('tomatoNum')){
        this.tomatoNum = cache.get('tomatoNum')
      }else{
        cache.set("tomatoNum",0,remainingTime)
        this.tomatoNum = 0
      }
      if(cache.get('tomatoList')){
        this.tomatoList = cache.get('tomatoList')
      }else{
        cache.set("tomatoList",[0,0,0,0,0,0,0],remainingTime + (6-new Date().getDay())*24*60*60*1000)
        this.tomatoList = [0,0,0,0,0,0,0]
      }
      this.countTime(this.tomatoList)
      this.max(this.tomatoList)
    },

    // 添加番茄
    addTomatoNum(){
      // 计算今日剩余时间
      let remainingTime = this.getMainingTime;
      this.tomatoNum++
      this.tomatoList[new Date().getDay()] = this.tomatoNum;
      // 这个数据今天会过期，用于保存今日番茄
      cache.set("tomatoNum",this.tomatoNum,remainingTime)
      cache.set("tomatoList",this.tomatoList,remainingTime + (6-new Date().getDay())*24*60*60*1000)
      this.countTime(this.tomatoList)
      this.max(this.tomatoList)
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
      // this.isColor ="#e5b047";
      this.isColor ="#E7763E";
    },
    // 结束
    onStop(){
      this.isPause = true
      this.running = false;
      this.clearInterval()
      this.reset(0, 25, 0)
      this.isColor ="#e5b047";
      this.isFullState=false;
      // this.isColor ="#E7763E";
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
      this.reset(0,25,0)
      this.addTomatoNum()
      this.isColor ="#e5b047";
      toast.success("番茄任务完成");
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
    },
    // 计算本周番茄时间
    countTime(list){
      let total = 0;
      for(let i =0;i<list.length;i++){
          total += list[i]
      }
      let totalTime = total*25;
      let hour = totalTime / 60
      let min = totalTime % 60
      this.weekTime =  Math.trunc(hour) + 'h' + min + 'm'
    },
    // 获取本周最大番茄数
    max(list){
      let max = list[0];
      for (let i = 1; i < list.length; i++) {
          if(list[i] > max){
            max = list[i]
          }
      }
      this.maxTomato = max
    },

    //初始化状态
    init(customData,customIndex,desk){
      // 新创建时
      if (customData) {        
        if(customData.length){
          this.isFull = customData.isFull
          this.isState = customData.isState
          this.updateCustomData(customIndex,{
            isFull:this.isFull,
            isState:this.isState,
          },desk)
        }else{
          this.updateCustomData(customIndex,{
            isFull:false,
            isState:true,
          },desk)
        }
      }
    },
    onChange(customIndex,desk){
      this.updateCustomData(customIndex,{
        isFull:this.isFull,
        isState:this.isState,
      },desk)
    },
    // 计算今日剩余的时间戳
    getMainingTime(){
      // 计算今日剩余时间戳
      var now = new Date();
      var midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      var remainingTime = midnight.getTime() - now.getTime() +1;
      return remainingTime
    },
    // 切换顶部状态栏是否显示
    onChangeFull(){
      this.isFullState = !this.isFullState
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
