<template>
  <div class="w-full h-full no-darg">
    <a-input
      class="xt-text w-full no-darg h-full"
      :placeholder="placeholder"
      v-model:value="searchValue"
      @input="handleInput()"
      @keydown.enter.exact.prevent="handleEnter()"
      @focus="handleFocus()"
      @blur="handleBlur()"
      @change="handleChange()"
      @keyup="handleKeyUp()"
    >
      <template #addonBefore> <slot name="addonBefore"></slot></template>
      <template #addonAfter> <slot name="addonAfter"></slot> </template>
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix> <slot name="suffix"></slot></template>
    </a-input>
    <!--  style="height: 48px"
  :style="[fontSizeStyle]" :class="border" v-model:value="computeList[index]"
  @focus="handleFocus(index)" @change="handleChange()" @blur="handleBlur(index)" -->
  </div>
</template>

<script>
export default {
  computed: {},
  data() {
    return {
      searchValue: this.data,
    };
  },
  props: {
    data: {},
    placeholder: {
      default: "",
    },
    type: {
      default: "",
    },
  },
  methods: {
    limitNumericInput(event) {
      // 如果设置了 numeric 属性为 true，则对输入进行数字限制
      const regex = /^\d*$/;
      if (!regex.test(event.target.value)) {
        event.preventDefault(); // 阻止默认输入行为
        this.searchValue = event.target.value.replace(/\D/g, ""); // 过滤掉非数字字符
      }
    },
    handleInput(event) {
      if (this.type == "number") {
        this.limitNumericInput(event);
      }
      this.$emit("input", event);
    },
    handleEnter(event) {
      this.$emit("enter", event);
    },
    handleFocus(event) {
      this.$emit("focus", event);
    },
    handleBlur(event) {
      this.$emit("blur", event);
    },
    handleChange(event) {
      this.$emit("change", event);
    },
    handleKeyUp(event) {
      this.$emit("keyup", event);
    },
  },
  watch: {
    searchValue(newV) {
      this.$emit("update:data", newV);
    },
    data(newV) {
      if (newV !== this.searchValue) {
        this.searchValue = newV;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.ant-input-group-addon) {
  background: none;
  padding: 0;
  border: 0;
}
:deep(.ant-input) {
  &:focus {
    box-shadow: none;
  }
  border: none;
  background: none;
  font-size: 16px !important;
}
:deep(.ant-input-affix-wrapper) {
  height: 100%;
  background: none;
  border: 0;
  box-shadow: none;
}
:deep(.ant-input-group) {
  height: 100%;
}
</style>
