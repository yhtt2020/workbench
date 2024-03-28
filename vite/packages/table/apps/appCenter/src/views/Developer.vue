<script setup lang="ts">
import NullState from "./components/NullState.vue";
import AppItem from "./components/AppItem.vue";
import { useTTAppStore } from "../../../ttApp/src/store";
import { storeToRefs } from "pinia";

const ttappStore: any = useTTAppStore();
const { ttappList } = storeToRefs(ttappStore);
</script>

<template>
  <template v-if="ttappList.length">
    <AppItem v-for="item in ttappList" :item="item" :key="item.id"
  /></template>
  <NullState v-else />
</template>
<style lang="scss" scoped></style>
