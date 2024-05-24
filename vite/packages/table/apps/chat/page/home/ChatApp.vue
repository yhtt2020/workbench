<!-- 群聊应用 -->
<template>
  <div class="w-full h-full">
    <xt-left-menu
      :list="updateChatAppList"
      last="1"
      :end="endList"
      :index="currentChatIndex"
    >
      <div class="w-full h-full">
        <router-view></router-view>
      </div>
      <template v-for="item in updateChatAppList" #[item.float]>
        <OfficialCategoryFloat v-if="currentNo === 1" />
        <CategoryFloat :no="item.communityInfo.no" v-else />
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
            class="mr-3 xt-text"
          />
          创建社群
        </div>
      </template>
    </xt-left-menu>
  </div>

  <!-- 社群创建 -->
  <CreateCommunity />
  <!-- 群聊创建 -->
  <CreateGroup ref="createGroupRef" />
  <!-- 好友添加、搜索 -->
  <AddFriend ref="addRef" />
  <!-- 群聊添加、搜索-->
  <AddGroup ref="addGroupRef" />
  <!-- 推荐社群和搜索社群的添加 -->
  <JoinCommunity ref="joinComRef" />
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance, watch } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import _ from "lodash-es";
import { useRouter, useRoute } from "vue-router";
import { completeTask } from "../../../task/task";
import { appStore } from "../../../../store";
import config from "../../hooks/config";

import CreateGroup from "../../components/create/CreateGroupSession.vue";
import AddFriend from "../../components/add/AddFriend.vue";
import AddGroup from "../../components/add/AddGroup.vue";
import OfficialCategoryFloat from "../../components/suspendMode/OfficialCategoryFloat.vue";
import CategoryFloat from "../../components/suspendMode/CategoryFloat.vue";
import GradeSmallTip from "../../../../components/GradeSmallTip.vue";
import CreateCommunity from "../../components/create/CreateCommunity.vue";
import JoinCommunity from "../join/JoinCommunity.vue";
import { usePermissionStore } from "../../../../permission/store";
import { reconnect } from "../../../../permission/user/useUserPermit";
const router = useRouter();
const chatCommunity = chatCommunityStore();
const appS = appStore();
const { proxy } = getCurrentInstance();

const usePermission = usePermissionStore()
const { myCommunity, setting } = storeToRefs(chatCommunity);
const { loginVisible } = storeToRefs(appS);
const { userInfo, lvInfo } = appS;

const createGroupRef = ref(null);
const addRef = ref(null);
const addGroupRef = ref(null);
const joinComRef = ref(null);

const currentData = ref({
  // 当前左侧栏选中的下标
  currentChatIndex: "OfficialCommunity",
  unread: 0,
});

// 左侧栏数据
const leftHeader = ref([
  {
    newIcon: "fluent:chat-16-filled",
    tab: "session",
    type: "session",
    route: { name: "chatMain", params: { no: "" } },
    disabled: false,
    menuVisible: false,
    // info:
    //   currentData.value.unread !== 0
    //     ? ["tr", "red", `${unreadTotal.value}`]
    //     : ["tr", "", ""],
  },
]);
const leftList = ref([
  {
    newIcon: "fluent:add-16-filled",
    icon: "tianjia2",
    menuVisible: false,
    children: [
      {
        newIcon: "fluent:chat-16-filled",
        name: "发起群聊",
        index: "launch",
        callBack: (item) => {
          if (usePermission.currentEnv === 'guest') {
            loginVisible.value = true;
          }else if(usePermission.currentEnv === 'offline'){
            reconnect();
          } else {
            triggerAddModal(item);
            completeTask("Z0601");
          }
        },
      },
      {
        newIcon: "fluent:people-add-16-filled",
        name: "加入群聊",
        index: "addGroup",
        callBack: (item) => {
          if (usePermission.currentEnv === 'guest') {
            loginVisible.value = true;
          }else if(usePermission.currentEnv === 'offline'){
            reconnect();
          } else {
            triggerAddModal(item);
            completeTask("Z0601");
          }
        },
      },
      {
        newIcon: "fluent:person-add-16-filled",
        name: "添加好友",
        index: "addFriend",
        callBack: (item) => {
          if (usePermission.currentEnv === 'guest') {
            loginVisible.value = true;
          }else if(usePermission.currentEnv === 'offline'){
            reconnect();
          } else {
            triggerAddModal(item);
            completeTask("Z0601");
          }
        },
      },
      {
        newIcon: "fluent:emoji-add-16-filled",
        name: "创建社群",
        index: "createCom",
        slot: "createChat",
        callBack: () => {
          createCommunity();
        },
      },
      {
        newIcon: "fluent:mail-add-16-filled",
        index: "joinCom",
        name: "加入社群",
        callBack: (item) => {
          if (usePermission.currentEnv === 'guest') {
            loginVisible.value = true;
          }else if(usePermission.currentEnv === 'offline'){
            reconnect();
          } else {
            triggerAddModal(item);
            completeTask("Z0601");
          }
        },
      },
    ],
  },
  {
    tab: "find",
    type: "find",
    newIcon: "fluent:compass-northwest-24-filled",
    menuVisible: true,
    route: { name: "chatFind", params: { no: "" } },
  },
  ...(config.adminUids.includes(userInfo.uid)
    ? [
        {
          newIcon: "fluent:desktop-mac-16-filled",
          type: "admin",
          tab: "admin",
          title: "管理面板(仅管理员可见)",
          menuVisible: true,
          route: { name: "chatAdmin", params: { no: "" } },
        },
      ]
    : []),
  {
    full: true,
    menuVisible: false,
  },
]);
/**社群右键菜单**/
const menuList = ref([
  {
    newIcon: "fluent:arrow-upload-16-filled",
    label: "置顶",
    callBack: () => {
      const no = router.currentRoute.value?.params?.no;
      chatCommunity.topSort(no);
    },
  },
]);
// /**取消置顶列表**/
const unMenuList = ref([
  {
    newIcon: "fluent:arrow-download-16-filled",
    label: "取消置顶",
    callBack: () => {
      const no = router.currentRoute.value?.params?.no;
      chatCommunity.unSetTopSort(no);
    },
  },
]);
const chatAppList = computed(() => {
  const newList = leftHeader.value.concat(
    myCommunity.value.concat(leftList.value)
  );
  const mapList = _.map(newList, function (item) {
    if (!item.menuVisible) {
      return {
        ...item,
        callBack: (item) => {
          switchTab(item);
        },
      };
    } else {
      /**是否置顶**/
      if (item.top && item.top[3] === 0) {
        return {
          ...item,
          menu: menuList.value,
          callBack: (item) => {
            switchTab(item);
          },
        };
      } else {
        return {
          ...item,
          menu: unMenuList.value,
          callBack: (item) => {
            switchTab(item);
          },
        };
      }
    }
  });
  if(usePermission.currentEnv === 'guest' || usePermission.currentEnv === 'single'){
    const find = mapList.length - 2
    mapList[0] = mapList[find]
    mapList.splice(find - 1, 2)
  }
  return mapList;
});

