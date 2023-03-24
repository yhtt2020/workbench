<template>
<SupervisorySlot :options="options">
  <div class="top-content">
    <div><span>{{CPUGPUData.SCPUUTI.value}}%</span>
      <span>
      <Icon icon="CPU" class="icon" ></Icon>CPU</span>
    </div>

    <div style="margin-left: 13px">
      <span>{{CPUGPUData.SGPU1UTI.value}}%</span>
      <span>
      <Icon icon="GPU" class="icon"></Icon>GPU</span></div>

    <div><span>{{CPUGPUData.SMEMUTI.value}}%</span>
      <span>
      <Icon icon="neicun" class="icon"></Icon>内存</span></div>

    <div style="margin-left: 13px"><span>{{CPUGPUData.SRTSSFPS.value}}</span>
      <span>
      <Icon icon="youxishoubing" class="icon"></Icon><span style="position: relative">FPS
        <a-tooltip v-if="CPUGPUData.SRTSSFPS.value==0">
    <template #title>需要游戏运行在前台且打开RTSS方可读取到</template>
    <Icon icon="tishi-xianxing" style="height: 10px;width: 10px;position: absolute;top: 0;right: -17px"></Icon>
  </a-tooltip></span>
       </span>
    </div>
    <div class="buttom" style="border-radius: 5px">
      <div>
        <div> <Icon icon="xiazai" class="icon" style="color: #5CBBFF;"></Icon>
          <span>下载</span></div>

        <span>{{lastDown}}</span>
      </div>

     <div>
       <div><Icon icon="shangchuan" class="icon" style="color: #52C41A;"></Icon>
         <span>上传</span></div>

       <span>{{lastUp}}</span>
     </div>
   </div>
  </div>
</SupervisorySlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
import {mapWritableState} from "pinia";
import {tableStore} from "../../../store";
import {filterObjKeys, netWorkDownUp} from "../../../util";
export default {
  name: "CPUFourCard",
  data(){
    return {
      options:{
        className:'card',
        title:'性能',
        icon:'gaoxingneng'
      },
      CPUGPUData:{
        SCPUUTI:{value:"-"},
        SGPU1UTI:{value:"-"},
        SMEMUTI:{value:"-"},
        SRTSSFPS:{value:"-"},
      },
      down:0,
      up:0
  }
  },
  components:{
    SupervisorySlot
  },
  computed:{
    ...mapWritableState(tableStore, ["aidaData"]),
    lastDown(){
      return this.down < 1000 ? this.down +'KB/S' : this.down<1024000?(this.down/1024).toFixed(2) + 'MB/S':(this.down/1024/1024).toFixed(2) + 'GB/S'
    },
    lastUp(){
      return this.up < 1000 ? this.up +'KB/S' : this.up<1024000?(this.up/1024).toFixed(2) + 'MB/S':(this.up/1024/1024).toFixed(2) + 'GB/S'
    }
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
        filterObjKeys(this.CPUGPUData,this.aidaData)
        const {down,up} =  netWorkDownUp(this.aidaData)
        this.down = down
        this.up = up
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.top-content{
  display: flex;
  flex-wrap: wrap;
  height: 95%;
  width: 100%;
  align-items: center;
  margin-top: -8px;

  >div{
    width: calc((100% - 13px) / 2);
    margin-top: 13px;
    height: 120.5px;
    background: #2B2B2B;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5%;
    >span{
      display: flex;
      align-items: center;
    }
    >span:first-child{
      font-size: 2.5em;
      font-weight: 700;

    }
  }
  >div:last-child{
    height: 90px;
    width: 100%;



  }
  .icon{
       width: 18px;
       height:18px;
  margin-right: .5em;
   }
}
.buttom{
    display: flex;
    flex-direction: column;
  >div{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    line-height: 100%;
    vertical-align: bottom;
    >div{
      display: flex;
      align-items: center;
    }
    >:nth-child(2){
      font-weight: 700;
    }

  }
}
</style>
