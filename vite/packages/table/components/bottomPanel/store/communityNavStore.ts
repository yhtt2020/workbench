import {defineStore} from "pinia";
import {nanoid} from "nanoid";
import archiveHelper from "../../../js/lib/archiveHelper";
import {message} from "ant-design-vue";
import {appStore} from "../../../store";

const communityNavAppId = 'c100001'
// @ts-ignore
export const communityNavStore = defineStore("communityNav", {
  state: () => ({
    // 文件应用排序
    layOut: "rows",
    // 应用模式数据结构
    appModalList: [
      {
        name: "我的收藏",
        type: "like",
        rename: null,
      },
      {
        name: "全部",
        type: "all",
        rename: null,
        list: [],
      },
    ],
    // 应用模式下的下标
    appFolderIndex: 1,
    // 自动关闭窗口
    autoClose: false,
    // 社群导航-应用模式-设置模式-模式选择 (默认选中应用模式)
    settingType: "component",
    // 开启自定义图标背景色
    switchColor: false,
    // 默认选择文件类型的全部
    fileType: "all",
    // 在多个群聊的情况下，当前选中的群聊和选中的下标
    currentCommunity: {
      item: {
        value: "task",
        name: "想天官方社群",
        icon: "/icons/logo128.png",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(11),
      },
      defaultItem: {
        icon: "/logo/community.svg",
      },
      index: null,
    },
    // 选中当前桌面的id,来获取当前桌面的数据
    currentDesk: {
      id: null,
      desk:null,
      saveTime:'',
    },
  }),

  actions: {
    // 将当前选中的社群数据和选中的下标进行解构存储到store
    setCurrentCommunity(item: any, index: any) {
      const {communityInfo} = item;
      const optionItem = {
        ...communityInfo,
        value: "task",
        name: communityInfo?.name,
        icon: communityInfo?.icon,
        bg: "",
        isBg: false,
        mode: "app",
        type: "chat",
        id: nanoid(11),
        role: item.role,
        no: communityInfo?.no,
      };
      this.currentCommunity.item = optionItem;
      this.currentCommunity.index = index;
    },
    /**
     * 检查权限，目前只查是否是群主
     * @param communityInfo
     */
    checkWriteAuth() {
      // console.log(this.currentCommunity, '当前社群', this.currentCommunity.item.ownerUid, appStore().userInfo?.uid)
      return this.currentCommunity.item.ownerUid === appStore().userInfo?.uid
    },
    checkSettingAuth() {
      return this.currentCommunity.item.ownerUid === appStore().userInfo?.uid
    },

    async saveCommunityNav(force = 0) {
      let rs = await archiveHelper.saveToCommunity(
        this.currentCommunity.item.no,
        communityNavAppId,
        {
          navData: this.appModalList.filter((item, index) => {
              return index > 0
            },

          ),
          settings: {
            layOut: this.layOut,
            settingType: this.settingType,
            autoClose: this.autoClose,
          },
          currentCommunityDesk:this.currentDesk.desk,
          _v:Date.now()
        },
        force,
        'main'
      )
      if (rs.status) {
        message.success('保存成功，并已为您自动同步至云端。')
      } else if (rs.code === 401) {
        message.error('保存失败，原因：' + rs.info)
      } else if (rs.code === 404) {
        message.error('保存失败，原因：' + rs.info)
      } else {
        (window as any).$ui.confirm(
          '同步助手',
          '保存失败，由于 ' + rs.data?.userInfo?.nickname + ' 正在编辑存档，故无法同步，是否强制同步？此操作将强制写入数据，可能导致存储内容丢失。',
          {
            ok: async () => {
              let rs = await this.saveCommunityNav(1)
              if (rs.status) {
                message.success('数据强制保存成功。')
              } else {
                message.error('强制保存失败。')
              }
            }
          }
        )
      }
      return rs
    },
    async loadCommunityNav() {
      // console.log('当前社群', this.currentCommunity)
      let rs = await archiveHelper.loadFromCommunity(this.currentCommunity.item.no, communityNavAppId, 'main')
      //{settings,navData}
      // console.log('获取到的社群导航', rs)
      if (rs.status) {
        //
        let archiveData = rs.data.data
        if (archiveData.navData) {
          this.appModalList =
            [
              {
                name: "我的收藏",
                type: "like",
                rename: null,
              },
              ...archiveData.navData
            ]
        } else {
          this.appModalList[1].list = []
        }

        if (archiveData.settings) {
          this.layOut = archiveData.settings.layOut
          this.settingType = archiveData.settings.settingType
          this.autoClose = archiveData.settings.autoClose
        }

      } else {
        if (rs.code === 404) {
          //还未初始化存档
          this.appModalList = [
            {
              name: "我的收藏",
              type: "like",
              rename: null,
            },
            {
              name: "全部",
              type: "all",
              rename: null,
              list: [],
            },
          ]
        }
        return rs
      }
    },

    /**当前社群桌面数据**/ 
    updateCurrentDesk(data:any){
      this.currentDesk.desk = data;
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: [
          "layOut",
          "appModalList",
          "appFolderIndex",
          "settingEnable",
          "settingType",
          "switchColor",
          "currentCommunity",
          "currentDesk",
        ],
        storage: localStorage,
      },
    ],
  },
});
