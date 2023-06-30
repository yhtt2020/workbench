<template>
  <div class="text-base" style="margin: 12px 0">小组件尺寸</div>
  <a-radio-group class="my-3" v-model:value="select">
    <a-radio
      v-for="item in list"
      :key="item.value"
      :value="item.value"
      :style="{ fontSize: `${fontSize}px` }"
      >{{ item.name }}</a-radio
    >
  </a-radio-group>
 
</template>

<script>
export default {
  watch: {
    select(newV) {
        // 
      // 执行回调
      this.$emit("onChange", newV);
      // 更新双向绑定
      this.$emit("update:data", newV);
    },
  },
  data() {
    return {
      select: this.data,
    };
  },
  props: {
    isActive: {
      type: String,
      default: "",
    },
    fontSize: {
      type: Number,
      default: 18,
    },
    data: {
      type: String,
      default: "card small",
    },
    list: {
      type: Array,
      default: () => {
        return [
          { name: "2 x 4", value: "card small" },
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

<style lang="scss" scoped>
</style>
