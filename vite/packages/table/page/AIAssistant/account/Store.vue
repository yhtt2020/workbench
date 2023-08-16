<template>
  <div class="xt-bg rounded-xl p-4">
    <div class="flex items-center justify-center">
      <Tab
        style="height: 48px"
        :style="{ width: tabWidth }"
        v-model:data="selectTab"
        :list="tabList"
        boxClass="p-1 xt-bg-2"
      ></Tab>
    </div>
    <div v-for="item in priceList">
      <Buy :data="item"></Buy>
    </div>
  </div>
</template>

<script>
import Tab from "../../../components/card/libs/tab/index.vue";
import Buy from "../components/buy.vue";
import { cycleList, countList } from "./price.ts";
export default {
  components: {
    Tab,
    Buy,
  },
  mounted() {
    this.priceList = cycleList;
  },
  watch: {
    selectTab(newV) {
      if (newV === "cycle") this.priceList = cycleList;
      else this.priceList = countList;
    },
  },
  data() {
    return {
      priceList: null,
      selectTab: "cycle",
      tabList: [
        {
          name: "按周期",
          value: "cycle",
        },
        {
          name: "按次数",
          value: "count",
        },
      ],
    };
  },
  props: {
    tabWidth: {
      default: "100%",
    },
  },
};
</script>

<style lang="scss" scoped></style>
