<template>
  <!-- 统一选择模板 -->
  <a-tooltip :title="item.title" placement="right">
    <div
      @click="selectClick(item.id, item.flag)"
      class="xt-base-btn"
      style="width: 50px; height: 50px; border-radius: 14px"
      :style="[isActive(item.tab||item.id,3,tabVariables) ? 'border: 3px solid var(--active-bg)' : '']"
    >
      <slot></slot>
    </div>
  </a-tooltip>
</template>

<script setup>
import routerTab from '../../../js/common/routerTab'

const isActive=routerTab.isActive
const props = defineProps({
  item: {},
  id: "",
  tabVariables:undefined
});
const emits = defineEmits(["itemClick"]);
const selectClick = () => {
  emits("itemClick", props.item);
};
</script>

<style lang="scss" scoped></style>
