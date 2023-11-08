<template>
  <Widget :options="options" :menu-list="menuList" :desk="desk">
    <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:arrow-trending-lines-20-filled" style="font-size: 24px;" />
        </div>
      </template>
    <div @click="go" class="content pointer" style="color:var(--primary-text)">
      <div class="cpu">
        <div class="cpu-number">
          <div>
          <Icon icon="cpu" class="icon"></Icon>
          <span>CPU</span>
        </div>
          <span style="font-weight:700">{{CPUData.useCPU.value}}%</span></div>
      </div>
      <div id="cpu" ref="cpuChart" class="echarts"></div>

      <div class="cpu">
        <div class="cpu-number">
          <div>
            <Icon icon="xianka" class="icon"></Icon>
            <span>GPU</span>
          </div>
          <span style="font-weight:700">{{CPUData.useGPU.value}}%</span></div>
      </div>
      <div id="gpu" ref="gpuChart"  class="echarts"></div>

      <div class="cpu" >
        <div class="cpu-number">
          <div>
            <Icon icon="neicun" class="icon"></Icon>
            <span>内存</span>
          </div>
          <span style="font-weight:700">{{ CPUData.useMemory.value }}%</span></div>
      </div>
      <a-progress :showInfo="false" :status="CPUData.useMemory.value==0 || saving?'':'active'" :percent="CPUData.useMemory.value" :stroke-color="{
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


  </Widget>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
import {CPUOption,GPUOption} from './echartOptions'
import * as echarts from "echarts";
import {mapWritableState,mapActions} from "pinia";
import {cardStore} from "../../../store/card";
import {filterObjKeys, netWorkDownUp} from '../../../util'
import Widget from "../../card/Widget.vue";
import { appStore } from '../../../store'
import { inspectorStore } from '../../../store/inspector'
import { message } from 'ant-design-vue'
import { Icon as newIcon } from "@iconify/vue";
export default {
  props:['desk'],
  data(){
    return {
      options:{
        className:'card',
        title:'性能',
        // icon:'dashboard',
        type:'CPULineChart'
      },
      CPUOption,
      GPUOption,
      CPUData:{
        useGPU:{value:0},
        useCPU:{value:0},
        useMemory:{value:0},
        down:0,
        up:0
      },
      CPUList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      GPUList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      echartsInstance:null,
      echartsGPUInstance:null,
      menuList:[
        {
          title:'复制数据',
          icon:'fuzhi',
          fn:()=>{
            require('electron').clipboard.writeText(JSON.stringify(this.aidaData))
            message.success('复制成功')
          }
        }
      ]
    }
  },

  name: "CPULineChart",
  components:{
    Widget,
    newIcon
  },
  computed:{
    ...mapWritableState(appStore,['saving']),
    ...mapWritableState(inspectorStore,['displayData','aidaData']),
    lastDown(){
      return this.CPUData.down < 1000 ? this.CPUData.down +'KB/S' : this.CPUData.down<1024000?(this.CPUData.down/1024).toFixed(2) + 'MB/S':(this.CPUData.down/1024/1024).toFixed(2) + 'GB/S'
    },
    lastUp(){
      return this.CPUData.up < 1000 ? this.CPUData.up +'KB/S' : this.CPUData.up<1024000?(this.CPUData.up/1024).toFixed(2) + 'MB/S':(this.CPUData.up/1024/1024).toFixed(2) + 'GB/S'
    }
  },
  mounted () {
    this.CPUEcharts();
    this.startInspect()
  },
  unmounted () {
    this.stopInspect()
  },
  watch: {
    "displayData": {
      handler(newVal, oldVal) {
        let { useGPU, warmGPU, useMemory, useCPU, warmCPU, FPS, videoStorage, down, up} = this.displayData || {}
        this.CPUData = {
          useGPU:useGPU,
          useCPU:useCPU,
          useMemory:useMemory,
          down:down,
          up:up
        }
        if(this.CPUData.useCPU.value!==0) {
        this.CPUList.push(this.CPUData.useCPU.value)
        this.CPUList.shift();}
        if(this.CPUData.useGPU.value!==0) {
         this.GPUList.push(this.CPUData.useGPU.value)
         this.GPUList.shift();
         }
        //this.CPUEcharts()
        this.echartsInstance.setOption({series: [
            {
              smooth: 0.6,
              symbol: 'none',
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
          ]});
        this.echartsGPUInstance.setOption({series: [
            {
              symbol: 'none',
              smooth: 0.6,
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
          ]})
      },
      deep: true,
    },
  },
  methods:{
    ...mapActions(inspectorStore, ['startInspect', 'stopInspect']),
    go(){
      this.$router.push({name:'inspector'})
    },
    CPUEcharts() {
      this.echartsInstance = echarts.init(this.$refs.cpuChart);
      this.echartsInstance.setOption({
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
            smooth: 0.6,
            symbol: 'none',
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
     this.echartsGPUInstance = echarts.init(this.$refs.gpuChart);
      this.echartsGPUInstance.setOption({
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
          symbol: 'none',
          smooth: 0.6,
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
