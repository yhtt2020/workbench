<template>
<div class="cpu-index">
  <div class="content-small">

      <a-progress type="circle"  stroke-color="#FF9C00" :percent="CPUData.SCPUUTI.value" strokeWidth="11" :width="160" class="left-content">
      <template #format="percent">
        <div style="color:#E0E0E0;font-size: 36px;font-weight: 700;">{{CPUData.SCPUUTI.value}}%</div>
        <div style="color:#ACACAC;font-size: 14px;margin-top: 10px">CPU负载</div>
      </template>
    </a-progress>

    <div class="right-content">
      <div class="cpu">
        <div class="cpu-number">
          <span>温度</span>
          <span style="font-weight: 700;">{{CPUData.TCPUPKG.value}}℃</span></div>
      </div>
      <a-progress :showInfo="false" :status="CPUData.TCPUPKG.value===0?'':'active'"  :percent="CPUData.TCPUPKG.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>
      <div>CPU</div>
      <canvas id='myCPUCanvas' ref="myCPUCanvas" > </canvas>

    </div>
  </div>

  <div class="content-small">

      <a-progress type="circle"  stroke-color="#FF9C00" :percent="GPUData.SGPU1UTI.value" strokeWidth="11" :width="160" class="left-content">
      <template #format="percent">
        <div style="color:#E0E0E0;font-size: 36px;font-weight: 700;">{{GPUData.SGPU1UTI.value}}%</div>
        <div style="color:#ACACAC;font-size: 14px;margin-top: 10px">GPU负载</div>
      </template>
    </a-progress>

    <div class="right-content">
      <div class="cpu">
        <div class="cpu-number">
          <span>温度</span>
          <span style="font-weight: 700;">{{GPUData.TGPU1DIO.value}}℃</span></div>
      </div>
      <a-progress :showInfo="false" :status="GPUData.TGPU1DIO.value===0?'':'active'" :percent="GPUData.TGPU1DIO.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>



      <div>GPU</div>
      <canvas id='myGPUCanvas' ref="myGPUCanvas"> </canvas>
    </div>
  </div>

  <div class="bottom-content">
    <div class="left-content">
      <div></div>
      <div></div>
    </div>
    <div class="right-content"></div>
  </div>
</div>
</template>

<script>
import {mapActions, mapWritableState} from "pinia";
import {tableStore} from "../../store";
import {filterObjKeys, initCanvas} from "../../util";

export default {
  name: "CPUIndex",
  data(){
    return{
      timer: null,
      CPUData:{
        SCPUUTI:{value:0},
        TCPUPKG:{value:0},
        SMEMUTI:{value:0},
      },
      CPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
      GPUData:{
        SGPU1UTI:{value:0},
        TGPU1DIO:{value:0},
        SMEMUTI:{value:0},
        SGPU1USEDDEMEM:{value:0}
      },
      GPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
    }
  },
  computed:{
    ...mapWritableState(tableStore, ["aidaData"]),
  },
  created () {
    this.timer = setInterval(() => {
      readAida64().then(res => {
        Object.keys(res).map(i => {
          if (i === 'TCPUDIO') res.TCPUPKG = res[i]
          if (i === 'TGPUDIO') res.TGPU1DIO = res[i]
        })
        this.setAidaData(res)
        // console.log(res)
        //this.data=JSON.stringify(res, null, '\t')
      }).catch(err => {
        clearInterval(this.timer)
        this.setAidaData({
          SGPU1UTI:{value:0},
          TGPU1DIO:{value:0},
          SMEMUTI:{value:0},
          SCPUUTI:{value:0},
          TCPUPKG:{value:0},
          SRTSSFPS:{value:0},
          SDSK1ACT:{value:0},
        })
      })
    }, 1000)
  },
  unmounted () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
        filterObjKeys(this.CPUData,this.aidaData)
        filterObjKeys(this.GPUData,this.aidaData)

        if(this.GPUData.TGPU1DIO.value===0){
          for (let i = 0; i <Object.keys(this.aidaData).length ; i++) {
            if(Object.keys(this.aidaData)[i]==="TCPUGTC")
              this.GPUData.TGPU1DIO.value=this.aidaData.TCPUGTC.value
          }
        }
        this.CPUData.SCPUUTI.value&&this.CPUList.push(this.CPUData.SCPUUTI.value)
        this.CPUList.shift();
        this.GPUData.SGPU1UTI.value&& this.GPUList.push(this.GPUData.SGPU1UTI.value)
        this.GPUList.shift();
        this.initCanvas('myCPUCanvas',this.CPUList,8,8,"#515151","#3B8FFA")
        this.initCanvas('myGPUCanvas',this.GPUList,8,8,"#515151","#3B8FFA")
      },
      deep: true,
    },
  },
  methods:{
    ...mapActions(tableStore, ['setAidaData']),
    initCanvas
  }
}
</script>

<style lang="scss" scoped>
.cpu-index{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  width: 936px;
  height: 522px;
  .content-small{
  width: 462px;
  height: 208px;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 12px;
  background: rgba(42, 42, 42, 1);
  margin-bottom: 12px;
  .left-content{
    margin-top: 24px;
    margin-left: 32px;
  }
  .right-content{
    margin-top: 29px;
    margin-right: 26px;
    width: 200px;
    >:nth-child(3){
      margin-top: 20px;
    }
  }
}
  .bottom-content{
    width: 522px;
    height: 462px;
    display: flex;
    justify-content: space-between;
    .left-content{
      :first-child{
        width: 100%;
        height: 218px;
        width: 462px;
        background: red;
      }
    }
    .right-content{

    }
  }
}

canvas{
  width: 100%;
  margin-top: 10px;
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
