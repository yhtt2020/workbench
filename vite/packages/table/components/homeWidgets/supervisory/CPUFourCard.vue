<template>
<SupervisorySlot :options="options">
  <div class="top-content">
    <div><span>{{CPUGPUData.SCPUUTI.value}}%</span>
      <span>
      <Icon icon="CPU" class="icon"></Icon>CPU</span>
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
      <Icon icon="youxishoubing" class="icon"></Icon>FPS</span></div>
    <div>
      <div>
        <Icon icon="xiazai" class="icon" style="color: #5CBBFF;"></Icon>
        <span>下载</span>
        <span>{{lastDown}}</span></div>

     <div>
       <Icon icon="shangchuan" class="icon" style="color: #52C41A;"></Icon>
       <span>上传</span>
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
      down:'-',
      up:'-'
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

  div{
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
    height: 6em;
    width: 18em;
    border-radius: 5%;
    >div{
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      margin: 0;

      >span:nth-child(2){
        margin-right: 8em;
      }
    }
  }.icon{
       width: 18px;
       height:18px;
  margin-right: .5em;
   }
}

</style>
