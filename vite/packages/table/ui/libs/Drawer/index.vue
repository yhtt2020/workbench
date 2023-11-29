<template>
  <div class="box">
    <a-drawer
      v-if="visible"
      :width="width"
      :height="height"
      :placement="placement"
      style="z-index: 99999999"
      v-model:visible="visible"
      @close="close()"
      :bodyStyle="{ padding: '12px', 'padding-top': '0px' }"
    >
      <template #title>
        <slot name="title"></slot>
      </template>
      <slot></slot>
    </a-drawer>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      default: false,
    },
    placement: {
      default: "bottom",
    },
    width: {
      default: 500,
    },
    height: {
      default: 200,
    },
  },
  data() {
    return {
      visible: this.modelValue,
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit("update:modelValue", false);
    },
  },
  watch: {
    modelValue(newV) {
      this.visible = newV;
    },
  },
};
</script>

<style lang="scss" scoped></style>
