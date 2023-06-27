<template>
  <!-- 应用数量 和 全选按钮 -->
  <div v-if="isSelect" class="flex justify-between items-center mb-3">
    <div>已选 {{ selectApps.length }} 个应用图标</div>
    <div class="xt-active-btn h-12 w-120" @click="selectAllApp()">
      {{ selectAll }}
    </div>
  </div>
  <div
    class="flex h-full flex-wrap overflow-y-auto xt-container mt-3"
    style="align-content: flex-start; width: 566px; height: 410px"
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
</template>

<script>
export default {
  props: {
    data: {},
    isSelect: {},
  },
  data() {
    return {
      selectApps: [],
      selectedIndexes: [],
      isSelectedAll: true,
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
      return this.isSelectedAll ? "全选" : "取消全选";
    },
  },
  methods: {
    selectAllApp() {
      this.cancelAll();
      this.isSelectedAll = !this.isSelectedAll;
      if (!this.isSelectedAll) {
        for (let i = 0; i < this.data.length; i++) {
          this.toggleSelect(i);
          this.selectApps.push(this.data[i]);
        }
      }
    },
    // 取消全选
    cancelAll() {
      this.selectApps = [];
      this.selectedIndexes = [];
    },
    // 选择app
    selectApp(item, index) {
      let state = false;
      this.toggleSelect(index);
      for (let i = 0; i < this.selectApps.length; i++) {
        if (this.selectApps[i].name === item.name) {
          this.selectApps.splice(i, 1);
          state = true;
        }
      }
      if (state) return;
      this.selectApps.push(item);
    },
    toggleSelect(index) {
      if (this.isSelected(index)) {
        this.selectedIndexes = this.selectedIndexes.filter((i) => i !== index); // 取消选中
      } else {
        this.selectedIndexes.push(index); // 添加选中
      }
    },
    isSelected(index) {
      let flag = this.selectedIndexes.includes(index); // 判断索引是否在选中数组中
      if (flag) {
        return {
          border: "1px solid var(--active-bg)",
          background: "var(--active-secondary-bg)",
        };
      } else {
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
