import { defineStore } from "pinia";
import { useSelectAll, useUninstall } from "./hooks";
import { message } from "ant-design-vue";

// @ts-ignore
export const useTTAppStore = defineStore("useTTAppStore", {
  state: () => ({
    // 代理的ttapp已存在数据
    ttappList: [],
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
     * 初始化ttapp数据
     */
    init() {
      if (this.ttappList.length > 0) return;
      this.selectAll();
    },
    /**
     * 查询所有数据
     */
    async selectAll() {
      let res: any = await useSelectAll();
      this.ttappList = res.map((item) => {
        let data = JSON.parse(item.data);
        return data;
      });
    },
    /**
     * 查询一条数据
     */
    select(id: string) {
      return this.ttappList.find((item) => item.id === id);
    },
    /**
     * 卸载一条数据
     */
    async uninstall(id: string) {
      let res = await useUninstall(id);
      if (res) {
        message.success("卸载成功");
        this.selectAll();
      } else {
        message.error("卸载失败");
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["ttappList"],
        storage: localStorage,
      },
    ],
  },
});
