import { defineStore } from "pinia";
import _ from "lodash-es";
import archiveHelper from "../../../js/lib/archiveHelper";
import { message } from "ant-design-vue";
import { cardStore } from "../../../store/card";

// 应用id
const communityNavAppId = "c100001";
// 社群桌面列表的缓存key
const COM_DESK_ALL = "DeskList";
// 社群桌面详情缓存key
const COM_DESK_DETAIL = "DeskDetail";

// @ts-ignore
export const communityDeskStore = defineStore("communityDesk", {
  state: () => ({
    // 存储桌面的本地数据
    saveDesk: {},
    // 存储当前社群的所有桌面列表
    saveDeskAll: [],
    // 存储当前社群编号和当前桌面的id (用于存储失败时,二次使用)
    saveDeskNo: "",
    saveDeskId: "",

    // 读取云端同步的当前桌面数据
    loadDesk: {},
    // 读取云端同步的所有桌面列表数据
    loadDeskAll: {},

    // 设置
    setting: {},
  }),
  actions: {
    /**
     * 设置数据
     * @param no        社群id
     * @param desk      当前桌面
     * @param deskList  当前社群所有桌面列表
     * @param freeData  当前桌面的自由布局数据
     * **/
    setCommunityDesktopData(no: any, desk: any, deskList: any, freeData: any) {
      // 解构
      const { freeLayoutData, freeLayoutState } = freeData;
      // 所有桌面列表
      const mapList = _.map(deskList, (desk: any) => {
        return {
          name: desk.name,
          id: desk.id,
        };
      });
      this.saveDeskAll = mapList;
      // 桌面id
      const id = desk.id;
      // 本地的社群id
      this.saveDeskNo = no;
      // 本地的桌面id
      this.saveDeskId = id;
      if (!this.saveDesk[no]) this.saveDesk[no] = {};
      // 管理员情况下的存储本地数据
      this.saveDesk[no][id] = {
        ...desk,
        freeLayoutData: freeLayoutData,
        freeLayoutState: freeLayoutState,
      };
    },

    /**
     * 上传社群同步所有桌面的列表数据
     * @param no 当前社群的id
     * @param force 是否重新存储
     * **/
    uploadCommunityAllDesktop(no: any, force: any) {
      const saveDeskList = archiveHelper.saveToCommunity(
        no,
        communityNavAppId,
        {
          desksAll: this.saveDeskAll,
          _v: Date.now(),
        },
        force,
        COM_DESK_ALL
      );
      saveDeskList.then((rs: any) => {
        if (rs?.status) {
          message.success("保存成功，并已为您自动同步至云端。");
          // 获取更新时间
          if (!this.setting[no]) return (this.setting[no] = {});
          this.setting[no] = { time: rs?.data?.archive?.updateTime };
        } else if (rs?.code === 401) {
          message.error("保存失败，原因：" + rs?.info);
        } else if (rs?.code === 404) {
          message.error("保存失败，原因：" + rs?.info);
        } else {
          (window as any).$ui.confirm(
            "同步助手",
            `保存失败，由于${rs.data?.userInfo?.nickname}正在编辑存档，故无法同步，是否强制同步？此操作将强制写入数据，可能导致存储内容丢失。`,
            {
              ok: async () => {
                let result = await this.uploadCommunityAllDesktop(
                  this.saveDeskNo,
                  1
                );
                if (result?.status) {
                  message.success("数据强制保存成功。");
                } else {
                  message.error("强制保存失败。");
                }
              },
            }
          );
        }
      });
    },

    /**
     * 上传社群同步当前桌面数据
     * @param no     当前社群的id
     * @param deskId 当前桌面的id
     * @param force 是否重新存储
     * **/
    uploadCommunityCurrentDesktop(no: any, deskId: any, force: any) {
      const saveDeskDetail = archiveHelper.saveToCommunity(
        no,
        communityNavAppId,
        {
          deskDetail: this.saveDesk[no][deskId],
          _v: Date.now(),
        },
        force,
        `_${COM_DESK_DETAIL}${no}`
      );
      saveDeskDetail.then((rs: any) => {
        if (rs?.status) {
          // 获取更新时间
          if (!this.setting[no]) return (this.setting[no] = {});
          this.setting[no] = { time: rs?.data?.archive?.updateTime };
        } else if (rs?.code === 401) {
          message.error("保存失败，原因：" + rs?.info);
        } else if (rs?.code === 404) {
          message.error("保存失败，原因：" + rs?.info);
        } else {
          (window as any).$ui.confirm(
            "同步助手",
            `保存失败，由于${rs.data?.userInfo?.nickname}正在编辑存档，故无法同步，是否强制同步？此操作将强制写入数据，可能导致存储内容丢失。`,
            {
              ok: async () => {
                let result = await this.uploadCommunityCurrentDesktop(
                  this.saveDeskNo,
                  this.saveDeskId,
                  1
                );
                if (result?.status) {
                  message.success("数据强制保存成功。");
                } else {
                  message.error("强制保存失败。");
                }
              },
            }
          );
        }
      });
    },

    /**
     * 下载(或读取)社群同步所有桌面数据
     * @param no     社群id
     * **/
    downloadCommunityAllDesktop(no: any) {
      const getDeskDataAll = archiveHelper.loadFromCommunity(
        no,
        communityNavAppId,
        COM_DESK_ALL
      );
      getDeskDataAll.then((rs: any) => {
        if (rs?.status === 1) {
          const { data } = rs?.data;
          this.loadDeskAll[no] = data?.desksAll;
          this.setting[no] = { time: data?._v };
        } else if (rs.code === 404) {
          this.loadDeskAll[no] = [];
          this.setting[no] = { time: Date.now() };
        }
      });
    },

    /**
     * 下载(或读取) 社群同步当前桌面数据
     * **/
    downloadCommunityCurrentDesktop(no: any,) {
      if (!this.loadDesk[no]) return (this.loadDesk[no] = {});
      const getDeskDetail = archiveHelper.loadFromCommunity(
        no,
        communityNavAppId,
        `_${COM_DESK_DETAIL}${no}`
      );
      getDeskDetail.then((rs: any) => {
        if (rs?.status) {
          const { data } = rs?.data;
          const someVisible = _.some(this.loadDeskAll[no], (item: any) => {
            return String(item?.id) === String(data?.deskDetail?.id);
          });
          
          if(someVisible){
            this.loadDesk[no][data?.deskDetail?.id] = data?.deskDetail;
          }
          this.setting[no] = { time: data?._v };
        }
      });
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: [
          "saveDesk",
          "saveDeskAll",
          "loadDesk",
          "saveDeskNo",
          "loadDeskAll",
          "saveDeskId",
        ],
        storage: localStorage,
      },
    ],
  },
});
