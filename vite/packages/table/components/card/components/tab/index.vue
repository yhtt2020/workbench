<template>
  <div class="w-full h-full xt-bg-2 rounded-xl flex duration-500 my-2 p-1">
    <div
      v-for="item in list"
      class="flex-1 flex justify-center items-center cursor-pointer"
      :class="{ 'xt-active-btn': valueData == item[value] }"
      @click="valueData = item[value]"
    >
      {{ item[name] }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valueData: "",
    };
  },
  mounted() {
    this.valueData = this.data || this.list[0][this.value] || "";
  },
  watch: {
    valueData(newV) {
      this.$emit("update:data", newV);
    },
  },
  props: {
    data: {
      type: String,
      default: "card small",
    },
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
