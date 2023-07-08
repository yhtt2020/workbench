<template>
  <Tab
    class="h-12 my-5"
    boxClass="p-1 xt-bg-2"
    v-model:data="selectTab"
    v-model:list="tabList"
  ></Tab>
</template>

<script>
import Tab from "../../../card/components/tab/index.vue";
export default {
  components: { Tab },
  data() {
    return {
      selectTab: "config",
      tabList: [
        {
          name: "图标配置",
          value: "config",
        },
        {
          name: "图标样式",
          value: "style",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
