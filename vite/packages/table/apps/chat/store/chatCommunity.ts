// 社群数据存储文件
import { defineStore } from "pinia";
import { CommunityAPI } from "../api/communityAPI";
import _ from "lodash-es";
import { chatList } from "../../../js/data/chatList";
import { currentUnreadCount } from "../hooks/groupType";

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
      // 开启侧边栏悬浮模式
      suspendVisible: {
        enable: false,
        no: null,
      },
      // 是否开启社群简介折叠
      collapsedVisible: {
        enable: false,
        no: null,
      },
    },
    // 热门社群列表
    hotList: [],
    // 官方推荐社群列表
    officialList: [],
    // 默认官方社群数据
    defaultOfficialList: chatList,
    communityTreeList: {
      // 父级树状
      firstChannel: [],
      // 子级树状
      secondaryChannel: [],
    },
    // 社群父级频道目录
    categoryList: [],
    // 当前社群详情
    currentCommunity: null,
  }),

  actions: {
    // 初始化加载获取我的社群方法
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
    // 设置悬浮模式
    setSuspendVisible(data: any) {
      this.setting.suspendVisible = data;
    },
    // 设置单双列模式
    setColumnMode() {
      this.setting.isColumnMode = !this.setting.isColumnMode;
    },
    // 设置社群描述折叠
    setCollapsed(data: any) {
      this.setting.collapsedVisible = data;
    },
    // 获取树状方法
    getCommunityTree(no: any) {
      const option = { communityNo: parseInt(no), cache: 1 };
      Promise.all([
        comAPI.getCommunityListChannel(option),
        comAPI.getCommunityTreeListChannel(option),
      ]).then((res) => {
        const status = res[0].status === 1 && res[1].status === 1;
        if (status) {
          // console.log('tree1',res[0].data.list);
          console.log('tree',res);
          /**处理一级频道列表**/
          const firstList = _.map(res[0].data.list, (item: any) => {
            if (item.type === "group") {
              const groupID = JSON.parse(item?.props)?.groupID;
              return {
                ...item,
                props: JSON.parse(item?.props),
                unreadCount: currentUnreadCount(groupID),
              };
            } else {
              return {
                ...item,
                props: JSON.parse(item?.props),
              };
            }
          });
          const filterList = _.filter(firstList, function (item: any) {
            return item.role === "channel" && item.parentId === 0;
          });
          this.communityTreeList.firstChannel = filterList;
          /**处理二级频道列表**/
          const secondaryList = _.map(res[1].data.treeList, (item: any) => {
            const childrenList = _.map(item.children, (children: any) => {
              if (item.type === "group") {
                const groupID = JSON.parse(children.props)?.groupID;
                return {
                  ...item,
                  props: JSON.parse(item?.props),
                  unreadCount: currentUnreadCount(groupID),
                };
              } else {
                return {
                  ...children,
                  props: JSON.parse(children.props),
                };
              }
            });
            return {
              ...item,
              children: childrenList,
              /**key 开启折叠**/
              key: ["1"],
            };
          });
          const filterSecondaryList = _.filter(
            secondaryList,
            function (item: any) {
              return item.role !== "channel";
            }
          );
          this.communityTreeList.secondaryChannel = filterSecondaryList;
        }
      });
    },
    // 删除社群频道
    async deleteChannel(id: any, no: any) {
      const option = { id: id };
      const res = await comAPI.deleteCommunityChannel(option);
      if (res.status) {
        this.getCommunityTree(no);
        return res;
      }
    },
    // 获取社群父级频道目录
    getCategoryList(no: any) {
      const option = { communityNo: parseInt(no) };
      comAPI.getCommunityListChannel(option).then((res: any) => {
        console.log("res", res);
        if (res.status) {
          const list = res.data.list;
          const filterCategory = _.filter(list, function (item: any) {
            return item.role === "category";
          });
          this.categoryList = filterCategory;
        }
      });
    },
    // 获取某个社群的详细信息 
    // 注意:当前方法只能获取社群的基本信息,不能获取社群的权限角色信息
    async loadCurrentCommunity(no: any) {
      const res = await comAPI.getByNoDetail({ no: no });
      console.log("渠道详情", res);
      if (res.status === 1) {
        this.currentCommunity = res.data;
      }
    },
    // 排序更新
    sortUpdateList(list:any){
      this.categoryList = list;
    }
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
          "defaultOfficialList",
          "communityTreeList",
          "categoryList",
          "currentCommunity",
        ],
        storage: localStorage,
      },
    ],
  },
});
