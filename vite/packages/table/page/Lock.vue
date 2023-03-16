<template>
  <div id="displayMiddle" @click.prevent="enter" class="pointer"  style="margin-top: -6em;min-height: 15em">
    <div v-if="settings.showTime && loaded" class="time" style="" >
      <span style="font-size: 3.5em">{{ hours }}:{{ minutes }}</span>
     <div style="margin-top: -0.5em"> {{ year }}年{{ month }}月{{ day }}日 {{ week }}</div>
    </div>
    <div id="tip" style="color: white;font-size: 20px;margin-top: 2em" >
      <Icon  icon="jiesuo" style="font-size: 30px;vertical-align: text-top"></Icon>点击屏幕中间解锁
    </div>

  </div>
  <div class=" card half count-downtime" v-if="countDowntime.hours">
    <div class="left-time"> <Icon
      style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
      icon="zanting"
      @click="closeCountDown" v-show="!countDownBtn"
    ></Icon>
      <Icon
        style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
        icon="bofang"
        @click="startCountDown" v-show="countDownBtn"
      ></Icon>
      <Icon
        style="width: 2em; height: 2em;cursor:pointer"
        icon="guanbi1"
        @click="deleteCountDown"
      ></Icon></div>
    <div class="right-time">
      <span style="color: #FBAE17;text-align: center; font-size: 1.5em;margin-right: 1em">计时</span>
      <span style="color: #FBAE17;font-size: 4em;font-weight:bolder"> {{countDowntime.hours+":" +countDowntime.minutes+":"+countDowntime.seconds}}</span>
    </div>

  </div>
</template>

<script>
import Spotlight from 'spotlight.js'
import {appStore, countDownStore} from '../store'
import {mapActions, mapState, mapWritableState} from 'pinia'
import { message } from 'ant-design-vue'
import { paperStore } from '../store/paper'
export default {
  name: 'Lock',
  data () {
    return {
      loaded: false,
      year: 0,
      month: 0,
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      week: '',
      timer: null,
      date: '2023年2月11日 周四',
      time: ' 14:51 ',
      wallPaper: 'https://ts1.cn.mm.bing.net/th/id/R-C.653b2eb4ae081875675c6d25a69834b0?rik=p%2fCn01vlMrCUxQ&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1208%2f02%2fc0%2f12659156_1343874598199.jpg&ehk=d8OPA9%2bWy7YX9FLF95st3Rmd8lG6XtopCz0uNZAbebs%3d&risl=&pid=ImgRaw&r=0'
    }
  },
  mounted () {
    this.$nextTick(()=>{
      $('#displayMiddle').css('top','calc(50vh - '+$('#displayMiddle').height()/2+'px)')
    })
    $('#displayMiddle').fadeIn(1000)
    setTimeout(()=>{
      $('#tip').fadeOut(1000)
    },3000)
    if(this.settings.playType==='my'){
      this.playAll()
    }else{
      this.playActive()
    }
    this.tick()
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.tick()
      }, 1000)
    }
  },
  beforeUnmount () {
    clearInterval(this.timer)
  },
  computed:{
    ...mapState(paperStore,['myPapers','settings','activePapers']),
    ...mapWritableState(countDownStore, ["countDowndate","countDowntime","countDownBtn"]),
  },
  methods: {
    ...mapActions(countDownStore,["setCountDown","stopCountDown","openCountDown","dCountDown"]),
    enterGallery(){
      window.Spotlight.close()
      this.$router.replace({
         path:'/gallery'
      })
    },
    tick () {
      let weeks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      var date = new Date()
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1
      this.day = date.getDate()
      this.hours = date.getHours()

      this.minutes = date.getMinutes()
      if (this.minutes < 10) {
        this.minutes = '0' + this.minutes
      }
      this.seconds = date.getSeconds()
      this.week = weeks[date.getDay() - 1]
      this.loaded = true
    },
    enter (closeSpot=true) {
      if(closeSpot)
        window.Spotlight.close()
      console.log('解锁')
      this.$router.go(-1)
    },
    playAll(){
      if(this.myPapers.length===0){
        this.$router.replace({
          name:'my'
        })
        message.error('请添加我的壁纸后重新锁屏。')
        return
      }
      window.Spotlight.show(this.myPapers, {
        control: 'autofit,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: this.settings.showProgress,
        title: false,
        onclose:()=>{this.enter(false)}
      })
    },
    playActive(){
      if(this.activePapers.length===0){
        this.$router.replace({
          name:'my'
        })
        message.error('请激活壁纸后重新使用激活壁纸模式。')
        return
      }
      window.Spotlight.show(this.activePapers, {
        control: 'autofit,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: this.settings.showProgress,
        title: false,
        onclose:()=>{this.enter(false)}
      })
    },
    closeCountDown(){
      this.stopCountDown();
    },
    startCountDown(){
      this.openCountDown();
    },
    deleteCountDown(){
      this.dCountDown()
    },
  }
}
</script>

<style lang="scss" scoped>
.time {
  font-size: 1.5em;
  color: white;
  text-shadow: 0 0 2em #000;
  text-align: center
}
#displayMiddle{
  display:none;position: fixed;left: calc(25%);
  width: 50%;
  text-align: center;
  z-index: 9999999;
  /*background: rgba(0, 0, 0, 0.3);*/
  padding: 1em;
  border-radius: 2em;
}
.count-downtime{
  display: flex;
  flex-direction: row;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  align-items: center;
  justify-content:space-between ;
  height: 15%;
  width: 30em;
  z-index: 99999999999999999;
  .left-time{
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .right-time{
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
