<template>
  <HomeComponentSlot :options="options">
    <div class="content">
      <div class="cpu">
        <div class="cpu-number">
          <div>
          <Icon icon="cpu" class="icon"></Icon>
          <span>CPU</span>
        </div>
          <span style="font-weight:700">{{CPUData.SCPUUTI.value}}%</span></div>
      </div>
      <div id="cpu" ref="cpuChart" class="echarts"></div>

      <div class="cpu">
        <div class="cpu-number">
          <div>
            <Icon icon="xianka" class="icon"></Icon>
            <span>GPU</span>
          </div>
          <span style="font-weight:700">{{CPUData.SGPU1UTI.value}}%</span></div>
      </div>
      <div id="gpu" ref="gpuChart"  class="echarts"></div>

      <div class="cpu" >
        <div class="cpu-number">
          <div>
            <Icon icon="neicun" class="icon"></Icon>
            <span>内存</span>
          </div>
          <span style="font-weight:700">{{ CPUData.SMEMUTI.value }}%</span></div>
      </div>
      <a-progress :showInfo="false" :status="CPUData.SMEMUTI.value==0?'':'active'" :percent="CPUData.SMEMUTI.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

<!--      <div class="cpu" >-->
<!--      <div class="cpu-number">-->
<!--        <div>-->
<!--          <Icon icon="cipanio" class="icon"></Icon>-->
<!--          <span>磁盘</span>-->
<!--        </div>-->
<!--        <span style="font-weight:700">{{ CPUData.SDSK1ACT.value }}%</span></div>-->
<!--    </div>-->
<!--      <a-progress :showInfo="false" :status="CPUData.SDSK1ACT.value=='-'?'':'active'" :percent="CPUData.SDSK1ACT.value" :stroke-color="{-->
<!--        '0%': '#FFD061',-->
<!--        '100%': '#FF9035',-->
<!--      }"/>-->

      <div class="cpu" style="margin-top: 13px;flex-direction: column">
      <div class="cpu-number">
        <div>
          <Icon icon="wangluo" class="icon"></Icon>
          <span>网速</span>
        </div>
      </div>
        <div class="cpu">
          <div class="cpu-number">
            <div>
              <Icon icon="xiazai" class="icon" style="color: #5CBBFF;"></Icon>
              <span>下载</span>
            </div>
            <span style="font-weight:700">{{lastDown}}</span>
          </div>
        </div>

        <div class="cpu" >
          <div class="cpu-number">
            <div>
              <Icon icon="shangchuan" class="icon" style="color:  #52C41A;"></Icon>
              <span>上传</span>
            </div>
            <span style="font-weight:700">{{lastUp}}</span>
          </div>
        </div>


    </div>

    </div>


  </HomeComponentSlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
import {CPUOption,GPUOption} from './echartOptions'
import * as echarts from "echarts";
import {mapWritableState} from "pinia";
import {cardStore} from "../../../store/card";
import {filterObjKeys, netWorkDownUp} from '../../../util'
import HomeComponentSlot from "../HomeComponentSlot.vue";
export default {
  data(){
    return {
      options:{
        className:'card',
        title:'性能',
        icon:'gaoxingneng',
        type:'CPULineChart'
      },
      CPUOption,
      GPUOption,
      CPUData:{
        SCPUUTI:{value:0},
        SGPU1UTI:{value:0},
        SMEMUTI:{value:0},
        SDSK1ACT:{value:0},
      },
      CPUList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      GPUList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      down:0,
      up:0
    }
  },

  name: "CPULineChart",
  components:{
    HomeComponentSlot
  },
  computed:{
    ...mapWritableState(cardStore, ["aidaData"]),
    lastDown(){
      return this.down < 1000 ? this.down +'KB/S' : this.down<1024000?(this.down/1024).toFixed(2) + 'MB/S':(this.down/1024/1024).toFixed(2) + 'GB/S'
    },
    lastUp(){
      return this.up < 1000 ? this.up +'KB/S' : this.up<1024000?(this.up/1024).toFixed(2) + 'MB/S':(this.up/1024/1024).toFixed(2) + 'GB/S'
    }
  },
  mounted() {
    this.CPUEcharts();
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
        filterObjKeys(this.CPUData,this.aidaData)
        if(this.CPUData.SCPUUTI.value!==0) {
        this.CPUList.push(this.CPUData.SCPUUTI.value)
        this.CPUList.shift();}
        if(this.CPUData.SGPU1UTI.value!==0) {
         this.GPUList.push(this.CPUData.SGPU1UTI.value)
         this.GPUList.shift();
         }
        const {down,up} =  netWorkDownUp(this.aidaData)
        this.down = down
        this.up = up
        this.CPUEcharts()
      },
      deep: true,
    },
  },
  methods:{
    CPUEcharts() {
      let myChart = echarts.init(this.$refs.cpuChart);
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
            data: this.CPUList,
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
    let myGpuChart = echarts.init(this.$refs.gpuChart);
    myGpuChart.setOption({
      animation:false,
      title: {
        text: ''
      },
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
          data: this.GPUList,
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
    })}
  }
}
</script>

<style lang="scss" scoped>
.content{

  .cpu{
    display: flex;
    margin-top: 13px;
    font-size: 16px;
    font-weight: 400;
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

      vertical-align: middle;
    }
  }
  }
  .icon{
    width: 20px;
    height: 20px;
  }
}
.echarts {
  margin-top: 1em;
  height: 40px;
  width: calc(100%);
}

</style>
