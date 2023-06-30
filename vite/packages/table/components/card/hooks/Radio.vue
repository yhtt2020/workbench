<template>
  <div>
    <div v-if="text" class="text-base" style="margin: 12px 0">{{ text }}</div>
    <a-radio-group
      class=""
      v-model:value="select"
      :size="size"
      :style="[marginYStyle]"
    >
      <a-radio
        v-for="item in list"
        :key="item.value"
        :value="item.value"
        :style="[fontSizeStyle, marginRightStyle]"
        >{{ item.name }}</a-radio
      >
    </a-radio-group>
  </div>
</template>

<script>
const sizeList = ["large", "default", "small"];
export default {
  watch: {
    select(newV) {
      // 执行回调
      this.$emit("onChange", newV);
      // 更新双向绑定
      this.$emit("update:data", newV);
    },
  },
  computed: {
    marginYStyle() {
      return {
        margin: `${this.marginY}px 0`,
      };
    },
    fontSizeStyle() {
      return {
        fontSize: `${this.fontSize}px`,
      };
    },
    marginRightStyle() {
      return {
        marginRight: `${this.marginR}px`,
      };
    },
  },
  data() {
    return {
      select: this.data,
    };
  },
  props: {
    text: {
      type: String,
      default: "小组件尺寸",
    },
    marginR: {
      type: Number,
      default: 20,
    },
    marginY: {
      type: Number,
      default: 12,
    },
    fontSize: {
      type: Number,
      default: 16,
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
        let res = val.every((item) => "name" in item && "value" in item);
        if (!res) {
          console.error(`你的 list 数组必须包含 name 和 value 属性`);
        }
        return res;
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
