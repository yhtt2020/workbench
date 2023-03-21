<template>
  <SupervisorySlot :options="options">
    <div class="content">
      <div class="cpu">
        <div class="cpu-number">
          <div>
          <Icon icon="CPU" class="icon"></Icon>
          <span>CPU</span>
        </div>
          <span style="font-weight:700">{{CPUData.SCPUUTI.value}}%</span></div>
      </div>
      <div id="cpu" class="echarts"></div>

      <div class="cpu" style="margin-top: .5em">
        <div class="cpu-number">
          <div>
            <Icon icon="CPU" class="icon"></Icon>
            <span>GPU</span>
          </div>
          <span style="font-weight:700">{{CPUData.SGPU1UTI.value}}%</span></div>
      </div>
      <div id="gpu" class="echarts"></div>

      <div class="cpu" style="margin-top: .5em">
        <div class="cpu-number">
          <div>
            <Icon icon="neicun" class="icon"></Icon>
            <span>内存</span>
          </div>
          <span style="font-weight:700">{{ CPUData.SMEMUTI.value }}%</span></div>
      </div>
      <a-progress :showInfo="false" status="active" :percent="CPUData.SMEMUTI.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

      <div class="cpu" style="margin-top: .5em">
      <div class="cpu-number">
        <div>
          <Icon icon="cipanio" class="icon"></Icon>
          <span>磁盘</span>
        </div>
        <span style="font-weight:700">{{ CPUData.SDSK1ACT.value }}%</span></div>
    </div>
      <a-progress :showInfo="false" status="active" :percent="CPUData.SDSK1ACT.value" :stroke-color="{
        '0%': '#FFD061',
        '100%': '#FF9035',
      }"/>

      <div class="cpu" style="margin-top: .5em;flex-direction: column">
      <div class="cpu-number">
        <div>
          <Icon icon="wangluo" class="icon"></Icon>
          <span>网速</span>
        </div>
      </div>
        <div class="cpu-number" style="margin-top: .5em">
          <Icon icon="xiazai" class="icon" style="color: #5CBBFF;"></Icon>
          <span>下载</span>
          <span>12.7MB/S</span>
          <Icon icon="shangchuan" class="icon" style="color: #52C41A;"></Icon>
          <span>上传</span>
          <span>34.1KB/S</span>
        </div>
    </div>

    </div>


  </SupervisorySlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
import {CPUOption,GPUOption} from './echartOptions'
import * as echarts from "echarts";
import {mapWritableState} from "pinia";
import {tableStore} from "../../../store";
export default {
  data(){
    return {
      options:{
        className:'card',
        title:'性能',
        icon:'xingneng'
      },
      CPUOption,
      GPUOption,
      CPUData:{
        SCPUUTI:{value:"-"},
        SGPU1UTI:{value:"-"},
        SMEMUTI:{value:"-"},
        SDSK1ACT:{value:"-"},
      },
      CPUlist:[120,120,120,120,120]
    }
  },

  name: "CPULineChart",
  components:{
    SupervisorySlot
  },
  computed:{
    ...mapWritableState(tableStore, ["aidaData"]),
  },
  mounted() {
    this.CPUEcharts();
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
      this.CPUData=this.aidaData;
      this.CPUlist.push(this.CPUData.SCPUUTI.value)
        this.CPUlist.shift();

        this.CPUEcharts()
      },
      deep: true,
    },
  },
  methods:{
    CPUEcharts() {
      let myChart = echarts.init(document.getElementById("cpu"),'dark');
      myChart.setOption({
        title: {
          text: ''
        },
        animation:false,  
        backgroundColor:'transparent',
        legend: {
          data: ['normal'],
        },
        grid:{ // 让图表占满容器
          top:"0px",
          left:"0px",
          right:"0px",
          bottom:"0px"
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            show:false
          },

        ],
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series'
            },
            data: this.CPUlist,
            itemStyle : {
              normal : {
                color:'#1890FF'
              },

            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [  // 渐变颜色
                  {
                    offset: 0,
                    color: '#404D61',
                  },
                  {
                    offset: 1,
                    color: '#404D61',
                  },
                ],
                global: false,
              },
            },
          },
        ]
      })
    let myGpuChart = echarts.init(document.getElementById("gpu"),'dark');
    myGpuChart.setOption(GPUOption)}
  }
}
</script>

<style lang="scss" scoped>
.content{

  .cpu{

    display: flex;
  .cpu-number{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    div{
      display: flex;
      align-items: center;
      width: 23%;
      justify-content: space-between;
      font-weight: 500;
    }
  }
  }
  .icon{
    width: 2em;
    height: 2em;
  }
}
.echarts {
  margin-top: 1em;
  height: 40px;
  width: calc(100%);
}

</style>
