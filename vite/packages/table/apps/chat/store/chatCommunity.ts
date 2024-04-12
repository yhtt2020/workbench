// 社群数据存储文件
import { defineStore } from "pinia";
import { CommunityAPI } from "../api/communityAPI";
import _ from "lodash-es";

const comAPI: any = new CommunityAPI();
// @ts-ignore
export const chatCommunityStore = defineStore("chatCommunity", {
  state: () => ({
    // 我的社群
    myCommunity: [
      {
        img: "/icons/logo128.png",
        float: "",
        id: 0,
        noBg: true,
        tab: "OfficialCommunity",
        type: "OfficialCommunity",
        route: { name: "officialCommunity", params: { no: 1 } },
      },
    ],
    // 设置当前社群详情的社群号
    currentCommunityNo: null,
    // 设置
    setting: {
      // 开启单双列模式
      isColumnMode: false,
    },
    // 热门社群列表
    hotList: [],
    // 官方推荐社群列表
    officialList: [],
  }),

  actions: {
    // 获取我的社群方法
    getMyCommunity() {
      comAPI.getMyCommunityList().then((res: any) => {
        if (res.status === 1) {
          const list = res.data?.list;
          for (const item of list) {
            if (item.hasOwnProperty("communityInfo")) {
              const index = _.findIndex(this.myCommunity, function (find: any) {
                return String(item.id) === String(find.id);
              });
              if (index === -1) {
                const options = {
                  ...item,
                  img: item.communityInfo?.icon,
                  float: "",
                  tab: `community_${item.communityInfo?.no}`,
                  noBg: true,
                  type: `community${item.cno}`,
                  route: {
                    name: "myCommunity",
                    params: { no: item.communityInfo?.no },
                  },
                };
                this.myCommunity.push(options);
              }
            }
          }
        }
      });
    },
    // 设置当前社群的ID号
    setCurrentCommunityNo(no: any) {
      this.currentCommunityNo = no;
    },
    // 获取热门社群
    getHotCommunityList() {
      comAPI.getHotCommunity().then((res: any) => {
        if (res.status === 1) {
          const list = res.data?.list;
          this.hotList = list;
        }
      });
    },
    // 获取官方推荐社群
    getOfficialRecommendation() {
      comAPI.getReferralCommunity().then((res: any) => {
        if (res.status === 1) {
          const list = res?.data;
          for (const item of list) {
            const index = _.findIndex(this.officialList, function (find: any) {
              return Number(find.no) === Number(item.no);
            });
            if (index === -1) {
              this.officialList.push(item);
            }
          }
        }
      });
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: [
          "myCommunity",
          "currentCommunityNo",
          "setting",
          "hotList",
          "officialList",
        ],
        storage: localStorage,
      },
    ],
  },
});
