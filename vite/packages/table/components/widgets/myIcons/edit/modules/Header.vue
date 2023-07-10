<template>
  <Tab
    style="height: 52px"
    boxClass="p-1 xt-bg-2"
    v-model:data="selectTab"
    v-model:list="tabList"
  ></Tab>
</template>

<script>
import Tab from "../../../../card/components/tab/index.vue";
// import {} from "../hooks/config"
export default {
  components: { Tab },
  data() {
    return {
      selectTab: "config",
      tabList: [
        {
          name: "配置",
          value: "config",
        },
        {
          name: "样式",
          value: "style",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
