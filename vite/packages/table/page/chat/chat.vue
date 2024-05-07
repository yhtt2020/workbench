<template>
  <xt-left-menu :list="filterList" :index="index" last="3" end="2">
    <div class="w-full">
      <router-view></router-view>
    </div>
    <template v-for="item in filterList" #[item.float]>
      <CategoryFloat
        v-if="item.route?.params?.no !== 1"
        :no="item.route?.params?.no"
        @clickItem="currentItem"
      ></CategoryFloat>
      <DefaultFloat v-else></DefaultFloat>
    </template>
    <template #createCom>
      <GradeSmallTip
        powerType="createChat"
        :lastPowerType="limitClick"
        v-if="limitClick !== undefined"
      ></GradeSmallTip>
      <xt-new-icon icon="fluent:add-16-filled"></xt-new-icon>
    </template>
    <template #createChat>
      <GradeSmallTip
        :w="184"
        :h="44"
        powerType="createChat"
        :lastPowerType="limitClick"
        :limit="false"
      ></GradeSmallTip>
      <div class="flex items-center">
        <xt-ify-icon
          icon="fluent:emoji-smile-slight-24-filled"
          class="mr-3"
        ></xt-ify-icon>
        创建社群
      </div>
    </template>
  </xt-left-menu>

</template>

