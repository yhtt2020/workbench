<!-- <template>
  <div class="relative">
    <slot></slot>
    <div
      class="absolute xt-modal rounded-xl p-3 xt-b"
      style=""
      v-if="modelValue"
    >
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: {},
});
</script> -->

<template>
  <div class="box">
    <a-popover :visible="modelValue" trigger="click" className="popover">
      <template #content>
        <slot name="tip"></slot>
      </template>
      <slot></slot>
    </a-popover>
  </div>
</template>
 <script setup>
const props = defineProps({
  modelValue: {},
});
</script>

<style lang="scss" scoped>
.box {
  .popover {
    z-index: 9999999999 !important;
  }
  .ant-popover {
    z-index: 9999999;
    border: 1px solid red;
  }
  :deep(.ant-popover) {
    z-index: 9999999;
    border: 1px solid red;
  }
  :deep(.ant-popover-inner-content) {
    z-index: 999999999999;
  }
}
</style>
