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
    // initCanvas() {
    //   let canvas = this.$refs.myCPUCanvas;
    //   let ctx = canvas.getContext('2d');
    //   let x = 0;
    //   this.CPUList.forEach((i,index) => {
    //
    //     ctx.fillStyle="#515151";
    //     ctx.fillRect(x ,0,12,12);
    //     let y= 0;
    //     let bcolor = 100;
    //     if(parseInt(this.CPUList[index])>=0&&parseInt(this.CPUList[index])<=16)bcolor = 6;
    //     if(parseInt(this.CPUList[index])>16&&parseInt(this.CPUList[index])<=32)bcolor =5;
    //     if(parseInt(this.CPUList[index])>32&&parseInt(this.CPUList[index])<=48)bcolor =4;
    //     if(parseInt(this.CPUList[index])>48&&parseInt(this.CPUList[index])<=64)bcolor =3;
    //     if(parseInt(this.CPUList[index])>64&&parseInt(this.CPUList[index])<=80)bcolor =2;
    //     if(parseInt(this.CPUList[index])>80&&parseInt(this.CPUList[index])<=100)bcolor =1;
    //
    //     for (let i = 1;i<=6;i++){
    //       if(bcolor<=i){
    //         ctx.fillStyle="#3B8FFA";
    //       }else{
    //         ctx.fillStyle="#515151";
    //       }
    //
    //       ctx.fillRect(x ,y,12,12);
    //       y+=6;
    //       y+=12;
    //     }
    //     x+=6;
    //     x+= 12;
    //   })
    //
    // }

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
