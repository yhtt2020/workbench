<template>
  <a-row class="top-panel drag" type="flex" :gutter="10">
    <a-col :span="8">
      <div
        class="pointer no-drag text-more"
        style="display: inline-block"
        @click="enterMusic"
        v-if="status.music && status.music.title"
      >
        <a-avatar
          style="margin-right: 0.5em"
          :size="24"
          :src="status.music.cover"
        ></a-avatar>
        {{ status.music.title }} {{ status.music.singer }}
      </div>
    </a-col>
    <a-col :span="8" style="text-align: center">
      <div @click="openGlobalSearch" class="input-box no-drag pointer">
        <Icon icon="sousuo"></Icon> 搜索 网页内容、标签
<!--        <span style="float: right; padding-right: 10px">-->
<!--          <span style="margin-right: 3px" class="key-button">Alt</span-->
<!--          ><span class="key-button">F</span>-->
<!--        </span>-->
      </div>
    </a-col>
    <a-col :span="8" style="text-align: right" class="s-text">
      <span
        style="color: grey; font-size: 0.8em; margin-right: 1em"
        v-if="settings.tipLock && this.showLockTip"
      >
        {{ lockTimeoutDisplay }}后锁屏
      </span>
      <span class="no-drag" v-if="!loading"
        >{{ dateTime.month }}/{{ dateTime.day }} {{ dateTime.hours }}:{{
          dateTime.minutes
        }}
        {{ dateTime.week }}

       <span v-if="hasWeather && city.now">
          <i style="" :class="'qi-'+city.now.icon+'-fill'"></i> {{ city.now.temp }}℃
       </span>


     </span>
    </a-col>
  </a-row>
</template>

<script >
import { getDateTime } from '../../../src/util/dateTime'
import { appStore} from '../store'
import {cardStore} from '../store/card'
import {mapWritableState,mapState,mapActions} from 'pinia'
import { paperStore } from '../store/paper'
import { weatherStore } from '../store/weather'

export default {
  name: "TopPanel",
  data() {
    return {
      loading: true,
      dateTime: {},
      timer: null,
      lockTimer: null,
      showLockTip: false,
    };
  },
  computed:{
    ...mapWritableState(appStore,['status']),
    ...mapState(weatherStore,['cities']),
    ...mapWritableState(paperStore,['settings','lockTimeout']),
    lockTimeoutDisplay(){
      // if(this.lockTimeout>=60){
      //   return ((this.lockTimeout/60).toFixed(0)-1)+'分'+this.lockTimeout % 60+'秒'
      // }else{
      //   return this.lockTimeout+'秒'
      // }
      function secTotime(s) {
        var t = '';
        if(s > -1){
          var hour = Math.floor(s/3600)
          var min = Math.floor(s/60) % 60
          var sec = s % 60
          if(hour===0)
            t=''
            else
          if(hour < 10) {
            t = '0'+ hour + "小时"
          } else {
            t = hour + "小时"
          }
          if(min < 10){
            t += "0"
          }
          t += min + "分"
          if(sec < 10){
            t += "0"
          }
          t += sec.toFixed(0)+'秒'
        }
        return t
      }
      return secTotime(this.lockTimeout)
    },
    city () {
      if(this.cities[0]){
        return this.cities[0]
      }else{
        return {}
      }

    },
    hasWeather() {
      return this.cities.length > 0;
    },
  },
  mounted () {
    window.onblur=()=>{
      this.setLockTimer()
    }
    window.onfocus=()=>{
      this.clearLockTimer()
    }
    this.loading=false
    if(!this.timer){
      setInterval(this.getTime,1000)
    }
  },
  created() {
    this.getTime()
  },
  methods:{
    ...mapActions(cardStore,["setAppDate"]),
    clearLockTimer(){
      if(this.lockTimer){
        clearInterval(this.lockTimer)
        this.lockTimer=null
        this.lockTimeout=this.settings.lockTimeout
        this.showLockTip=false
      }
    },
    setLockTimer(){
      if(this.settings.enable){
        //只有启用了锁屏才会触发这个效果
        if(this.lockTimer){
          this.lockTimeout=(this.settings.lockTimeout || 300)-1
        }else{
          this.lockTimeout=(this.settings.lockTimeout || 300)-1
          this.showLockTip=true
          this.lockTimer=setInterval(()=>{
            this.lockTimeout--
            if(this.lockTimeout===0){
              this.clearLockTimer()
              this.$router.push('/lock')
            }
          },1000)
        }
      }
    },
    openGlobalSearch(){
      ipc.send('openGlobalSearch')
    },
    getTime() {
      this.dateTime = getDateTime();
      this.setAppDate(this.dateTime);
    },
    enterMusic() {
      this.$router.push({
        name: "music",
      });
    },
  },
};
</script>

<style scoped>
.top-panel {
  padding: 0.8em;
}
.input-box {
  height: 2em;
  border-radius: 100px;
  border: 1px solid #c4c4c4;
}
</style>
