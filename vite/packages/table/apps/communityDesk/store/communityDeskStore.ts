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
      getSyncTime: "",
      saveSyncTime: "",
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

      // console.log('打印-communityNo', communityNo);
      // console.log('打印-loadKey', communityDeskAll);

      archiveHelper
        .loadFromCommunity(communityNo, communityNavAppId, communityDeskAll)
        .then((rs: any) => {
          
          // console.log("获取桌面列表结果", rs);

          if (rs.status) {
            const archiveData = rs.data?.data;
            if (archiveData.desksAll) {
              this.syncDesk.desks = archiveData?.desksAll;
            }
            this.setting.getSyncTime = archiveData?._v;
          } else {
            if (rs.code === 404) {
              // 获取过滤出当前社群的本地桌面数据。
              const localDesks = this.getLocalDesks();
              this.syncDesk.desks = localDesks;
              this.setting.getSyncTime = "";
            }
          }
        });
    },

    // 读取当前社群名下云端存储的桌面详情
    async loadCommunityDeskDetail() {
      // 获取社群id
      const communityNo = this.communityDesk.communityDeskNo;

      // console.log('打印-communityNo',communityNo);

      // 桌面详情的缓存key
      const loadKey = `_${communityDeskDetail}${communityNo}`;

      // console.log('打印-loadKey', loadKey);

      archiveHelper
        .loadFromCommunity(communityNo, communityNavAppId, loadKey)
        .then((rs: any) => {
          
          // console.log("获取桌面详情结果", rs);

          if (rs.status) {
            const archiveData = rs.data?.data;
            if (archiveData.deskDetail) {
              // 排查本地桌面desks的数组是否存在云端编辑的数据
              const index = _.findIndex(
                (cardStore() as any).desks,
                (desk: any) => {
                  return String(archiveData?.deskDetail.id) === String(desk.id);
                }
              );
              if (index === -1) {
                (cardStore() as any).desks.unshift(archiveData?.deskDetail);
              }
              this.deleteMemberList(communityNo);
            }
            this.setting.getSyncTime = archiveData?._v;
          } else {
            if (rs.code === 404) {
              this.setting.getSyncTime = "";
            }
          }
        });
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


    // 删除成员旧数据
    deleteMemberList(communityNo:any){
      console.log('查看成员数据列表',this.syncDesk.desks);
      // const deskId = _.map(this.syncDesk.desks,(desk:any)=>{
      //   return desk.id;
      // });
      // (cardStore() as any).desks.forEach((desk:any,index:any)=> {
      //   if(desk.hasOwnProperty("communityNo")){
      //     if(Number(communityNo) === Number(desk.communityNo)){
      //       if(!deskId.includes(desk.id)){
      //         (cardStore() as any).desks.splice(index,1);
      //       }
      //     }
      //   }
      // });
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
