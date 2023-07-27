<template>
  <div>
    <a-radio-group v-model:value="select" :size="size">
      <a-space :size="space">
        <a-radio
          v-for="(item, index) in list"
          :key="item[`${value}`]"
          :value="item[`${value}`]"
          :style="[fontSizeStyle]"
          >{{ item[`${name}`] }}</a-radio
        >
      </a-space>
    </a-radio-group>
  </div>
</template>

<script>
const sizeList = ["large", "default", "small"];
export default {
  name: "XtRadio",
  watch: {
    select(newV) {
      // 执行回调
      this.$emit("onChange", newV);
      // 更新双向绑定
      this.$emit("update:data", newV);
    },
  },
  computed: {
    fontSizeStyle() {
      return {
        fontSize: `${this.fontSize}px`,
      };
    },
  },
  data() {
    return {
      select: this.data,
    };
  },
  props: {
    // 自定义绑定数组显示的内容
    name: {
      type: String,
      default: "name",
    },
    // 自定义绑定的值
    value: {
      type: String,
      default: "value",
    },
    space: {
      type: Number,
      default: 0,
    },
    data: {
      type: String,
      default: "card small",
    },
    size: {
      type: String,
      default: "large",
      validator(val) {
        const state = sizeList.includes(val);
        if (!state) {
          console.error(`你的 size 必须是 ${sizeList.join(" ")}`);
        }
        return val;
      },
    },
    list: {
      type: Array,
      default: () => {
        return [
          { name: "2 x 2", value: "card small" },
          { name: "2 x 4", value: "card" },
          { name: "4 x 2", value: "card1" },
          { name: "4 x 4", value: "card double" },
        ];
      },
      validator: (val) => {
        if (!Array.isArray(val)) {
          console.error(`list 必须是一个数组`);
          return false;
        }

        const res = val.every(
          (item) => typeof item === "object" && item !== null
        );
        if (!res) {
          console.error(`list 包含的元素必须是对象`);
        }
        return res;
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
