<template>
  <a-input
    class="rounded-xl xt-bg-2 pl-2"
    :class="border"
    v-model:value="searchValue"
    :placeholder="placeholder"
  >
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
};
</script>

<style lang="scss" scoped></style>
