<!--  -->
<script setup lang="ts">
import Box from "./Box.vue";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  title: string;
}>();

onMounted(() => {
  const interval = setInterval(() => (tickTock.value = !tickTock.value), 500);
  onUnmounted(() => {
    clearInterval(interval);
  });
});

const tickTock = ref(false);
</script>

<template>
  <div class="box-drag-preview">
    <!-- <Box :title="title" :yellow="tickTock" preview /> -->
    123
  </div>
</template>

<style scoped>
.box-drag-preview {
  display: inline-block;
  transform: rotate(-7deg);
}
</style>
