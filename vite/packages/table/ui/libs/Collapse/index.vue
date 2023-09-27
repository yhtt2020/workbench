<template>
  <div class="box rounded-xl">
    <a-collapse
      ghost
      class="xt-text xt-bg-2 rounded-xl"
      expandIconPosition="right"
    >
      <a-collapse-panel>
        <template #header>
          <slot name="title"> {{ title }}</slot>
        </template>
        <slot>
          {{ content }}
        </slot>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <br />
</template>
<script lang="ts" setup>
const props = defineProps({
  title: {
    default: "test title",
  },
  content: {
    default: "test content",
  },
});
</script>

<style lang="scss" scoped>
.ant-collapse {
  border-radius: 12px;
}
.box {
  :deep(.ant-collapse-header) {
    color: var(--primary-text) !important;
  }
  :deep(.ant-collapse-content-box) {
    padding-top: 0 !important;

    color: var(--primary-text) !important;
  }
}
</style>
