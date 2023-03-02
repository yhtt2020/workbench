<template>
  <div id="ec" class="echarts"></div>
</template>
<script>
import * as echarts from "echarts";
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
    };
  },
  mounted() {
    this.tempMin = this.daily.map((item) => item.tempMin);
    this.tempMax = this.daily.map((item) => item.tempMax);
    this.wertherEcharts();
  },

  methods: {
    wertherEcharts() {
      var myChart = echarts.init(document.getElementById("ec"));
      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
            name: "Highest",
            type: "line",
            data: this.tempMax,
            label: { show: true, fontSize: 15, color: "#FFFFFF" },
            itemStyle: { color: "#FF9912" },
            // markLine: {
            //   data: [{ type: "average", name: "Avg" }],
            // },
          },
          {
            name: "Lowest",
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
