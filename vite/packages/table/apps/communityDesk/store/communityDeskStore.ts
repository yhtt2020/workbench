// 社群桌面数据
import { defineStore } from "pinia";
import _ from "lodash-es";
import archiveHelper from "../../../js/lib/archiveHelper";
import { message } from "ant-design-vue";

message.config({
  maxCount: 1,
});
const communityNavAppId = "c100001";
// @ts-ignore
export const communityDeskStore = defineStore("communityDesk", {
  state: () => ({
    // 指定社群中的所有桌面列表
    communityDesk: {
      communityDeskNo: "",
      // communityAllDesk是用于存档的列表  结构 {name:"桌面名称",deskId:"桌面id"}
      communityAllDesk: [],
    },

    // 当前桌面数据
    currentCommunityDesk: {},
  }),

  actions: {
    // 设置当前桌面数据
    setCurrentDeskNo(data: any) {
      console.log("设置当前桌面数据", data);
      this.communityDesk.communityDeskNo = data;
    },

    // 设置当前指定社群所有桌面列表
    setCurrentDeskAllList(list: any) {
      const mapList = _.map(list, (desk: any) => {
        return {
          name: desk.name,
          deskId: desk.id,
        };
      });
      console.log("当前社群名下所有列表", mapList);
      this.communityDesk.communityAllDesk = mapList;
    },

    // 设置当前选中桌面数据
    setCurrentDeskData(data: any) {
      console.log("设置当前选中桌面数据", data);
      this.currentCommunityDesk = data;
    },

    // 同步指定社群桌面数据
    async sysCommunityDesk(force: any = 0) {
      // 将当前指定社群名下所有桌面数据进行云端存储
      const communityNo = this.communityDesk.communityDeskNo;
      let allDeskPromise = archiveHelper
        .saveToCommunity(
          communityNo,
          communityNavAppId,
          {
            communityDesks: this.communityDesk,
            _v: Date.now(),
          },
          force,
          "communityDeskAll"
        )
        .then((rs: any) => {
          return rs;
        });
      // 将当前指定社群名下选中的桌面数据进行云端存储
      let currentDeskPromise = archiveHelper
        .saveToCommunity(
          communityNo,
          communityNavAppId,
          {
            currentDesk: this.currentCommunityDesk,
            _v: Date.now(),
          },
          force,
          "currentCommunityDesk"
        )
        .then((res: any) => {
          return res;
        });
      const rs = await Promise.all([allDeskPromise, currentDeskPromise]);
      console.log('同步结果',rs);
      
      const status = rs[0].status || rs[1].status;
      const code = rs[0].code || rs[1].code;
      const info = rs[0].info || rs[1].info;
      const userName =
        rs[0].data?.userInfo?.nickname || rs[1].data?.userInfo?.nickname;
      if (status) {
        message.success("保存成功，并已为您自动同步至云端。");
      } else if (code === 401) {
        message.error("保存失败，原因：" + info);
      } else if (code === 404) {
        message.error("保存失败，原因：" + info);
      } else {
        (window as any).$ui.confirm(
          "同步助手",
          "保存失败，由于 " +
            userName +
            " 正在编辑存档，故无法同步，是否强制同步？此操作将强制写入数据，可能导致存储内容丢失。",
          {
            ok: async () => {
              let rs = await this.sysCommunityDesk(1);
              if (rs[0].status || rs[1].status) {
                message.success("数据强制保存成功。");
              } else {
                message.error("强制保存失败。");
              }
            },
          }
        );
      }
    },

    // 加载指定社群桌面数据
    async loadCommunityDesk(){ 
      const communityNo = this.communityDesk.communityDeskNo;
      // 获取云端当前社群名下的所有桌面数据
      let loadDeskAll = archiveHelper.loadFromCommunity(communityNo,communityNavAppId,"communityDeskAll");
      let loadCurrentDesk = archiveHelper.loadFromCommunity(communityNo,communityNavAppId,"currentCommunityDesk");

      const rs = await Promise.all([loadDeskAll,loadCurrentDesk])
      console.log('测试',rs);

      if(rs[0].status || rs[1].status){
        let allDesk = rs[0].data?.data?.communityDesks;
        let currentDesk = rs[1].data?.data?.communityDesk;
        this.communityDesk = allDesk;
        this.currentCommunityDesk = currentDesk;
      }

      else {
        if (rs[0].code === 404 || rs[1].code === 404) {
          //还未初始化存档
          // this.appModalList = [
          //   {
          //     name: "我的收藏",
          //     type: "like",
          //     rename: null,
          //   },
          //   {
          //     name: "全部",
          //     type: "all",
          //     rename: null,
          //     list: [],
          //   },
          // ]
          // this.currentCommunityDesk = {};
        }
        return rs
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["communityDesk", "currentCommunityDesk"],
        storage: localStorage,
      },
    ],
  },
});
