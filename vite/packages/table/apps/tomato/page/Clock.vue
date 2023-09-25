<template>
    <Widget :options="options" :customIndex="customIndex" :desk="desk"   :menuList="menuList">
        <div class="title">番茄时间</div>
        <div class="time">{{ displayNum(minutes) }}:{{ displayNum(seconds) }}</div>
        <div class="title">今日番茄时间1h</div>

        <div class="icon-box">
          <!-- 开始 -->
          <div class="icon" v-if="running && isPause" @click="onPause">
            <Icon icon="fluent:play-16-filled" />
          </div>
          <!-- 暂停 -->
          <div class="icon" v-if="running && !isPause" @click="onPause">
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
        <!-- 全屏 -->
        <FullScreen
          v-if="isFullScreen"
          @exit="isFullScreen = false"
        >
        </FullScreen>
        

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
  import {mapActions, mapState,mapWritableState} from "pinia";
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
        // running: false,
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
      console.log(this);
    },
    computed: {
      ...mapWritableState(tomatoStore, ['hours','minutes','seconds','running','isPause']),
    },
    methods: {
      ...mapActions(tomatoStore, ['onPlay','onStop','onPause']),
      // 控制是否全屏
      onFullScreen(){
        this.isFullScreen = true;
      },
      // 时间格式
      displayNum (num) {
        if (num < 10) {
          return '0' + num
        } else {
          return num
        }
      },
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
  