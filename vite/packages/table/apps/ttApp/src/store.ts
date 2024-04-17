import { defineStore } from "pinia";
import { useSelectAll, useUninstall } from "./hooks";
import { message } from "ant-design-vue";

// @ts-ignore
export const useTTAppStore = defineStore("useTTAppStore", {
  state: () => ({
    // 代理的ttapp应用列表
    ttappList: [],
    // 代理的ttapp缓存数据
    ttappData: {},
    // 封装好的无界配置
    modal: {
      // 弹窗是否显示
      visible: false,
      id: "",
      // 弹窗任务
      list: [],
    },
  }),
  getters: {},
  actions: {
    /**
     * 查询应用
     */
    select(id?: string) {
      if (id) {
        return this.ttappList.find((item) => item.id === id);
      }
    },
    /**
     * 卸载应用
     */
    async uninstall(id: string) {
      let res = await useUninstall(id);

      if (res) {
        // 删除数据
        this.ttappList = this.ttappList.filter((item) => item.id !== id);
        this.removeData(id);
        message.success("卸载成功");
      } else {
        message.error("卸载失败");
      }
    },
    /**
     * 清除数据
     */
    clearData(id: string) {
      this.ttappData[id] = {};
    },
    // 删除数据
    removeData(id: string) {
      delete this.ttappData[id];
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["ttappList", "ttappData"],
        storage: localStorage,
      },
    ],
  },
});
