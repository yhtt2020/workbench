<template>
  <div id="ec" class="echarts"></div>
</template>
<script>
import * as echarts from "echarts";
import { getDateTime } from "../../../../src/util/dateTime.js";
export default {
  name: "Son",
  props: {
    daily: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tempMin: [],
      tempMax: [],
      fxDate: [],
    };
  },
  mounted() {
    this.fxDate = this.daily.map((item) => this.getMonthAndDay(item.fxDate));
    this.tempMin = this.daily.map((item) => item.tempMin);
    console.log(this.tempMin);
    this.tempMax = this.daily.map((item) => item.tempMax);
    this.wertherEcharts();
  },

  methods: {
    getMonthAndDay(time) {
      let format = getDateTime(new Date(time));
      return format.month + "月" + format.day + "日";
    },
    wertherEcharts() {
      var myChart = echarts.init(document.getElementById("ec"),'dark');

      myChart.setOption({

        backgroundColor:'',
        tooltip: {
          trigger: "axis",
        },

        xAxis: {
          axisTick:{
            show:false
          },
          type: "category",
          boundaryGap: false,
          // data: [],
          data: this.fxDate,
          show: false,

          boundaryGap: ['20%', '20%'],
          data: this.fxDate,
          show: true,
        },
        yAxis: {
          splitLine:false,
          type: "value",
          boundaryGap: ['20%', '20%'],
          show: false,

        },
        grid: {
          left: 80,
          right: 250,
          width:'80%'
        },

        series: [
          {
            name: "最高温",
            type: "line",
            smooth:true,
            areaStyle: {},
            data: this.tempMax,
            label: { show: true, fontSize: 15, color: "#FFFFFF" ,formatter:'{c}℃'},
            itemStyle: { color: "#ffb95e" },
            // markLine: {
            //   data: [{ type: "average", name: "Avg" }],
            // },
          },
          {
            name: "最低温",
            type: "line",
            smooth:true,
            areaStyle: {

            },
            data: this.tempMin,
            label: {
              show: true,
              position: "bottom",
              fontSize: 15,
              color: "#FFFFFF",
              formatter:'{c}℃'
            },
            itemStyle: { color: "#009dff" },
            // markLine: {
            //   data: [
            //     { type: "average", name: "Avg" },
            //     [
            //       {
            //         symbol: "none",
            //         x: "90%",
            //         yAxis: "max",
            //       },
            //       {
            //         symbol: "circle",
            //         label: {
            //           position: "start",
            //           formatter: "Max",
            //         },
            //         type: "max",
            //         name: "最高点",
            //       },
            //     ],
            //   ],
            // },
          },
        ],
      });
    },
  },
};
</script>

<style scoped lang="scss">
.echarts {
  height: 376px;
}
</style>
