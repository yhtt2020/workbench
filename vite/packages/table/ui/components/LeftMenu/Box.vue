<template>
    <!-- 统一选择模板 -->
  <div
    @click="selectClick(item.id, item.flag)"
    class="xt-base-btn "
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
const emits = defineEmits(["selectClick"]);
const selectClick = () => {
  emits("selectClick", props.item.id, props.item.flag);
};
</script>

<style lang="scss" scoped></style>
