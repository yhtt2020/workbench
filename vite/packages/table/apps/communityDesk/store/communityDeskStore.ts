// 社群桌面数据
import { defineStore } from "pinia";
import _ from "lodash-es";
import archiveHelper from "../../../js/lib/archiveHelper";
import { message } from "ant-design-vue";
import { cardStore } from "../../../store/card";

message.config({
  maxCount: 1,
});
const communityNavAppId = "c100001";
// 社群桌面列表的缓存key
const communityDeskAll = "deskList";
// 社群桌面详情缓存key
const communityDeskDetail = "deskDetail";

// @ts-ignore
export const communityDeskStore = defineStore("communityDesk", {
  state: () => ({
    // 指定社群中的所有桌面列表(用于云端存储)
    communityDesk: {
      communityDeskNo: "",
      // 社群桌面列表 结构 {name:"桌面名称",deskId:"桌面id"} 用于云端存档
      communityAllDesk: [],
      // 社群桌面数据详情  结构 { deskId:'桌面id',cards:'桌面卡片数据',}
      communityAllDeskDetail: {},
    },

    // 云端返回的社群桌面数据
    syncDesk: {
      desks: [],
      deskDetail: {},
    },

    setting: {
      // 云端同步时间
      getSyncTime:  Date.now(),
      saveSyncTime: Date.now(),
    },
  }),

  actions: {
    // 设置当前桌面数据
    setCurrentDeskNo(data: any) {
      // console.log("设置当前桌面数据", data);
      this.communityDesk.communityDeskNo = data;
    },

    // 设置当前指定社群所有桌面列表
    setCurrentDeskAllList(list: any) {
      const mapList = _.map(list, (desk: any) => {
        return {
          name: desk.name,
          id: desk.id,
        };
      });
      this.communityDesk.communityAllDesk = mapList;
    },

    setCurrentDeskData(currentDesk: any) {
      this.communityDesk.communityAllDeskDetail = currentDesk;
    },

    // 存储当前社群名下的所有桌面列表
    async saveCommunityDesk(force = 0) {
      const communityNo = this.communityDesk.communityDeskNo;
      // 将当前社群名下的所有桌面列表进行云端存储
      let deskAllProm = archiveHelper
        .saveToCommunity(
          communityNo,
          communityNavAppId,
          {
            desksAll: this.communityDesk.communityAllDesk,
            _v: Date.now(),
          },
          force,
          communityDeskAll
        )
        .then((res: any) => {
          return res;
        });
      // 桌面详情的缓存key
      const saveKey = `${communityDeskDetail}${this.communityDesk.communityAllDeskDetail.id}`;
      // 将当前社群名下选中的桌面详情进行云端存储
      let deskDetailProm = archiveHelper
        .saveToCommunity(
          communityNo,
          communityNavAppId,
          {
            deskDetail: this.communityDesk.communityAllDeskDetail,
            _v: Date.now(),
          },
          force,
          saveKey
        )
        .then((res: any) => {
          return res;
        });

      // 存储返回的结果 返回一个数组;
      const res = await Promise.all([deskAllProm, deskDetailProm]);
      const rs = res[0] || res[1];
      this.setting.saveSyncTime = res[1].data.updateTime;
      if (rs.status) {
        message.success("保存成功，并已为您自动同步至云端。");
      } else if (rs.code === 401) {
        message.error("保存失败，原因：" + rs.info);
      } else if (rs.code === 404) {
        message.error("保存失败，原因：" + rs.info);
      } else {
        (window as any).$ui.confirm(
          "同步助手",
          `保存失败，由于${rs.data?.userInfo?.nickname}正在编辑存档，故无法同步，是否强制同步？此操作将强制写入数据，可能导致存储内容丢失。`,
          {
            ok: async () => {
              let result = await this.syncCommunityDesk(1);
              const newRes = result[0] || result[1];
              if (newRes.status) {
                message.success("数据强制保存成功。");
              } else {
                message.error("强制保存失败。");
              }
            },
          }
        );
      }
    },

    // 读取当前社群名下云端存储的所有桌面列表
    async loadCommunityDeskAll() {
      const communityNo = this.communityDesk.communityDeskNo;
      const rs = await archiveHelper.loadFromCommunity(
        communityNo,
        communityNavAppId,
        communityDeskAll
      );
      if (rs.status) {
        const archiveData = rs.data?.data;
        if (archiveData.desksAll) {
          this.syncDesk.desks = archiveData?.desksAll;
        }
        this.setting.getSyncTime = rs.data.updateTime;
      } else {
        if (rs.code === 404) {
          // 获取过滤出当前社群的本地桌面数据。
          const localDesks = this.getLocalDesks();
          this.syncDesk.desks = localDesks;
          this.setting.getSyncTime = "";
        }
      }
    },

    // 读取当前社群名下云端存储的桌面详情
    async loadCommunityDeskDetail(deskId: any) {
      const communityNo = this.communityDesk.communityDeskNo;
      // 桌面详情的缓存key
      const loadKey = `${communityDeskDetail}${deskId}`;
      const rs = await archiveHelper.loadFromCommunity(
        communityNo,
        communityNavAppId,
        loadKey
      );
      
      if (rs.status) {
        const archiveData = rs.data?.data;
        if (archiveData.deskDetail) {
          this.syncDesk.deskDetail = archiveData?.deskDetail;
        }
        this.setting.getSyncTime = rs.data.updateTime;
      } else {
        if (rs.code === 404) {
          // 根据当前桌面id从本地桌面数据进行详情桌面数据获取
          const localDesks = this.getLocalDesks();
          const found = _.find(localDesks, (item: any) => {
            return String(item.id) === String(deskId);
          });
          if (found) {
            this.syncDesk.deskDetail = found;
          }
          this.setting.getSyncTime = "";
        }
      }
    },

    // 读取本地所有桌面列表数据
    getLocalDesks() {
      const communityNo = this.communityDesk.communityDeskNo;
      //  从本地的桌面数据进行获取,并且过滤出当前社群所有本地桌面数据。
      const list = (cardStore() as any).$state.desks;
      const filterList = _.filter(list, (item: any) => {
        if (item.communityNo) {
          return Number(item.communityNo) === Number(communityNo);
        }
      });
      return filterList;
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: [
          "communityDesk",
          "syncDesk",
          "setting",
        ],
        storage: localStorage,
      },
    ],
  },
});
