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
      // 存储当前社群子频道目录中的选中状态
      selectCurrentChannel: null,
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
    // 当前右键下拉菜单的接收区域
    rightMenuItem:{},
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
                return String(item.cno) === String(find.cno);
              });
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
                menuVisible: true,
                top: ["tr", "blue", { icon: "fluent:pin-16-filled" }, 0],
              };
              if (index === -1 && item.role) {
                this.myCommunity.push(options);
              }
            }
          }
        }
      });
    },

    /**更新当前我的社群**/
    async updateMyCommunity(no: any) {
      const res = await comAPI.getMyCommunityList();
      if (res.status === 1) {
        const newList = _.filter(res?.data?.list, (item: any) => {
          return item.hasOwnProperty("communityInfo");
        });
        /**这一步是从this.myCommunity提取模拟添加的数据**/
        const oldIndex = _.findIndex(this.myCommunity, (item: any) => {
          return Number(item.cno) === Number(no);
        });
        /**获取新的数据进行替换**/
        const newIndex = _.findIndex(newList, (item: any) => {
          return Number(item.cno) === Number(no);
        });
        if (oldIndex > -1) {
          this.myCommunity.splice(oldIndex, 1);
          const data  = newList[newIndex];
          const options = {
            ...data,
            img: data.communityInfo?.icon,
            float: "",
            tab: `community_${data.communityInfo?.no}`,
            noBg: true,
            type: `community${data.cno}`,
            route: {
              name: "myCommunity",
              params: { no: data.communityInfo?.no },
            },
            menuVisible: true,
            top: ["tr", "blue", { icon: "fluent:pin-16-filled" }, 0],
          };
          this.myCommunity.push(options);
        }
      }
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
          console.log("tree", res);
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
    loadCurrentCommunity(data: any) {
      console.log('加载社群详情信息',data);
      if(data){
        this.currentCommunity  = data;
      }
    },
    // 排序更新
    sortUpdateList(list: any) {
      this.categoryList = list;
    },

    // 置顶排序
    topSort(no: any) {
      const mapTop = _.map(this.myCommunity, (item: any) => {
        if (Number(item.cno) === Number(no)) {
          return {
            ...item,
            top: ["tr", "blue", { icon: "fluent:pin-16-filled" }, 1],
          };
        } else {
          return item;
        }
      });
      mapTop.sort((a: any, b: any) => {
        if (Number(a.route.params.no) === Number(no)) {
          /**将id为指定值的元素置顶**/
          return -1;
        } else if (Number(b.route.params.no) === Number(no)) {
          return 1;
        } else {
          return 0;
        }
      });
      this.myCommunity = mapTop;
    },

    // 取消置顶排序
    unSetTopSort(no: any) {
      const mapUnSetTop = _.map(this.myCommunity, (item: any) => {
        if (Number(item.cno) === Number(no)) {
          return {
            ...item,
            top: ["tr", "blue", { icon: "fluent:pin-16-filled" }, 0],
          };
        } else {
          return item;
        }
      });
      mapUnSetTop.sort((a: any, b: any) => {
        if (Number(a.route.params.no) === Number(no)) {
          /**将id为指定值的元素放到末尾**/
          return 1;
        } else if (Number(b.route.params.no) === Number(no)) {
          return -1;
        } else {
          return 0;
        }
      });
      this.myCommunity = mapUnSetTop;
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
          "defaultOfficialList",
          "communityTreeList",
          "categoryList",
          "currentCommunity",
          "rightMenuItem",
        ],
        storage: localStorage,
      },
    ],
  },
});
