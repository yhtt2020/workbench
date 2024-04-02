<script setup lang="ts">
import { useAppCenterStore } from "../store";
import { storeToRefs } from "pinia";
const appCenterStore = useAppCenterStore();
const { visible } = storeToRefs(appCenterStore);
const close = () => {
  visible.value = false
};
</script>

<template>
  <xt-button class="" w="32" h="32" radius="8" @click="close">
    <xt-new-icon icon="fluent:dismiss-16-regular" size="16" class="xt-text-2" />
  </xt-button>
</template>
<style lang="scss" scoped></style>
