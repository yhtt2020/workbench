<template>
  <div class="w-full h-full no-darg" :class="typeCalss">
    <a-input
      ref="inputRef"
      spellcheck="false"
      class="xt-text w-full no-darg h-full"
      :class="typeCalss"
      :placeholder="placeholder"
      v-model:value="searchValue"
      @input="handleInput"
      @keydown.enter.exact.prevent="handleEnter"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keyup="handleKeyUp"
    >
      <template #addonBefore> <slot name="addonBefore"></slot></template>
      <template #addonAfter> <slot name="addonAfter"></slot> </template>
      <template #prefix> <slot name="prefix"></slot> </template>
      <template #suffix> <slot name="suffix"></slot></template>
    </a-input>
  </div>
</template>

<script>
export default {
  name: "XtInput",
  computed: {
    typeCalss() {
      if (this.type) {
        return "xt-bg-2  rounded-xl";
      }
    },
  },
  data() {
    return {
      searchValue: this.data,
    };
  },
  props: {
    type: {
      default: "default",
    },
    // 测试输入框状态
    text: {
      default: false,
    },
    focus: {
      default: false,
    },
    data: {},
    placeholder: {
      default: "",
    },
    limit: {
      default: () => {
        return {
          space: false, // 去除空格
          number: false, // 只能输入数字
        };
      },
    },
  },
  mounted() {
    if (this.focus) {
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    }
  },
  methods: {
    limitNumber(event) {
      this.searchValue = event.target.value.replace(/\D/g, "");
    },
    limitSpace(event) {
      this.searchValue = event.target.value.replace(/\s/g, "");
    },
    handleInput(event) {
      if (this.limit.space) {
        this.limitSpace(event);
      }
      if (this.limit.number) {
        this.limitNumber(event);
      }

      if (this.text) {
      }
      this.$emit("input", event);
    },
    handleEnter(event) {
      if (this.text) {
      }
      this.$emit("enter", event);
    },
    handleFocus(event) {
      if (this.text) {
      }
      this.$emit("focus", event);
    },
    handleBlur(event) {
      if (this.text) {
      }
      this.$emit("blur", event);
    },
    handleChange(event) {
      if (this.text) {
      }
      this.$emit("change", event);
    },
    handleKeyUp(event) {
      if (this.text) {
      }
      this.$emit("keyup", event);
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
