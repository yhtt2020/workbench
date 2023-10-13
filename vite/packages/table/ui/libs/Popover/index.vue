<template>
  <div class="box w-full h-full">
    <a-popover
      trigger="hover"
      overlayClassName="bgg"
      placement="right"
      :mouseLeaveDelay="0.1"
      :overlayInnerStyle="{
        'padding-left': '20px',
      }"
    >
      <template #content>
        <slot name="content"></slot>
      </template>

      <slot></slot>
    </a-popover>
  </div>
</template>
<script setup></script>

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
    padding: 3px;

  }

  .ant-popover-inner {
    width: 200px;
    border-radius: 12px !important;
  }
}
</style>
