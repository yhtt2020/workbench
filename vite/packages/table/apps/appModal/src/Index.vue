<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  inject,
} from "vue";
import { storeToRefs } from "pinia";
import { useAppModalStore } from "./store";
import AppModal from "./AppModal.vue";

const appModalStore: any = useAppModalStore();
const { runList }: any = storeToRefs(appModalStore);

// 状态注册
provide("modalStatus", true);
</script>

<template>
  <template v-for="item in runList" :key="item.name">
    <AppModal v-if="item.visible" :name="item.name" />
  </template>
</template>
<style lang="scss" scoped></style>
