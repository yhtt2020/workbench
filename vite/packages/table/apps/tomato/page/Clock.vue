<template>
  <Widget :options="{ ...this.options,background:this.isColor}" :customIndex="customIndex" :desk="desk" :showRightIcon="!this.$props.isTop" ref="clockSlot"   :menuList="menuList"  @delete='clearTime'>
        <div class="title" @click="test">番茄时间</div>
        <div class="time">{{ displayNum(minutes) }}:{{ displayNum(seconds) }}</div>
        <div class="title">今日番茄时间 {{ countToday(this.tomatoNum) }} </div>
        <div class="icon-box" style="color: rgba(255,255,255,0.85);">
          <!-- 开始 -->
          <div class="icon" v-if="running && isPause" @click="onPause">
            <Icon icon="fluent:play-16-filled" />
          </div>
          <!-- 暂停 -->
          <div class="icon" v-if="running && !isPause" @click="onPause">
            <Icon icon="akar-icons:pause" />
          </div>
          <!-- 结束 -->
          <div class="icon" v-if="running" @click="onStop">
            <Icon icon="fluent:stop-16-filled" />
          </div>
          <xt-button style="background: rgba(255,255,255,0.40);border-radius: 50px;" v-if="!running" @click="onPlay">
            <span>立即开始</span>
          </xt-button>
          <div class="icon" @click="this.onFullScreen">
            <!-- 全屏 -->
            <Icon icon="fluent:full-screen-maximize-16-filled" />
          </div>
        </div>
        <!-- 全屏 -->
        <FullScreen
          v-if="this.isFullScreen"
          @exit="this.isFullScreen = false"
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
                      <a-switch @change="onChange(this.customIndex,this.desk)"  v-model:checked="isFull" />
                    </div>
                  </div>
                  <div class="setting">
                    <div class="left-box">
                      <div class="set-title">显示在状态栏</div>
                      <div class="set-content">开始番茄时间后顶部在状态栏显示。</div>
                    </div>
                    <div class="right-box">
                      <a-switch @change="onChange(this.customIndex,this.desk)" v-model:checked="isState" />
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
  import { tomatoStore } from '../store'
  import FullScreen from "../components/fullScreen.vue";
  import { cardStore } from '../../../store/card'
  import XtButton from '../../../ui/libs/Button/index.vue'

  export default {
    name: "TimerClock",
    components:{
      XtButton,
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
      },
      isTop:{
        type: Boolean,
      }
    },
    data(){
      return {
        // 设置
        settingVisible:false,
        options:{
          className:'card small',
          title:'TimerClock',
          type:'timer',
          noTitle:true,
          background:"#E7763E",
          beforeDelete:true,
        },
        menuList: [
            {
                icon: 'shezhi1',
                title: '设置',
                fn: () => {
                    this.settingVisible = true;
                    this.$refs.clockSlot.visible = false
                }
            },
        ],
      }
    },
    mounted(){
      this.getTomatoNum();
      this.init(this.customData,this.customIndex,this.desk);
    },
    computed: {
      ...mapWritableState(tomatoStore, ['hours','minutes','seconds','running','isPause','isColor','isFullScreen','isFull','isState','tomatoNum']),
    },
    methods: {
      ...mapActions(tomatoStore, ['onPlay','onStop','onPause','onFullScreen','getTomatoNum','onChange','init']),
      ...mapActions(cardStore, ['updateCustomData']),
      // 删除 清除定时器
      clearTime() {
        this.onStop();
      },
      // 计算今日番茄时间
      countToday(num){
        let totalTime = num*25;
        let hour = totalTime / 60
        let min = totalTime % 60
        return Math.trunc(hour) + 'h' + min + 'm'
      },
      // 时间格式
      displayNum (num) {
        if (num < 10) {
          return '0' + num
        } else {
          return num
        }
      },
      test(){
        console.log(this.$props)
      }
    },
  };
  </script>

  <style scoped lang="scss">
    .title{

      font-size: 14px;
      color: rgba(255,255,255,0.60);
      font-weight: 400;
      text-align: center;
      letter-spacing: 1px;
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
      // background: #2A2A2A;
      background: var(--secondary-bg);
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
