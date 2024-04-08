<script setup lang="ts">
import { useTTAppStore } from "../../store";
import { storeToRefs } from "pinia";
import AppInfo from "./AppInfo.vue";

const ttappStore = useTTAppStore();
const { ttappList } = storeToRefs(ttappStore);
</script>

<template>
  <div class="flex flex-wrap mx-auto " >
    <AppInfo v-for="item in ttappList" :key="item.id" :data="item" />
  </div>
</template>
<style lang="scss" scoped></style>
