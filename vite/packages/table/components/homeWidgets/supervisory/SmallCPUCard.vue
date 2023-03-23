<template>
  <SupervisorySlot :options="options">
    <div class="content">
      <div><a-progress type="circle"  stroke-color="#FF9C00" :percent="CPUData.SCPUUTI.value" strokeWidth="8">
        <template #format="percent">
            <div style="color:#E0E0E0;font-weight: 700">{{CPUData.SCPUUTI.value}}%</div>
            <div style="color:#ACACAC;font-size: .5em;margin-top: 1em">负载</div>
        </template>
      </a-progress>
      </div>
      <div>
        <div class="cpu" style="margin-top: .1em">
        <div class="cpu-number">
          <span>温度</span>
          <span style="font-weight:700">{{CPUData.TCPUPKG.value}}℃</span></div>
      </div>
        <a-progress :showInfo="false" status="active" :percent="CPUData.TCPUPKG.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div class="cpu" style="margin-top: .1em">
          <div class="cpu-number">
            <span>内存</span>
            <span style="font-weight:700">{{CPUData.SMEMUTI.value}}%</span></div>
        </div>
        <a-progress :showInfo="false" status="active" :percent="CPUData.SMEMUTI.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div>CPU</div>
        <canvas id='myCPUCanvas' style='width:130px;height:40px'> </canvas>

      </div>
    </div>
  </SupervisorySlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
import {mapWritableState} from "pinia";
import {tableStore} from "../../../store";
import {filterObjKeys} from "../../../util";
export default {
  name: "SmallCPUCard",
  data(){
    return {
      options:{
        className:'card small',
        title:'CPU',
        icon:'gaoxingneng'
      },
      CPUData:{
        SCPUUTI:{value:"-"},
        TCPUPKG:{value:"-"},
        SMEMUTI:{value:"-"},
      },
      CPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
    }
  },
  components:{
    SupervisorySlot
  },
  computed:{
    ...mapWritableState(tableStore, ["aidaData"]),
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
        filterObjKeys(this.CPUData,this.aidaData)
        this.CPUData.SCPUUTI.value&&  this.CPUList.push(this.CPUData.SCPUUTI.value)
        this.CPUList.shift();
        this.initCanvas()
      },
      deep: true,
    },
  },
  methods:{
    initCanvas() {
      let canvas = document.getElementById('myCPUCanvas');
      let ctx = canvas.getContext('2d');
      let x = 0;
      this.CPUList.forEach((i,index) => {

        ctx.fillStyle="#515151";
        ctx.fillRect(x ,0,12,12);
        let y= 0;
        let bcolor = 100;
        if(parseInt(this.CPUList[index])>=0&&parseInt(this.CPUList[index])<=12.5)bcolor = 8;
        if(parseInt(this.CPUList[index])>12.5&&parseInt(this.CPUList[index])<=25)bcolor =7;
        if(parseInt(this.CPUList[index])>25&&parseInt(this.CPUList[index])<=37.5)bcolor =6;
        if(parseInt(this.CPUList[index])>37.5&&parseInt(this.CPUList[index])<=50)bcolor =5;
        if(parseInt(this.CPUList[index])>50&&parseInt(this.CPUList[index])<=62.5)bcolor =4;
        if(parseInt(this.CPUList[index])>62.5&&parseInt(this.CPUList[index])<=75)bcolor =3;
        if(parseInt(this.CPUList[index])>75&&parseInt(this.CPUList[index])<=87.5)bcolor =2;
        if(parseInt(this.CPUList[index])>87.5&&parseInt(this.CPUList[index])<=100)bcolor=1;
        for (let i = 1;i<=8;i++){
          if(bcolor<=i){
            ctx.fillStyle="#3B8FFA";
          }else{
            ctx.fillStyle="#515151";
          }

          ctx.fillRect(x ,y,12,12);
          y+=6;
          y+=12;
        }
        x+=6;
        x+= 12;
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  div:first-child{
    flex: 1;
  }
  div:last-child{
    flex: 1;
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
