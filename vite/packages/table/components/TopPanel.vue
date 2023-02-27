<template>
  <a-row   class="top-panel drag" type="flex" :gutter="10">
    <a-col :span="8"  >
      <div  class="pointer no-drag" @click="enterMusic" v-if="  status.music && status.music.title">
         <a-avatar style="margin-right: 0.5em" :size="24" :src="status.music.cover"></a-avatar> {{ status.music.title }} {{ status.music.singer }}
      </div>
    </a-col>
    <a-col  :span="8" style="text-align: center">
      <div @click="openGlobalSearch" class="input-box no-drag">
        <Icon icon="sousuo"></Icon> 搜索 网页内容、标签（下滑)
        <span style="float:right;padding-right: 10px">
          <span style="margin-right: 3px" class="key-button">Alt</span><span  class="key-button">F</span>
        </span>
      </div>
    </a-col>
    <a-col  :span="8" style="text-align: right">
     <span class="no-drag" v-if="!loading">{{ dateTime.month }}/{{ dateTime.day }} {{ dateTime.hours }}:{{ dateTime.minutes }} {{ dateTime.week }}

       <span v-if="hasWeather">
          <i style="" :class="'qi-'+city.weather.now.icon+'-fill'"></i> {{ city.weather.now.temp }}℃
       </span>


     </span>
    </a-col>
  </a-row>
</template>

<script >
import { getDateTime } from '../../../src/util/dateTime'
import { appStore } from '../store'
import {mapWritableState,mapState} from 'pinia'

export default {
  name: 'TopPanel',
  data(){
    return {
      loading:true,
      dateTime:{},
      timer:null,
    }
  },
  computed:{
    ...mapWritableState(appStore,['status']),
    ...mapState(appStore,['appData']),
    city () {
      return this.appData.weather.cities[0]
    },
    hasWeather(){
      return this.appData.weather.cities.length>0
    }
  },
  mounted () {
    this.getTime()
    this.loading=false
    if(!this.timer){
      setInterval(this.getTime,1000)
    }
  },
  methods:{
    openGlobalSearch(){
      ipc.send('openGlobalSearch')
    },
    getTime(){
      this.dateTime=getDateTime()
    },
    enterMusic(){
      this.$router.push({
        name:'music'
      })
    }
  }
}
</script>

<style scoped>
.top-panel{
  padding:.8em;

}
.input-box{
  height: 2em;
  border-radius: 100px;
  border: 1px solid #c4c4c4;
}
</style>
