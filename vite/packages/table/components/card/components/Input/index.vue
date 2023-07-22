<template>
  <a-input
    class="rounded-xl xt-bg-2 pl-2"
    :class="border"
    v-model:value="searchValue"
    :placeholder="placeholder"
    @change="handleChange"
  >
    <template #prefix>
      <slot name="header"></slot>
    </template>
    <template #suffix>
      <slot></slot>
    </template>
  </a-input>
</template>

<script>
export default {
  name: "XtInput",
  props: {
    data: {},
    placeholder: {
      default: "",
    },
    border: {
      default: "xt-border",
    },
  },
  data() {
    return {
      searchValue: this.data,
    };
  },
  watch: {
    searchValue(newV) {
      this.$emit("update:data", newV);
    },
  },
  watch: {
    searchValue(newV) {
      this.$emit("update:data", newV);
    },
    data(newV) {
      this.searchValue = newV;
    },
  },
  methods: {
    // 按下回车
    handleEnter(e) {
      this.$emit("enter", e);
    },
    // 内容改变
    handleChange(e) {
      this.$emit("change", e);
    },
    // 获取焦点
    handleFocus(e) {
      this.$emit("focus", e);
    },
    // 失去焦点
    handleBlur(e) {
      this.$emit("blur", e);
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.ant-input) {
  background: var(--secondary-bg);
}

</style>
