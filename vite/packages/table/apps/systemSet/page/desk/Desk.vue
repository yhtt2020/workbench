<script setup>
import { ref, shallowReactive, defineAsyncComponent } from "vue";
const GlobalDesk = defineAsyncComponent(() => import("./GlobalDesk.vue"));
const CurrentDesk = defineAsyncComponent(() => import("./CurrentDesk.vue"));
defineProps(["deskTab"]);
</script>

<template>
  <div class="flex flex-col">
    <GlobalDesk v-if="deskTab == 'all'" />
    <CurrentDesk v-else />
  </div>
</template>

<style lang="scss" scoped></style>
