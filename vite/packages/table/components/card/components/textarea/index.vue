<template>
  <textarea
    class="xt-border rounded-xl xt-bg-2 p-2 xt-scrollbar"
    :class="border"
    style="
      resize: none;
      background-color: transparent;
      outline: 0px solid transparent;
      outline-offset: 0px;
    "
    v-model="searchValue"
    spellcheck="false"
    :placeholder="placeholder"
  ></textarea>
</template>

<script>
export default {
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
