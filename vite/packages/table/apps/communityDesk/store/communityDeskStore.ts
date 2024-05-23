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

    // 云端读取读取返回的社群桌面数据
    syncDesk: {
      desks: [],
    },

    setting: {
      // 云端同步时间
      getSyncTime: Date.now(),
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
      this.communityDesk.currentList = list;
      this.communityDesk.currentList = list;
      this.communityDesk.communityAllDesk = mapList;
    },

    // 设置当前指定社群中所选中的桌面详情数据存储
    setCurrentDeskData(currentDesk: any) {
      this.communityDesk.communityAllDeskDetail = currentDesk;
    },

    // 保存当前社群名下的所有桌面列表
    async saveCommunityDesk(force = 0) {
      const communityNo = this.communityDesk.communityDeskNo;
      // 将当前社群名下的所有桌面列表进行云端存储
      const rs = await archiveHelper.saveToCommunity(
        communityNo,
        communityNavAppId,
        {
          desksAll: this.communityDesk.communityAllDesk,
          _v: Date.now(),
        },
        force,
        communityDeskAll
      );

      // console.log("返回社群当前所有桌面列表结果", rs);

      if (rs.status) {
        message.success("保存成功，并已为您自动同步至云端。");
        // 获取更新时间
        this.setting.saveSyncTime = rs?.data?.archive?.updateTime;
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
              if (result.status) {
                message.success("数据强制保存成功。");
              } else {
                message.error("强制保存失败。");
              }
            },
          }
        );
      }
    },

    // 保存当前社群名下所选中的桌面数据
    async saveCommunityDeskDetail(force = 0) {
      const communityNo = this.communityDesk.communityDeskNo;
      // 桌面详情的缓存key
      const saveKey = `_${communityDeskDetail}${communityNo}`;
      // 将当前社群名下选中的桌面详情进行云端存储
      const rs = await archiveHelper.saveToCommunity(
        communityNo,
        communityNavAppId,
        {
          deskDetail: this.communityDesk.communityAllDeskDetail,
          _v: Date.now(),
        },
        force,
        saveKey
      );

      // console.log("返回社群当前选中的桌面结果", rs);

      if (rs.status) {
        // message.success("保存成功，并已为您自动同步至云端。");
        // 获取更新时间
        this.setting.saveSyncTime = rs?.data?.archive?.updateTime;
        this.setting.saveSyncTime = rs?.data?.archive?.updateTime;
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
              let result = await this.saveCommunityDeskDetail(1);
              if (result.status) {
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
    loadCommunityDeskAll() {
      const communityNo = this.communityDesk.communityDeskNo;
      archiveHelper
        .loadFromCommunity(communityNo, communityNavAppId, communityDeskAll)
        .then((rs: any) => {
          if (rs.status) {
            const archiveData = rs.data?.data;
            if (archiveData.desksAll) {
              this.syncDesk.desks = archiveData?.desksAll;
            }
            this.setting.getSyncTime = archiveData?._v;
            this.loadCommunityDeskDetail();
          } else {
            if (rs.code === 404) {
              this.syncDesk.desks = [];
              this.setting.getSyncTime = Date.now();
            }
          }
        });
    },

    // 读取当前社群名下云端存储的桌面详情
    async loadCommunityDeskDetail() {
      // 获取社群id
      const communityNo = this.communityDesk.communityDeskNo;
      // 桌面详情的缓存key
      const loadKey = `_${communityDeskDetail}${communityNo}`;
      const getDeskDetail = archiveHelper.loadFromCommunity(
        communityNo,
        communityNavAppId,
        loadKey
      );
      getDeskDetail.then((rs:any)=>{
        if(rs.status){
          const archiveData = rs.data?.data?.deskDetail;
          if(archiveData){
            // 将id进行遍历返回
            const deskId = _.map(this.syncDesk.desks,(desk:any)=>{
              return desk?.id;
            });
            // 根据云端桌面列表进行检测存入本地的桌面列表中
            const existDeskId = _.some(deskId,(id:any)=>{
              return String(id) === String(archiveData?.id);
            })
            if(existDeskId){
              const index = _.findIndex((cardStore() as any).desks,(desk:any)=>{
                return String(desk.id) === String(archiveData?.id);
              });
              if(index === -1){
                (cardStore() as any).desks.unshift(archiveData);
              }
              else {
                (cardStore() as any).desks.splice(index,1,archiveData);
              }
            }
          }
          this.setting.getSyncTime = rs.data?.data?._v;

        }
      })
    },

    // 清除老数据
    clearDeskList(communityNo: any) {
      const deskList = (cardStore() as any).desks;
      // const deskId = _.map(this.syncDesk.desks, (desk: any) => {
      //   return desk?.id;
      // });
      deskList.forEach((desk: any, index: any) => {
        // 存在undefined的数据进行删除
        if(desk.id === undefined){
          (cardStore() as any).desks.splice(index,1);
        }
      });
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["communityDesk", "syncDesk", "setting"],
        storage: localStorage,
      },
    ],
  },
});
