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
  methods:{
    formatTimestamp(timestamp) {
      var date = new Date(timestamp * 1000);
      var year = date.getFullYear();
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);
      return year + "-" + month + "-" + day;
    },
  }
};
</script>
<style lang="scss" scoped>
</style>
