// 社群桌面数据
import { defineStore } from "pinia";
import _ from "lodash-es";
import archiveHelper from "../../../js/lib/archiveHelper";
import { message } from "ant-design-vue";

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
    syncCommunityDesk: {
      desks: [],
      deskDetail: {},
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
    async syncCommunityDesk(force = 0) {
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

      // 桌面详情的缓存可key
      const saveKey = `${communityDeskDetail}${this.communityDesk.communityAllDeskDetail.id}`;
      console.log('查看保存key',saveKey);
     
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
      console.log('保存返回结果',rs);
      
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

    // 获取当前社群名下云端存储的所有桌面列表
    async loadCommunityDeskAll() {
      const communityNo = this.communityDesk.communityDeskNo;
      const rs = await archiveHelper.loadFromCommunity(
        communityNo,
        communityNavAppId,
        communityDeskAll
      );
      console.log('获取桌面返回结果',rs);
      
      if (rs.status) {
        const archiveData = rs.data?.data;
        if (archiveData.desksAll) {
          this.syncCommunityDesk.desks = archiveData?.desksAll;
        }
      }
    },
    
    // 获取当前社群名下云端存储的桌面详情
    async loadCommunityDeskDetail(deskId:any){
      const communityNo = this.communityDesk.communityDeskNo;
      const loadKey = `${communityDeskDetail}${deskId}`;
      console.log('查看key',loadKey);
      
      const rs = await archiveHelper.loadFromCommunity(
        communityNo,
        communityNavAppId,
        loadKey
      );
      console.log('获取当前社群桌面',rs);
      if (rs.status) {
        const archiveData = rs.data?.data;
        if (archiveData.deskDetail) {
          this.syncCommunityDesk.deskDetail = archiveData?.deskDetail;
        }
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["communityDesk", "currentCommunityDesk", "syncCommunityDesk"],
        storage: localStorage,
      },
    ],
  },
});
