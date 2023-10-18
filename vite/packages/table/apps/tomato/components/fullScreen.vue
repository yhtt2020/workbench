<template>
    <teleport to="body">
      <img class="pop-container" :src="this.backgroundImage.path" alt="" />
      <div class="box">
        <div style="width: 100%;">
            <div class="title">番茄时间</div>
            <div class="time">{{ displayNum(minutes) }}:{{ displayNum(seconds) }}</div>
            <div class="title">今日番茄时间</div>
            <div class="tomato-box" >
              <Icon icon="fluent-emoji:tomato" class="ml-2 pointer" style="font-size: 40px;" v-for="index in this.tomatoNum" :key="index"/>
            </div>
        </div>
        <div class="icon-box"> 
          <!-- 重新开始 -->
          <div class="icon" v-if="!running" @click="onPlay">
            <Icon icon="fluent:play-16-filled" />
          </div>
          <!-- 开始 -->
          <div class="icon" v-else-if="running && !isPause" @click="onPause">
            <Icon icon="akar-icons:pause" />
          </div>
          <!-- 暂停 -->
          <div class="icon" v-else @click="onPause">
            <Icon icon="fluent:play-16-filled" />
          </div>
          <!-- 结束 -->
          <div class="icon" @click="onStop">
            <Icon icon="fluent:stop-16-filled" />
          </div>
          <!-- 退出全屏 -->
          <div class="icon" @click="exit()">
            <Icon icon="fluent:full-screen-minimize-16-filled" />
          </div>

        </div>
      </div>
    </teleport>
  </template>
  <script>
  import { tomatoStore } from '../store'
  import { appStore } from '../../../store'
  
  import { Icon } from '@iconify/vue';
  import {mapActions, mapState,mapWritableState} from "pinia";
  export default {
    components: {
        Icon,
    },
    props: {

    },
    watch: {

    },
    computed: {
      ...mapWritableState(tomatoStore, ['hours','minutes','seconds','isPause','running','tomatoNum','isPause']),
      ...mapState(appStore,['userInfo','backgroundImage'])
      
    },
    mounted() {

    },
    data() {
      return {
        optAction: false,
        autoTime: null,
        src: "",
        blurs: "blur(10px}",
        zoom: "100%",
      };
    },
    methods: {
      ...mapActions(tomatoStore, ['onPlay','onStop','onPause','onPlay','exit']),
      // exit(){
      //     this.$emit("exit");
      // },
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
  
  <style lang="scss" scoped>
  .pop-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    // 背景的模糊大小通过下面的属性值大小来调制
    // backdrop-filter: blur(5px);
    // -webkit-backdrop-filter: blur(5px);
    transform: scale(1.2);
  }
    .box {
      z-index: 99919;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    .title{
      font-family: PingFangSC-Regular;
      font-size: 24px;
      color: rgba(255,255,255,0.60);
      font-weight: 400;
      width: 100%;
      text-align: center;
    }
    .time{
      width: 100%;
      font-family: Oswald-SemiBold;
      font-size: 128px;
      color: rgba(255,255,255,0.85);
      text-align: center;
      font-weight: 600;
    }
    .icon-box{
      display: flex;
      justify-content: space-between;
      width: 300px;
    }
    .icon{
      width: 64px;
      height: 64px;
      background: rgba(0,0,0,0.30);
      border-radius: 35.2px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    
    .icon:hover{
      background: rgba(0,0,0,0.60);
    }

    .icon svg{
      font-size: 30px;
    }
    .tomato-box{
      margin-top: 20px;
      display: flex;
      width:100%;
      justify-content: center;
    }
    .tomato-box .tomato-icon{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0,0,0,0.60);
      line-height: 40px;
      margin-left: 20px;
      text-align: center;
    }

  // .bottom {
  //   position: absolute;
  //   bottom: 20px;
  //   left: 50%;
  //   transform: translateX(-50%);
  // }
  
  // .item-icon {
  //   z-index: 9999999999999;
  //   width: 100px;
  //   height: 56px;
  //   border-radius: 12px;
  //   background: rgba(0, 0, 0, 0.4);
  //   backdrop-filter: blur(20px);
  
  //   .icon {
  //     height: 36px;
  //     width: 36px;
  //   }
  // }
  </style>
  