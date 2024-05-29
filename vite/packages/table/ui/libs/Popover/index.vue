<template>
  <div class="box">
    <a-popover
      :trigger="mode"
      overlayClassName="bgg"
      placement="right"
      :mouseLeaveDelay="0.1"
      :overlayInnerStyle="{
        'padding-left': '20px',
      }"
      :overlayStyle="{zIndex: index}"
    >
      <template #content >
        <slot name="content"></slot>
      </template>

      <slot></slot>
    </a-popover>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";

type PropsType = {
  // 层级
  index?: number;
}
const props = withDefaults(defineProps<PropsType>(), {
  index: 9999999 + 10,
});

const { index, mode } = toRefs(props);
</script>

<style lang="scss">
.bgg {
  z-index: 999999999999999;
  .ant-popover-arrow-content {
    display: none;
  }
  .ant-popover {
    margin-left: 10px;
  }
  .ant-popover-inner-content {
    border-radius: 12px !important;
    background: var(--modal-bg) !important;

  }

  .ant-popover-inner {
    width: 200px;
    border-radius: 12px !important;
  }
  .ant-popover-inner-content {
    padding: 0;
  }
  :deep(.ant-popover-content) {
  border: 2px solid red !important;
}
}
</style>
