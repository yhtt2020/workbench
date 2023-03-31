<template>
  <HomeComponentSlot :options="options">
    <div class="content">
      <div><a-progress type="circle"  stroke-color="#FF9C00" :percent="GPUData.SGPU1UTI.value" strokeWidth="10" :width="105" style="margin-top: 28px">
        <template #format="percent">
          <div style="color:#E0E0E0;font-size: 24px;font-weight: 700;">{{GPUData.SGPU1UTI.value}}%</div>
          <div style="color:#ACACAC;font-size: 14px;margin-top: 6px">负载</div>
        </template>
      </a-progress>
      </div>
      <div class="right-content">
        <div class="cpu">
          <div class="cpu-number">
            <span>温度</span>
            <span style="font-weight: 700;">{{GPUData.TGPU1DIO.value}}℃</span></div>
        </div>
        <a-progress :showInfo="false" :status="GPUData.TGPU1DIO.value=='-'?'':'active'" :percent="GPUData.TGPU1DIO.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div class="cpu" style="margin-top: 13px">
          <div class="cpu-number">
            <span>显存</span>
            <span style="font-weight: 700;">{{GPUStorage}}GB</span></div>
        </div>


        <div style="margin-top: 13px">GPU</div>
        <canvas id='myGPUCanvas' ref="myGPUCanvas" style='width:130px;height:40px;margin-top: 5px'> </canvas>
      </div>
    </div>
  </HomeComponentSlot>
</template>

<script>
import {mapWritableState} from "pinia";
import {tableStore} from "../../../store";
import {filterObjKeys,initCanvas} from "../../../util";
import HomeComponentSlot from "../HomeComponentSlot.vue";
export default {
  name: "SmallGPUCard",
  data(){
    return {
      options:{
        className:'card small',
        title:'GPU',
        icon:'gaoxingneng',
        type:'smallGPUCard'
      },
      GPUData:{
        SGPU1UTI:{value:"-"},
        TGPU1DIO:{value:"-"},
        SMEMUTI:{value:"-"},
        SGPU1USEDDEMEM:{value:0}
      },
      GPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
    }
  },
  components:{
    HomeComponentSlot
  },
  computed:{
    ...mapWritableState(tableStore, ["aidaData"]),
    GPUStorage() {
      return this.GPUData.SGPU1USEDDEMEM.value>0?(this.GPUData.SGPU1USEDDEMEM.value / 1000).toFixed(2):this.GPUData.SGPU1USEDDEMEM.value
    }
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
        filterObjKeys(this.GPUData,this.aidaData)

        if(this.GPUData.TGPU1DIO.value==="-"){
          for (let i = 0; i <Object.keys(this.aidaData).length ; i++) {
            if(Object.keys(this.aidaData)[i]==="TCPUGTC")
              this.GPUData.TGPU1DIO.value=this.aidaData.TCPUGTC.value
          }
        }

        this.GPUData.SGPU1UTI.value&& this.GPUList.push(this.GPUData.SGPU1UTI.value)
        this.GPUList.shift();
        this.initCanvas('myGPUCanvas',this.GPUList,6,12,"#515151","#3B8FFA")
      },
      deep: true,
    },
  },
  methods:{
    initCanvas
  }
}
</script>



<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  font-weight: 400;
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
