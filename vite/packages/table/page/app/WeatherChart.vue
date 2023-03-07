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
      const domChart = document.getElementById("ec");
      domChart.removeAttribute("_echarts_instance_");
      let myChart = echarts.init(domChart);
      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          // data: [],
          data: this.fxDate,
          show: false,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} °C",
          },

          show: false,
        },
        grid: {
          left: 80,
          right: 250,
        },

        series: [
          {
            name: "最高温",
            type: "line",
            data: this.tempMax,
            label: { show: true, fontSize: 15, color: "#FFFFFF" },
            itemStyle: { color: "#FF9912" },
            // markLine: {
            //   data: [{ type: "average", name: "Avg" }],
            // },
          },
          {
            name: "最低温",
            type: "line",
            data: this.tempMin,
            label: {
              show: true,
              position: "bottom",
              fontSize: 15,
              color: "#FFFFFF",
            },
            itemStyle: { color: "#00FFFF" },
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
