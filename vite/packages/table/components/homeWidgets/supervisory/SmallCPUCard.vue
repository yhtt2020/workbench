<template>
  <HomeComponentSlot :options="options">
    <div class="content">
      <div><a-progress type="circle"  stroke-color="#FF9C00" :percent="CPUData.SCPUUTI.value" :strokeWidth="10" :width="105" style="margin-top: 28px">
        <template #format="percent">
            <div style="color:#E0E0E0;font-size: 24px;font-weight: 700;">{{CPUData.SCPUUTI.value}}%</div>
            <div style="color:#ACACAC;font-size: 14px;margin-top: 6px">负载</div>
        </template>
      </a-progress>
      </div>
      <div>
        <div class="cpu right-content">
        <div class="cpu-number">
          <span>温度</span>
          <span style="font-weight: 700;">{{CPUData.TCPUPKG.value}}℃</span></div>
      </div>
        <a-progress :showInfo="false" :status="CPUData.TCPUPKG.value==0?'':'active'"  :percent="CPUData.TCPUPKG.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div class="cpu" style="margin-top: 3px">
          <div class="cpu-number">
            <span>内存</span>
            <span style="font-weight: 700;">{{CPUData.SMEMUTI.value}}%</span></div>
        </div>
        <a-progress :showInfo="false" :status="CPUData.SMEMUTI.value==0?'':'active'" :percent="CPUData.SMEMUTI.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div style="margin-top: 1px" class="text-left">CPU</div>
        <canvas id='myCPUCanvas' ref="myCPUCanvas"  style='width:130px;height:40px;margin-top: 5px'> </canvas>

      </div>
    </div>
  </HomeComponentSlot>
</template>

<script>
import {mapWritableState} from "pinia";
import {cardStore} from "../../../store/card";
import {filterObjKeys,initCanvas} from "../../../util";
import HomeComponentSlot from "../HomeComponentSlot.vue";
export default {
  name: "SmallCPUCard",
  data(){
    return {
      options:{
        className:'card small',
        title:'CPU',
        icon:'cpu',
        type:'smallCPUCard'
      },
      CPUData:{
        SCPUUTI:{value:0},
        TCPUPKG:{value:0},
        SMEMUTI:{value:0},
      },
      CPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
    }
  },
  components:{
    HomeComponentSlot
  },
  computed:{
    ...mapWritableState(cardStore, ["aidaData"]),
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
        filterObjKeys(this.CPUData,this.aidaData)
        this.CPUData.SCPUUTI.value&&  this.CPUList.push(this.CPUData.SCPUUTI.value)
        this.CPUList.shift();
        this.initCanvas('myCPUCanvas',this.CPUList,6,12,"#515151","#3B8FFA")
      },
      deep: true,
    },
  },
  methods:{
    initCanvas,
  }
}
</script>

<style lang="scss" scoped>
.content{
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  .right-content{
    margin-top: 8px;
  }
}

.cpu{
  display: flex;
  .cpu-number{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }
}
</style>
