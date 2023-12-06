<template>
  <div>
    <!-- 应用数量 和 全选按钮 -->
    <div v-if="isSelect" class="flex justify-between items-center mb-3">
      <div>总共 {{ appsLenght }} 个文件</div>
      <XtButton type="theme" @click="selectAllApp()">
        {{ selectAll }}
      </XtButton>
    </div>
    <div
      class="flex h-full flex-wrap overflow-y-auto xt-container mt-3"
      :style="[heightStyle, widthStyle]"
      style="align-content: flex-start"
    >
      <div
        v-for="(item, index) in data"
        class="mx-2 mb-4 rounded-xl flex flex-col items-center justify-center cursor-pointer text-xs"
        style="width: 125px; height: 125px"
        @click="selectApp(item, index)"
        :style="[isSelected(index)]"
      >
        <a-avatar :size="52" shape="square" :src="renderIcon(item.icon)"></a-avatar>
        <div class="w-full text-center truncate mt-3">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { taskStore } from "../../../../apps/task/store";
import { mapWritableState } from "pinia";
import {renderIcon} from '../../../../js/common/common'
export default {
  inject: ["width", "height"],
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
    // 这里是m02014的步骤
    step(newV) {
      if (newV == 4 && this.taskID == "M0201") {
        this.selectApp(this.data[0], 0);
        this.selectApp(this.data[1], 1);
        this.step++
      }
    },
  },
  computed: {
    ...mapWritableState(taskStore, ["taskID", "step"]),
    // 全选状态
    selectAll() {
      if (
        this.selectAppsLength &&
        this.selectAppsLength == this.appsLenght &&
        this.isSelectedArr[this.name] !== true
      ) {
        this.isSelectedArr[this.name] = !this.isSelectedArr[this.name];
        return "取消全选";
      }
      return this.isSelectedArr[this.name] ? "取消全选" : "全选";
    },
    // 选中数组长度
    selectAppsLength() {
      return this.selectApps[this.name]
        ? this.selectApps[this.name].length
        : "";
    },
    // 数组总长度
    appsLenght() {
      let length = this.data ? this.data.length : "";
      return length;
    },
    heightStyle() {
      return {
        height: this.height() + "px",
      };
    },
    widthStyle() {
      return {
        width: this.width() + "px",
      };
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
    renderIcon,
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
// @import "./index.scss";
</style>
