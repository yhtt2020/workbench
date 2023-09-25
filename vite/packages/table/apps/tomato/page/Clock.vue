<template>
    <Widget :options="options" :customIndex="customIndex" :desk="desk"   :menuList="menuList">
        <div class="title">番茄时间</div>
        <div class="time">{{ displayNum(minutes) }}:{{ displayNum(seconds) }}</div>
        <div class="title">今日番茄时间1h</div>
        
        <div class="icon-box">
          <!-- 开始 -->
          <div class="icon" v-if="running" @click="onPause">
            <Icon icon="fluent:play-16-filled" />
          </div>
          <!-- 暂停 -->
          <div class="icon" v-if="running" @click="onPause">
            <Icon icon="fluent:play-16-filled" />1
          </div>
          <!-- 结束 -->
          <div class="icon" v-if="running" @click="onStop">
            <Icon icon="fluent:stop-16-filled" />
          </div>
          <div class="icon icon-font" v-if="!running" @click="onPlay">
            <span>立即开始</span>
          </div>
          <div class="icon" @click="onFullScreen">
            <!-- 全屏 -->
            <Icon icon="fluent:full-screen-maximize-16-filled" />
          </div>
        </div>

        <FullScreen
          v-if="isFullScreen"
          @exit="isFullScreen = false"

        >


        </FullScreen>
        
        <!-- 退出全屏 -->
        <!-- <div class="icon">
          <Icon icon="fluent:full-screen-minimize-16-filled" />
        </div> -->
        
      <!-- 设置面板 -->
      <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
            <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
                <div class="setting-box">
                  <div class="setting">
                    <div class="left-box">
                      <div class="set-title">自动全屏</div>
                      <div class="set-content">开始番茄时间后自动进入全屏模式。</div>
                    </div>
                    <div class="right-box">
                      <a-switch v-model:checked="isFull" />
                    </div>
                  </div>
                  <div class="setting">
                    <div class="left-box">
                      <div class="set-title">显示在状态栏</div>
                      <div class="set-content">开始番茄时间后顶部在状态栏显示。</div>
                    </div>
                    <div class="right-box">
                      <a-switch v-model:checked="isState" />
                    </div>
                  </div>
                </div>
          </vue-custom-scrollbar>
      </a-drawer>
    </Widget>
  </template>
  
  <script>
  import Widget from "../../../components/card/Widget.vue";
  import { Icon } from '@iconify/vue';
  import {mapActions, mapState} from "pinia";
  import FullScreen from "../components/fullScreen.vue";
  import { tomatoStore } from '../store'

  export default {
    name: "TimerClock",
    components:{
      Widget,
      Icon,
      FullScreen,
    },
    props: {
      customIndex: {
        type: Number,
        default: 0
      },
      customData: {
        type: Object,
        default: () => {}
      },
      desk: {
        type: Object,
      }
    },
    data(){
      return {
        // 是否全屏
        isFullScreen:false,
        // 设置
        settingVisible: false,
        isFull:false,
        isState:false,
        options:{
          className:'card small',
          title:'TimerClock',
          type:'timer',
          noTitle:true,
          background:"#E7763E",
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
        menuList: [
            {
                icon: 'shezhi1',
                title: '设置',
                fn: () => { 
                    this.settingVisible = true; 
                    this.$refs.dataSlot.visible = false 
                }
            },
        ],
      }
    },
    mounted(){
      this.getTomatoTimer()
    },
    methods: {
      ...mapActions(tomatoStore, ['getTomatoTimer','setTomatoTimer']),
      onPlay(){
        console.log("触发从头开始");

        this.running = true;
        this.options.background ="#E7763E";
        this.reset(0, 25, 0)
        this.timer = setInterval(this.interval, this.tick)
      },
      onStop(){
        console.log("触发停止番茄钟");
        
        this.running = false;
        this.options.background ="#e5b047";
        this.clearInterval()
        this.reset(0, 0, 0)
      },
      onPause () {
        // 
        console.log("触发开始/暂停");
        console.log(this)
        // console.log(this.tomatoTimer1())
        let dataTime = this.getTomatoTimer()
        console.log(dataTime)
        console.log(this.tomatoTimer1)
        this.setTomatoTimer("45")
        if (this.timer === null) {
          console.log("开始/暂停1");
          this.timer = setInterval(this.interval, this.tick)
        } else {
          console.log("开始/暂停2");
          this.clearInterval()
        }
      },
      finish () {
        // 
        console.log("时间到了");
        this.running=false
        this.clearInterval()
        this.reset()
        Modal.success({
          width: '50vw',
          content: '已成功完成一个番茄，点击收下。',
          okText: '收下',
          centered: true,
          onOk: () => {
            this.tomato++
          },
          cancelText:null
        })
      },
      onFullScreen(){
        this.isFullScreen = true;
      },
      // 定时器
      interval () {
        // 
        // console.log("触发定时器");
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
      displayNum (num) {
        if (num < 10) {
          return '0' + num
        } else {
          return num
        }
      },
      // 
      clearInterval () {
        // 
        console.log("触发停止定时器");
        clearInterval(this.timer)
        this.timer = null
      },
    },
    computed: {
      ...mapState(tomatoStore, ['getTomatoTimer']),
    },
  };
  </script>
  
  <style scoped lang="scss">
    .title{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(255,255,255,0.60);
      font-weight: 400;
      text-align: center;
    }
    .time{
      font-family: Oswald-SemiBold;
      font-size: 40px;
      color: rgba(255,255,255,0.85);
      text-align: center;
      font-weight: 600;
      margin: 8px 0 0 0;
    }

    .icon-box{
      display: flex;
      justify-content: space-between;
      padding: 0 38px;
      margin-top: 12px;

    }
    .icon{
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.40);
      border-radius: 26.4px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    
    .icon:hover{
      background: rgba(255,255,255,0.60);

    }

    .icon svg{
      font-size: 24px;
    }

    .icon-font{
      font-size: 16px;
      width: 120px;
    }

    .setting-box{
      background: #2A2A2A;
      border-radius: 12px;
      padding: 16px;
    }

    .setting:nth-of-type(1){
      border-bottom: 1px solid rgba(255,255,255,0.10);
    }
    .setting-box .setting{
      height: 68px;
      display: flex;
      justify-content: space-between;
    }
    .setting-box .left-box{
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .setting-box .right-box{
      display: flex;
      align-items: center;
    }

  </style>
  