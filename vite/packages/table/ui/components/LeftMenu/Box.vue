<template>
  <!-- 统一选择模板 -->
  <div
    class="xt-base-btn"
    style="width: 50px; height: 50px; border-radius: 14px"
    :style="[item.id == id ? 'border: 3px solid var(--active-bg)' : '']"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {},
  id: "",
});
</script>

<style lang="scss" scoped></style>
