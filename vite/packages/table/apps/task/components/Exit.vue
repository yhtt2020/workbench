<template>
  <xt-button
    icon="fluent:dismiss-16-regular"
    @click="close()"
    size="16"
    class="absolute"
    style="right: 12px"
    w="32" h="32"

    radius="8"
  />
</template>

<script setup>
import { taskStore } from "../store";
const task = taskStore();

const close = () => {
  task.isTaskDrawer = false;
};
</script>

<style lang="scss" scoped></style>
