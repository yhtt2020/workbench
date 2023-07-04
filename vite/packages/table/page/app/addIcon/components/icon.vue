<template>
  <div>
    <div class="w" style="height: 100%">
      <slot></slot>
    </div>
    <!-- 应用数量 和 全选按钮 -->
    <div v-if="isSelect" class="flex justify-between items-center mb-3">
      <div>总共 {{ appsLenght }} 个应用图标</div>
      <div class="xt-active-btn h-12 w-120" @click="selectAllApp()">
        {{ selectAll }}
      </div>
    </div>
    <div
      class="flex h-full flex-wrap overflow-y-auto xt-container mt-3 w h"
      style="align-content: flex-start"
    >
      <div
        v-for="(item, index) in data"
        class="mx-2 mb-4 rounded-xl flex flex-col items-center justify-center cursor-pointer text-xs"
        style="width: 125px; height: 125px"
        @click="selectApp(item, index)"
        :style="[isSelected(index)]"
      >
        <a-avatar :size="52" shape="square" :src="item.icon"></a-avatar>
        <div class="w-full text-center truncate mt-3">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {},
    isSelect: {},
    name: {
      default: "default",
    },
  },
  data() {
    return {
      selectApps: {},
      selectedIndexes: {},
      isSelectedArr: {},
    };
  },
  watch: {
    selectApps: {
      deep: true, //开启深度监听
      handler(newV, oldV) {
        this.$emit("updateSelectApps", this.selectApps);
      },
    },
  },
  computed: {
    selectAll() {
      return this.isSelectedArr[this.name] ? "取消全选" : "全选";
    },
    appsLenght() {
      let length = this.data ? this.data.length : "";
      return length;
    },
  },
  methods: {
    selectAllApp() {
      this.cancelAll();
      if (!this.isSelectedArr[this.name]) this.isSelectedArr[this.name] = false;
      this.isSelectedArr[this.name] = !this.isSelectedArr[this.name];
      if (this.isSelectedArr[this.name]) {
        for (let i = 0; i < this.data.length; i++) {
          this.toggleSelect(i);
          this.selectApps[this.name].push(this.data[i]);
        }
      }
    },
    // 取消全选
    cancelAll() {
      this.selectApps[this.name] = [];
      this.selectedIndexes[this.name] = [];
    },
    // 选择app
    selectApp(item, index) {
      let state = false;
      this.isSelectedArr[this.name] = false;
      // 二维数组不存在则开辟一个数组
      if (!this.selectApps[this.name]) this.selectApps[this.name] = [];
      this.toggleSelect(index);
      for (let i = 0; i < this.selectApps[this.name].length; i++) {
        if (this.selectApps[this.name][i].name === item.name) {
          this.selectApps[this.name].splice(i, 1);
          state = true;
        }
      }
      if (state) return;
      this.selectApps[this.name].push(item);
    },
    toggleSelect(index) {
      if (this.isSelected(index)) {
        // 二维数组不存在则开辟一个数组
        // if (!this.selectApps[this.name]) this.selectApps[this.name] = [];
        this.selectedIndexes[this.name] = this.selectedIndexes[
          this.name
        ].filter((i) => i !== index); // 取消选中
      } else {
        this.selectedIndexes[this.name].push(index); // 添加选中
      }
    },
    isSelected(index) {
      if (!this.selectedIndexes[this.name])
        this.selectedIndexes[this.name] = [];
      let flag = this.selectedIndexes[this.name].includes(index); // 判断索引是否在选中数组中
      if (flag) {
        return {
          border: "1px solid var(--active-bg)",
          background: "var(--active-secondary-bg)",
        };
      } else return;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