// 更新左侧列表的悬浮模式
const updateChatAppList = computed(() => {
  const isHide =
    setting.value.suspendVisible.enable &&
    setting.value.suspendVisible.no !== null;
  if (isHide) {
    const no = setting.value.suspendVisible.no;
    const mapFloatLeft = chatAppList.value.map((item) => {
      // 社群ID是否一致
      if (Number(item.route?.params?.no) === Number(no)) {
        return {
          ...item,
          float: `float${item.no}`,
        };
      } else {
        return {
          ...item,
          float: "",
        };
      }
    });
    return mapFloatLeft;
  } else {
    return chatAppList.value;
  }
});

// 当前悬浮模式设置中的社群ID号
const currentNo = computed(() => {
  return setting.value.suspendVisible.no;
});

// 底部按钮数量
const endList = computed(() => {
  if(usePermission.currentEnv === 'guest' || usePermission.currentEnv === 'single'){
    return leftList.value.length - 2;
  }else{
    return leftList.value.length;
  }
});

// 等级限制，3级才可以创建一个社群，10级后可以创建五个社群
const limitClick = computed(() => {
  const list = updateChatAppList.value.filter((item) => {
    return item?.role && item?.role === "owner";
  });
  let lv = lvInfo.lv;
  if (lv < 3 && list.length >= 0) {
    return "最多创建一个社群";
  } else if (lv < 10 && list.length >= 1) {
    return "最多创建五个社群";
  }
});

// 切换tab
const switchTab = (item) => {
  currentData.currentChatIndex = item.type;
  if (item.route) {
    router.push(item.route);
  }
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

//触发社群创建入口
const createCommunity = () => {
  if (usePermission.currentEnv === 'guest') {
    loginVisible.value = true;
  }else if(usePermission.currentEnv === 'offline'){
    reconnect();
  } else {
    proxy.$bus.emit("createModal");
  }
};

onMounted(() => {
  if(window.$currentEnv() === 'online'){
    chatCommunity.getMyCommunity();
  }
  proxy.$bus.on("getChatUnread", (data) => {
    console.log("获取未读消息数", data);
    currentData.value.unread = data;
  });
});
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
  margin-right: 0 !important;
}
</style>

<!-- 

 /**初始化挂载**/
//  onMounted(() => {
//       // setTimeout(() => {
//       //   console.log("挂载了", limitClick.value);
//       //   const list = filterList.value.filter((item)=>{
//       //     return item?.role && item?.role === 'owner'
//       //   })
//       //   console.log(list)
//       // },2000)
      
//       com.getMyCommunity();
//       com.getCommunityTree();
//       // 游客模式下 隐藏 聊天对话 和 通讯录
//       // console.log("!window.$useEnv('guest')", !window.$useEnv('guest'))
//       if (window.$useEnv("guest")) {
//         headList.value[0].disabled = true;
//         headList.value[1].disabled = true;
//       }
//       nextTick(() => {
//         // window.$chat?.chat?.on(window.$TUIKit?.TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, async(e) => {
//         //   // headList.value[0].unread = e.data === 0 ? 0 : e.data > 99 ? 99 : e.data;
//         //   headList.value[0].info = e.data === 0 ? [] :  e.data > 99 ? ['tr','red','99'] : ['tr','red',`${e.data}`];
//         //   const list = community.value.communityList;
//         //   if(list.length !== 0){
//         //     for(const item of list){
//         //      const no = item.communityInfo.no;
//         //      com.updateCommunityTree(no);
//         //     }
//         //   }
//         // });
//       });
//     });


// 获取总的消息未读数据
// const unreadTotal = computed(() => {
//       // const list =
//       //   window.$TUIKit?.store?.store?.TUIConversation?.conversationList;
//       // if (!list) {
//       //   return 0;
//       // }
//       // if (list.length !== undefined && list.length !== 0) {
//       //   const total = { unread: 0 };
//       //   for (const item of list) {
//       //     total.unread += item.unreadCount;
//       //   }
//       //   return total.unread === 0 ? 0 : total.unread > 99 ? 99 : total.unread;
//       // }
//     });
 -->
