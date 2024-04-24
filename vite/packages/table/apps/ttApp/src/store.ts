import {defineStore, mapActions} from "pinia";
import { useSelectAll, useUninstall } from "./hooks";
import { message } from "ant-design-vue";
import { appStore as useAppStore } from "../../../store";

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
      userId: "",
      userInfo: "",
    },
  }),
  getters: {},
  actions: {
    enterApp(id: string){
      let appInfo=this.select(id)
      if(!appInfo){
        console.error('应用不存在',id)
        return
      }
      let url='ttapp://'+appInfo.id+ appInfo.main.entry
      if(appInfo.main.entry.startsWith('http://')||appInfo.main.entry.startsWith('https://')){
        url=appInfo.main.entry
      }
      let app={
        theme:appInfo.theme_color,
        name: appInfo.name,
        url:url,
        background: false,
        node: true,
        security: false,
      }
      const appStore: any = useAppStore();
      appStore.openApp(app)
    },
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
    /** 获取作者信息 */
    async getUserInfo(id: string) {
      if (!id) {
        console.log("ID不能为空 :>> ");
        return;
      }
      //
      if (this.modal.userId == id) {
        return this.modal.userInfo;
      }
      //
      const appStore: any = useAppStore();
      let res = await appStore.getUserCard(2469);
      const { code, data } = res;
      if (code !== 200) {
        return;
      }
      const userInfo = {
        avatar: data.user.avatar,
        name: data.user.nickname,
      };
      this.modal.userId = id;
      this.modal.userInfo = userInfo;
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