<script>
import {
  ref,
  reactive,
  toRefs,
  computed,
  onMounted,
  nextTick,
  watch,
  getCurrentInstance,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { Icon as ChatIcon } from "@iconify/vue";
import { communityStore } from "./store/communityStore";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";
import _ from "lodash-es";
import { communityTotal } from "../../apps/chat/hooks/utils";
import { completeTask } from "../../apps/task/page/branch/task";
import { useGlobalStore } from "../../apps/Global/store";

import CategoryFloat from "./components/float/CategorysFloat.vue";
import DefaultFloat from "./components/float/DefaultsFloat.vue";

export default {
  name: "chat",
  components: {
    ChatIcon,
    CategoryFloat,
    DefaultFloat,
    JoinCommunitys,

  },
  setup(props, ctx) {
    const com = communityStore();
    const chat = chatStore();
    const appS = appStore();

    const { community } = storeToRefs(com);
    const { settings, contactsSet } = storeToRefs(chat);
    const { userInfo, lvInfo } = appS;
    const router = useRouter();
    const route = useRoute();
    // const TUIServer = window.$TUIKit
    const { proxy } = getCurrentInstance();
    const globalStore = useGlobalStore();
    const { loginVisible } = storeToRefs(globalStore);
    const createGroupRef = ref(null);
    const addRef = ref(null);
    const joinComRef = ref(null);
    const addGroupRef = ref(null);

    const data = reactive({
      chatVisible: false,
      addIndex: "",
      index: "chat",
      // env: TUIServer?.TUIEnv,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      communityData: null,
      communityNo: 1,
    });

    //触发社群创建入口
    const createCommunity = () => {
      if (!window.$useEnv("guest")) {
        proxy.$bus.emit("createModal");
      } else {
        loginTip();
      }
    };
    // 切换左侧tab
    const selectTab = async (item) => {
      data.index = item.type;
      const no = item.route.params.no; // 取出社群id
      data.communityNo = no;
      router.push(item.route);
    };
    // 触发添加入口
    const triggerAddModal = (item) => {
      switch (item.index) {
        // 创建群
        case "launch":
          createGroupRef.value.openCreateGroupSession();
          break;
        // 加好友
        case "addFriend":
          addRef.value.openAddFriend();
          break;
        // 加入群聊
        case "addGroup":
          addGroupRef.value.openAddGroup();
          break;
        // 加入社群
        case "joinCom":
          joinComRef.value.openJoinCom();
          break;
      }
    };

    // 提示登录弹窗
    const loginTip = () => {
      window.$ui.confirm(
        "登录提示",
        "目前处于游客模式，请登录后体验完整功能。",
        {
          ok: () => {
            loginVisible.value = true;
          },
          okText: "立即登录",
          noText: "暂不登录",
          okButtonWidth: "95",
          noButtonWidth: "95",
        }
      );
    };

    // 获取总的消息未读数据
    const unreadTotal = computed(() => {
      // const list =
      //   window.$TUIKit?.store?.store?.TUIConversation?.conversationList;
      // if (!list) {
      //   return 0;
      // }
      // if (list.length !== undefined && list.length !== 0) {
      //   const total = { unread: 0 };
      //   for (const item of list) {
      //     total.unread += item.unreadCount;
      //   }
      //   return total.unread === 0 ? 0 : total.unread > 99 ? 99 : total.unread;
      // }
    });

    /**初始ref定义数组**/
    const headList = ref([
      {
        newIcon: "fluent:chat-16-filled",
        tab: "session",
        route: { name: "chatMain", params: { no: "" } },
        disabled: false,
        callBack: (item) => {
          selectTab(item);
        },
        info:
          unreadTotal.value !== undefined && unreadTotal.value !== 0
            ? ["tr", "red", `${unreadTotal.value}`]
            : ["tr", "", ""],
      },
      {
        tab: "contact",
        newIcon: "fluent:people-16-filled",
        disabled: false,
        route: { name: "contact", params: { no: "" } },
        callBack: (item) => {
          selectTab(item);
        },
      },
      // ...(config.adminUids.includes(userInfo.uid)
      //   ? [
      //       {
      //         icon: "diannao",
      //         type: "admin",
      //         tab: "admin",
      //         title: "管理面板(仅管理员可见)",
      //         route: { name: "chatAdmin", params: { no: "" } },
      //         callBack: (item) => {
      //           selectTab(item);
      //         },
      //       },
      //     ]
      //   : []),
    ]);
    const bodyList = ref([
      // 写社群相关静态内容时临时打开的路由
      {
        img: "/icons/logo128.png",
        float: "",
        id: 0,
        noBg: true,
        tab: "community",
        type: "community",
        route: { name: "defaultCommunity", params: { no: 1 } },
        callBack: (item) => {
          selectTab(item);
        },
      },
    ]);
    const footList = ref([
      {
        full: true,
      },
      {
        newIcon: "fluent:add-16-filled",
        icon: "tianjia2",
        children: [
          {
            newIcon: "fluent:chat-16-filled",
            name: "发起群聊",
            index: "launch",
            callBack: (item) => {
              if (!window.$useEnv("guest")) {
                triggerAddModal(item);
                completeTask("Z0601");
              } else {
                loginTip();
              }
            },
          },
          {
            newIcon: "fluent:people-16-filled",
            name: "加入群聊",
            index: "addGroup",
            callBack: (item) => {
              if (!window.$useEnv("guest")) {
                triggerAddModal(item);
                completeTask("Z0601");
              } else {
                loginTip();
              }
            },
          },
          {
            newIcon: "fluent:people-add-16-filled",
            name: "添加好友",
            index: "addFriend",
            callBack: (item) => {
              if (!window.$useEnv("guest")) {
                triggerAddModal(item);
                completeTask("Z0602");
              } else {
                loginTip();
              }
            },
          },
          {
            newIcon: "fluent:emoji-smile-slight-24-filled",
            name: "创建社群",
            index: "createCom",
            slot: "createChat",
            callBack: () => {
              createCommunity();
            },
          },
          {
            icon: "team",
            newIcon: "fluent:people-16-filled",
            index: "joinCom",
            name: "加入社群",
            callBack: (item) => {
              if (!window.$useEnv("guest")) {
                triggerAddModal(item);
              } else {
                loginTip();
              }
            },
          },
        ],
      },
    ]);
    const createCommunityList = ref([
      {
        newIcon: "fluent:add-16-filled",
        id: 2,
        callBack: () => {
          createCommunity();
        },
        slot: "createCom",
      },
    ]);

    /**监听communityList**/
    watch(
      () => community.value.communityList,
      (newVal) => {
        const isNull = newVal.length !== undefined && newVal.length !== 0;
        if (isNull) {
          const communityData = newVal;
          const mapCommunityData = communityData.map((item) => {
            const newInfo = item?.communityInfo;
            return {
              ...item,
              img: newInfo.icon,
              float: "",
              tab: `community_${newInfo.no}`,
              noBg: true,
              type: `community${item.cno}`,
              route: { name: "myCommunity", params: { no: newInfo.no } },
              callBack: (item) => {
                selectTab(item);
              },
            };
          });
          const mergeArray = bodyList.value.concat(mapCommunityData);
          bodyList.value = mergeArray;
        }
      }
    );

    // 合并群聊左侧列表数据
    const filterList = computed(() => {
      const uniqueList = [];
      for (const item of bodyList.value) {
        const index = uniqueList.findIndex((find) => {
          return find.id === item.id;
        });
        if (index === -1) {
          const total = communityTotal(item.no, community.value.communityTree);
          const itemOption = {
            ...item,
            info: total === 0 ? [] : ["tr", "red", `${total}`],
          };
          uniqueList.push(itemOption);
        }
      }
      const updateList = uniqueList.concat(createCommunityList.value);
      const lastList = [...headList.value, ...updateList, ...footList.value];
      if (settings.value.enableHide) {
        const mapFloatLeft = lastList.map((item) => {
          return {
            ...item,
            float: item.float === "" ? `communityFloat${item.no}` : "",
          };
        });
        return mapFloatLeft;
      } else {
        return lastList;
      }
    });

    // 等级限制，3级才可以创建一个社群，10级后可以创建五个社群
    const limitClick = computed(() => {
      const list = filterList.value.filter((item)=>{
          return item?.role && item?.role === 'owner'
      })
      let lv = lvInfo.lv;
      if (lv < 3 && list.length >= 0) {
        return "最多创建一个社群";
      } else if (lv < 10 && list.length >= 1) {
        return "最多创建五个社群";
      }
    });

    /**初始化挂载**/
    onMounted(() => {
      // setTimeout(() => {
      //   console.log("挂载了", limitClick.value);
      //   const list = filterList.value.filter((item)=>{
      //     return item?.role && item?.role === 'owner'
      //   })
      //   console.log(list)
      // },2000)

      com.getMyCommunity();
      com.getCommunityTree();
      // 游客模式下 隐藏 聊天对话 和 通讯录
      // console.log("!window.$useEnv('guest')", !window.$useEnv('guest'))
      if (window.$useEnv("guest")) {
        headList.value[0].disabled = true;
        headList.value[1].disabled = true;
      }
      nextTick(() => {
        // window.$chat?.on(window.$TUIKit?.TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, async(e) => {
        //   // headList.value[0].unread = e.data === 0 ? 0 : e.data > 99 ? 99 : e.data;
        //   headList.value[0].info = e.data === 0 ? [] :  e.data > 99 ? ['tr','red','99'] : ['tr','red',`${e.data}`];
        //   const list = community.value.communityList;
        //   if(list.length !== 0){
        //     for(const item of list){
        //      const no = item.communityInfo.no;
        //      com.updateCommunityTree(no);
        //     }
        //   }
        // });
      });
    });

    return {
      headList,
      bodyList,
      footList,
      filterList,
      createCommunityList,
      ...toRefs(data),
      createCommunity,
      selectTab,
      triggerAddModal,
      limitClick,
      createGroupRef,
      addRef,
      joinComRef,
      addGroupRef
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.tippy-content) {
  padding: 0 !important;
  // width:336px !important;
}
:deep(.tippy-box) {
  border-radius: 12px !important;
  border: 1px solid var(--divider);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2),
    0px 0px 20px 0px rgba(0, 0, 0, 0.1), 0px 0px 40px 0px rgba(0, 0, 0, 0.2);
}

:deep(.menu-item) + div {
  z-index: 90 !important;
}

:deep(.xt-br) {
  margin: 0 !important;
}
</style>
