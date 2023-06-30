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
        v-for="(item, index) in list"
        :key="item[value]"
        :value="item[value]"
        :style="[fontSizeStyle, marginRightStyle]"
        >{{ item[name] }}</a-radio
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
    // 自定义显示的标题 填空会隐藏
    text: {
      type: String,
      default: "小组件尺寸",
    },
    // 控制
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
