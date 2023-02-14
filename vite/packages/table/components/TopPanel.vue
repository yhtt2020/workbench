<template>
  <a-row   class="top-panel drag" type="flex" :gutter="10">
    <a-col :span="8"  >
<!--      <Icon icon="#icon-xiaoxi"></Icon>-->
<!--      李想：来一下我办公室。 6分钟前-->
      &nbsp;
    </a-col>
    <a-col  :span="8" style="text-align: center">
      <div class="input-box no-drag">
        <Icon icon="#icon-sousuo"></Icon> 搜索 网页内容、标签
        <span style="float:right;padding-right: 10px">
          <span style="margin-right: 3px" class="key-button">Alt</span><span  class="key-button">F</span>
        </span>
      </div>
    </a-col>
    <a-col  :span="8" style="text-align: right">
     <span class="no-drag" v-if="!loading">{{ dateTime.year }}/{{ dateTime.month }}/{{ dateTime.day }} {{ dateTime.hours }}:{{ dateTime.minutes }} {{ dateTime.week }} 晴 9℃</span>
    </a-col>
  </a-row>
</template>

<script >
import { getDateTime } from '../../../src/util/dateTime'
export default {
  name: 'TopPanel',
  data(){
    return {
      loading:true,
      dateTime:{},
      weather:'晴 9℃',
      timer:null,
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
    getTime(){
      this.dateTime=getDateTime()
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
