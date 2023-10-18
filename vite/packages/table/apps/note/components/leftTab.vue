<template>
   <xt-left-menu :list="menuList" last="1" end="3">
    <template #test>
      1123
      <xt-button @click="showRightPanel = !showRightPanel">Toggle Right Panel</xt-button>
    </template>
    <slot></slot>
  </xt-left-menu>
<!-- 全屏 -->
</template>

<script>
// import CreateTopic from "../chat/left/createTopic.vue";
// import { mapWritableState } from "pinia";
// import { aiStore } from "../../../store/ai";
// import Edit from "./edit.vue";
// import { SettingFilled } from "@ant-design/icons-vue";
export default {
  components: {
    // CreateTopic,
    // Edit,

    // SettingFilled,
  },
  computed: {
    // ...mapWritableState(aiStore, [
    //   "selectTab",
    //   "isFull",
    //   "temperature",
    //   "count",
    // ]),
  },
  data() {
    return {

    };
  },
};
</script>
<style lang="scss" scoped>
</style>
