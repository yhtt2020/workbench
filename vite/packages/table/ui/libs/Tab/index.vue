<template>
  <!-- 23/8/21扩展tooltip适配 -->
  <!-- 外层容器 -->
  <div
    class="flex rounded-xl xt-container"
    :class="[mode == 'row' ? 'flex-row ' : 'flex-col', boxClass]"
    :style="[boxStyle]"
  >
    <!-- 循环渲染子项 -->
    <template v-for="item in list" :key="item[`${value}`]">
      <a-tooltip :placement="placement">
        <template #title v-if="item[`${tip}`]">{{ item[`${tip}`] }}</template>
        <div
          class="flex justify-center items-center rounded-xl text-base cursor-pointer"
          :class="[
            valueData === item[`${value}`] ? active : '',
            mode == 'row' ? 'flex-1 ' : '',
            itemClass,
          ]"
          :style="[itemStyle]"
          @click="valueData = item[`${value}`]"
        >
          <XtBaseIcon
            v-if="item[`${icon}`]"
            class="icon"
            style="font-size: 22"
            :icon="item[`${icon}`]"
          ></XtBaseIcon>
          <div v-if="item[`${name}`]" :class="[item[`${icon}`] ? 'ml-1' : '']">
            {{ item[`${name}`] }}
          </div>
        </div>
      </a-tooltip>
    </template>
  </div>
</template>

<script>
export default {
  name: "XtTab",
  data() {
    return {
      valueData: "", // 选中值
    };
  },
  mounted() {
    // 在组件挂载时设置初始选中值
    this.valueData = this.modelValue || this.list[0][`${this.value}`] || "";
  },
  watch: {
    valueData(newV) {
      // 监听选中值的变化，触发事件向父组件传递选中值
      this.$emit("update:modelValue", newV);
    },
  },
  props: {
    active: {
      type: String,
      default: "xt-active-btn",
    },
    placement: {
      default: "top",
    },
    // 动态添加外层盒子类名
    boxClass: {
      type: String,
      default: "",
    },
    boxStyle: {
      default: () => {
        return {};
      },
    },
    // 动态添加子项盒子类名
    itemClass: {
      type: String,
      default: "",
    },
    itemStyle: {
      default: () => {
        return {};
      },
    },
    // 调整 tab 的排列
    mode: {
      type: String,
      default: "row",
      validator: (val) => {
        if (val !== "row" && val !== "col") {
          console.error("mode 必须是 row 或者 col");
          return false;
        }
        return val;
      },
    },
    modelValue: {
      type: String,
      default: "card small",
    },
    // 自定义绑定数组显示的内容字段名
    name: {
      type: String,
      default: "name",
    },
    // 自定义绑定的值字段名
    value: {
      type: String,
      default: "value",
    },
    // 自定义绑定的 icon 名称字段名
    icon: {
      type: String,
      default: "icon",
    },
    // 自定义绑定的 icon 名称字段名
    tip: {
      type: String,
      default: "tip",
    },
    list: {
      type: Array,
      default: () => [
        { name: "2 x 2", value: "card small" },
        { name: "2 x 4", value: "card" },
        { name: "4 x 2", value: "card1" },
        { name: "4 x 4", value: "card double" },
      ],
      validator: (val) => {
        if (!Array.isArray(val)) {
          console.error("list 必须是一个数组");
          return false;
        }
        const res = val.every(
          (item) => typeof item === "object" && item !== null
        );
        if (!res) {
          console.error("list 包含的元素必须是对象");
        }
        return res;
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
