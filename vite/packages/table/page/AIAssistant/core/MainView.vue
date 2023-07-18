<template>
  <component :is="selectTab" class="w-full h-full"></component>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTab"]),
  },
  components: {
    Chat: defineAsyncComponent(() => import("../chat/index.vue")),
    // Model: defineAsyncComponent(() => import("../model/index.vue")),
    Mode: defineAsyncComponent(() => import("../mode/index.vue")),
    Account: defineAsyncComponent(() => import("../account/index.vue")),
  },
};
</script>

<style lang="scss" scoped></style>
