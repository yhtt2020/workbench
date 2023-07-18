<template>
  <template v-if="isMode">
    <component :is="mode"></component>
  </template>
  <template v-else>
    <Use></Use>
  </template>
</template>

<script>
import { defineAsyncComponent } from "vue";

import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["mode", "isMode"]),
  },
  components: {
    Default: defineAsyncComponent(() => import("./defalut/index.vue")),
    User: defineAsyncComponent(() => import("./user/index.vue")),
    Use: defineAsyncComponent(() => import("./use/index.vue")),
  },
};
</script>

<style lang="scss" scoped></style>
