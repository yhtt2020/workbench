<template>
  <!-- <XtTab
    boxClass="xt-bg-2 p-1 "
    style="height: 48px"
    :list="list"
    v-model:data="selectNav"
  ></XtTab> -->
  <component :is="selectNav"></component>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    Convert: defineAsyncComponent(() => import("./Convert.vue")),
    Extract: defineAsyncComponent(() => import("./Extract.vue")),
  },
  data() {
    return {
      selectNav: "Convert",
      list: [
        { name: "颜色转换", value: "Convert" },
        { name: "颜色提取", value: "Extract" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
