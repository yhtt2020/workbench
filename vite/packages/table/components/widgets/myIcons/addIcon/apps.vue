<template>
  <div class="mt-4 h-full">
    <!-- 应用数量 和 全选按钮 -->
    <div class="flex justify-between items-center mb-3">
      <div>总共{{ selectApps.length }}个Windwos系统桌面应用图标</div>
      <div class="xt-active-btn h-12 w-120" @click="selectAllApp()">
        {{ selectAll }}
      </div>
    </div>
    <!-- 空置状态 -->
    <div
      class="w-full flex flex-col justify-center items-center"
      style="height: calc(100% - 60px) !important"
      v-if="(myApps, length == 0 || flase)"
    >
      <CardState
        style="width: 100%; height: 130px"
        :bg="false"
        state="null"
        :zoom="26"
        :text="{ null: '暂无应用' }"
      >
      </CardState>
      <div
        class="xt-btn flex justify-center items-center h-12"
        style="width: 200px"
        @click="loadDeskIconApps()"
      >
        导入windows桌面应用
      </div>
    </div>
    <!-- 展示数据 -->
    <div
      v-else
      class="flex w-full flex-wrap overflow-y-auto container justify-between"
      style="height: calc(100% - 60px); border: 1px solid"
    >
      <div
        v-for="(item, index) in myApps"
        class="mb-3 rounded-xl flex flex-col justify-center items-center cursor-pointer text-xs"
        style="width: 125px; height: 125px"
        @click="selectApp(item, index)"
        :style="[isSelected(index)]"
      >
        <a-avatar :size="50" shape="square" :src="item.icon"></a-avatar>
        <div class="w-full text-center truncate">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import CardState from "../../../../components/card/cardState.vue";

import { appsStore } from "../../../../store/apps";
import { mapWritableState, mapActions } from "pinia";
export default {
  components: {
    CardState,
  },
  data() {
    return {
      selectApps: [],
      selectedIndexes: [],
      isSelectAll: true,
    };
  },
  computed: {
    ...mapWritableState(appsStore, ["myApps"]),
    selectAll() {
      return this.isSelectAll ? "全选" : "取消全选";
    },
  },
  methods: {
    ...mapActions(appsStore, ["addApps"]),
    selectAllApp() {
      this.isSelectAll = !this.isSelectAll;
      for (let i = 0; i < this.myApps.length; i++) {
        this.selectApp(this.myApps[i], i);
      }
    },
    // 选择app
    selectApp(item, index) {
      let state = false;
      this.toggleSelect(index);
      this.selectApps.forEach((app) => {});
      for (let i = 0; i < this.selectApps.length; i++) {
        if (this.selectApps[i].path === item.path) {
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
    async loadDeskIconApps() {
      this.myApps = [];
      const desktopApps = await ipc.sendSync("getDeskApps");
      this.addApps(desktopApps);
    },
  },
};
</script>

<style lang="scss" scoped></style>
