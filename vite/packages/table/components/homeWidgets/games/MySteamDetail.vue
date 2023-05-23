<template>
  <div class="mt-3">
    <div class="flex justify-between" v-if="cpuShow === true">
      <div class="pr-4 flex flex-col relative" style="width:79.045%; border-right: 1px solid rgba(255,255,255,0.20);">
        <img class="rounded-lg" style="width: 100%;height: 100%; object-fit: cover;" :src="`https://cdn.cloud等等的点点滴滴flare.steamstatic.com/steam/apps/${steamDetail.appinfo.appid}/header.jpg`" alt="">
        <div class="in-run">正在运行</div>
        <span class="py-4">{{steamDetail.appinfo.common.name}}</span>
        <div class="flex">
          <div class="flex flex-col mr-28">
            <span class="show-time">最近游玩 : {{ getDateMyTime(steamDetail.time) }}</span>
            <span class="show-time">M站评分 : {{ steamDetail.appinfo.common.metacritic_score }}</span>
          </div>
          <div class="flex flex-col">
            <span class="show-time">过去两周 : {{ twoWeekTime(steamDetail.time) }}</span>
            <span class="show-time">总数 : {{ totalTime(steamDetail.time) }}</span>
          </div>
        </div>
        <div class="flex justify-between mt-2">
          <div @click="closeGame" class="flex items-center  detail-active s-item py-3 rounded-lg pointer px-15 justify-center">
            <Icon icon="tuichu" style="font-size: 1.2em;"></Icon>
            <span class="ml-2">关闭游戏</span>
          </div>
          <div @click="guidelineJump(steamDetail.appinfo.appid)" class="flex  py-3 s-item px-15 detail-active  rounded-lg pointer items-center justify-center">
            <Icon icon="trophy" style="font-size: 1.2em;"></Icon>
            <span class="ml-2">游戏攻略</span>
          </div>
        </div>
      </div>
      <div class="pl-4 flex flex-col" style="width:21%;">
        <div class="mb-8 flex s-item rounded-lg flex-col items-center justify-center" style="padding: 9px 6px 13px 5px;">
          <span class="flex items-center justify-center" style="width:100px;line-height: 53px;font-size: 30px;font-weight: 600;">
            {{  CPUGPUData.FPS.value }}
          </span>
          <span class="flex items-center">
            <Icon icon="game" class="mr-1" style="font-size:1.2em;"></Icon>
            FPS
          </span>
        </div>
        <div class="mb-7 flex s-item rounded-lg flex-col items-center justify-center " style="padding: 9px 6px 13px 5px;">
          <span class="flex items-center justify-center" style="width:100px;line-height: 53px;font-size: 30px;font-weight: 600;">
            {{  CPUGPUData.useCPU.value }}%
          </span>
          <span class="flex items-center">
            <Icon icon="lvzhou_cpu" class="mr-1" style="font-size:1.2em;"></Icon>
            CPU
          </span>
        </div>
        <div class="flex s-item rounded-lg flex-col items-center justify-center" style="padding: 9px 6px 13px 5px;">
          <span class="flex items-center justify-center" style="width:100px;line-height: 53px;font-size: 30px;font-weight: 600;">
            {{  CPUGPUData.useGPU.value }}
          </span>
          <span class="flex items-center">
            <Icon icon="xianqia" class="mr-1" style="font-size:1.2em;"></Icon>
            GPU
          </span>
        </div>
      </div>
    </div>
    <div class="mt-3 flex flex-col items-center relative" v-else>
      <div style="height: 118px;" class="mb-3.5">
        <img class="rounded-lg" style="width: 100%;height: 100%; object-fit: cover;" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamDetail.appinfo.appid}/header.jpg`" alt="">
      </div>
      <div class="m-in-run">正在运行</div>
      <span class="truncate mb-2.5" style="max-width: 180px;">{{steamDetail.appinfo.common.name}}</span>
      <span class="flex items-center mb-2.5 justify-center last-time">最近游玩 : {{getDateMyTime(steamDetail.time)}}</span>
      <span class="flex items-center mb-2.5 justify-center last-time">过去两周 : {{twoWeekTime(steamDetail.time)}}</span>
      <span class="flex items-center mb-2.5 justify-center last-time">总数 : {{twoWeekTime(steamDetail.time)}}</span>
      <div @click="guidelineJump(steamDetail.appinfo.appid)" class="flex mb-2 w-full py-3 s-item detail-active  rounded-lg pointer items-center justify-center">
        <Icon icon="trophy" style="font-size: 1.2em;"></Icon>
        <span class="ml-2">游戏攻略</span>
      </div>
      <div @click="closeGame" class="flex w-full items-center  detail-active s-item py-3 rounded-lg pointer justify-center">
        <Icon icon="tuichu" style="font-size: 1.2em;"></Icon>
        <span class="ml-2">关闭游戏</span>
      </div>

    </div>
  </div>
</template>

<script>
import {getDateTime} from '../.././../util'
import { mapWritableState } from 'pinia';
import {cardStore} from "../../../store/card";
export default {
  name:'MySteamDetail',
  props:{
    steamDetail:{
      type:Object,
      default:()=>{}
    },
    cpuShow:{
      type:Boolean,
      default:true
    }
  },
  data(){
    return{
      CPUGPUData:{
        useCPU:{value:0},
        useGPU:{value:0},
        useMemory:{value:0},
        FPS:{value:0},
        down:0,
        up:0
      },
    }
  },
  computed:{
    ...mapWritableState(cardStore,['aidaData']),
  },

  watch:{
    'aidaData':{
      handler(){
        let { useGPU, useMemory, useCPU, FPS, down, up} = this.aidaData || {}
        this.CPUGPUData = {
          useGPU:useGPU,
          useCPU:useCPU,
          useMemory:useMemory,
          FPS:FPS,
          down:down,
          up:up
        }
      },
      deep:true
    }
  },

  methods:{
    getDateMyTime(time){
      if(time){
        const timer = getDateTime(new Date(parseInt(time.rtime_last_played) * 1000))
        return time.rtime_last_played !==0 ? timer.month+ '月' + timer.day + '日':'0'
      }else{
        return 0
      }

    },
    twoWeekTime(time){
      return time? ( time.playtime_2weeks / 60 ).toFixed(1): 0
    },
    totalTime(time){
      return time? ( time.playtime_forever / 60 ).toFixed(1): 0
    },
    // 游戏攻略跳转
    guidelineJump(id){
      this.$router.push({name:'gameIntroduction',params:{id}})
    },
    // 关闭游戏
    closeGame(){
      this.$emit('closeDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
.show-time{
  font-size: 13px;
  color: rgba(255,255,255,0.60);
  font-weight: 400;
}
.px-15{
  padding-left: 4rem;
  padding-right: 3.25rem;
}
.detail-active{
  &:hover{
    opacity: 0.8;
  }
  &:active{
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }
}
.in-run{
  position: absolute;
  top: 10px;
  right: 25px;
  background: rgba(82,196,26,1);
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}
.m-in-run{
  position: absolute;
  top: 0;
  right: 8px;
  background: rgba(82,196,26,1);
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}
</style>
