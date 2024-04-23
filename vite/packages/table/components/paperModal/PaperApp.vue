<!-- 壁纸应用弹窗外壳 -->
<template>
  <PaperModalContent ref="paperContentRef" />
</template>

<script setup>
import { ref } from "vue";

import PaperModalContent from "./PaperModalContent.vue";

const paperContentRef = ref(null);

const openPaperAppModal = () => {
  paperContentRef.value.openContentModal();
};

defineExpose({
  openPaperAppModal,
});
</script>

<style lang="scss" scoped>
</style>