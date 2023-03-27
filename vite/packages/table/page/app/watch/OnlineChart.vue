<template>
  <div id="ec" className="echarts"></div>
</template>

<script>

import * as echarts from 'echarts'
import _ from 'lodash-es'
import { getDateTime } from '../../../util'

export default {
  name: 'OnlineChart',
  props: ['data'],
  data () {
    return {
      xData: [],
      yData: [],
      myChart: null,
    }
  },
  mounted () {
    console.log(this.data, '表内数据')

    console.log(this.xData, this.yData, '格式化数据结果')
    this.initChart()
  },
  watch: {
    'data': {
      handler (newVal) {
        if (this.myChart) {
          this.formatData()
          this.myChart.setOption({
            series: {
              data: this.yData
            },
            xAxis: {
              data: this.xData,
            }
          })
        }
      }
    }
  },
  methods: {
    formatOnline (num) {
      let str = String(num).replace('+', '')
      let rs=num
      if (str.indexOf('万') > -1) {
        str = str.replace('万', '')
        rs = Number(str) * 10000
      } else if (str.indexOf('千') > -1) {
        str = str.replace('千', '')
        rs = Number(str) * 1000
      }
      return rs
    },
    formatData () {
      this.xData = this.data.map(d => {
        const time=getDateTime(new Date(d.time))
        return time.month+'/'+time.day+' '+time.hours+':'+time.minutes
      })
      this.yData = this.data.map(d => {
        return this.formatOnline(d.online)
      })
      _.reverse(this.xData)
      _.reverse(this.yData)
      console.log(this.yData)
    },
    initChart () {
      var myChart = echarts.init(document.getElementById('ec'), 'dark')
      this.myChart = myChart
      myChart.setOption({
        backgroundColor: '',
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { type: ['line', 'bar'] },

            saveAsImage: {}
          }
        },
        xAxis: {
          axisTick: {
            show: false
          },
          type: 'category',
          boundaryGap: ['20%', '20%'],
          data: this.xData,
          show: true,
        },
        yAxis: {
          splitLine: false,
          type: 'value',
         // boundaryGap: ['20%', '20%'],
          show: true,

        },
        grid: {
          left: 80,
          right: 250,
          width: '80%'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: '在线人数',
            type: 'line',
            smooth: true,
            areaStyle: {},
            data: this.yData,
            label: { show: false, fontSize: 15, color: '#FFFFFF', formatter: '{c}' },
            itemStyle: { color: 'rgba(72,210,1,0.78)' },
            markPoint: {
              data: [
                { type: 'max', name: 'Max' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: 'Avg' },
              ]
            }
            // markLine: {
            //   data: [{ type: "average", name: "Avg" }],
            // },
          },

        ],
      })
    }
  }
}
</script>

<style scoped>
.echarts {
  height: 376px;
}
</style>
