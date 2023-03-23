<template>
  <SupervisorySlot :options="options">
    <div class="content">
      <div><a-progress type="circle"  stroke-color="#FF9C00" :percent="GPUData.SGPU1UTI.value" strokeWidth="8">
        <template #format="percent">
          <div style="color:#E0E0E0;font-weight: 700">{{GPUData.SGPU1UTI.value}}%</div>
          <div style="color:#ACACAC;font-size: .5em;margin-top: 1em">负载</div>
        </template>
      </a-progress>
      </div>
      <div>
        <div class="cpu" style="margin-top: .1em">
          <div class="cpu-number">
            <span>温度</span>
            <span style="font-weight:700">{{GPUData.TGPU1DIO.value}}℃</span></div>
        </div>
        <a-progress :showInfo="false" status="active" :percent="GPUData.TGPU1DIO.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div class="cpu" style="margin-top: .1em">
          <div class="cpu-number">
            <span>内存</span>
            <span style="font-weight:700">{{GPUData.SMEMUTI.value}}%</span></div>
        </div>
        <a-progress :showInfo="false" status="active" :percent="GPUData.SMEMUTI.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div>GPU</div>
        <canvas id='myGPUCanvas' style='width:130px;height:40px'> </canvas>
      </div>
    </div>
  </SupervisorySlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
import {mapWritableState} from "pinia";
import {tableStore} from "../../../store";

export default {
  name: "SmallGPUCard",
  data(){
    return {
      options:{
        className:'card small',
        title:'GPU',
        icon:'gaoxingneng'
      },
      GPUData:{
        SGPU1UTI:{value:"-"},
        TGPU1DIO:{value:"-"},
        SMEMUTI:{value:"-"},
      },
      GPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
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
        Object.keys(this.GPUData).reduce((newData, key) => {
          if (this.aidaData.hasOwnProperty(key)) {
            this.GPUData[key] = this.aidaData[key]
          }
          return newData;
        }, {});
        this.GPUData.SGPU1UTI.value&& this.GPUList.push(this.GPUData.SGPU1UTI.value)
        this.GPUList.shift();
        this.initCanvas()
      },
      deep: true,
    },
  },
  methods:{
    initCanvas() {
      let canvas = document.getElementById('myGPUCanvas');
      let ctx = canvas.getContext('2d');
      let x = 0;
      this.GPUList.forEach((i,index) => {

        ctx.fillStyle="#515151";
        ctx.fillRect(x ,0,12,12);
        let y= 0;
        let bcolor = 100;
        if(parseInt(this.GPUList[index])>=0&&parseInt(this.GPUList[index])<=12.5)bcolor = 8;
        if(parseInt(this.GPUList[index])>12.5&&parseInt(this.GPUList[index])<=25)bcolor =7;
        if(parseInt(this.GPUList[index])>25&&parseInt(this.GPUList[index])<=37.5)bcolor =6;
        if(parseInt(this.GPUList[index])>37.5&&parseInt(this.GPUList[index])<=50)bcolor =5;
        if(parseInt(this.GPUList[index])>50&&parseInt(this.GPUList[index])<=62.5)bcolor =4;
        if(parseInt(this.GPUList[index])>62.5&&parseInt(this.GPUList[index])<=75)bcolor =3;
        if(parseInt(this.GPUList[index])>75&&parseInt(this.GPUList[index])<=87.5)bcolor =2;
        if(parseInt(this.GPUList[index])>87.5&&parseInt(this.GPUList[index])<=100)bcolor=1;
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
