<!-- 群聊应用 -->
<template>
  <div class="w-full h-full">
    <xt-left-menu :list="updateChatAppList" end="6" :index="currentChatIndex">
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
            icon="fluent:emoji-smile-slight-24-regular"
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
import { useGlobalStore } from "../../../Global/store";
import { appStore } from "../../../../store";

import CreateGroup from "../../components/create/CreateGroupSession.vue";
import AddFriend from "../../components/add/AddFriend.vue";
import AddGroup from "../../components/add/AddGroup.vue";
import OfficialCategoryFloat from "../../components/suspendMode/OfficialCategoryFloat.vue";
import CategoryFloat from "../../components/suspendMode/CategoryFloat.vue";
import GradeSmallTip from "../../../../components/GradeSmallTip.vue";
import CreateCommunity from "../../components/create/CreateCommunity.vue";
import JoinCommunity from "../join/JoinCommunity.vue";

const router = useRouter();
const chatCommunity = chatCommunityStore();
const globalStore = useGlobalStore();
const appS = appStore();
const { proxy } = getCurrentInstance();

const { loginVisible } = storeToRefs(globalStore);
const { myCommunity, setting } = storeToRefs(chatCommunity);
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
// 左侧底部列表
const leftList = ref([
  {
    newIcon: "fluent:add-16-filled",
    icon: "tianjia2",
    children: [
      {
        newIcon: "fluent:chat-16-regular",
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
        newIcon: "fluent:people-16-regular",
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
        newIcon: "fluent:people-add-16-regular",
        name: "添加好友",
        index: "addFriend",
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
        newIcon: "fluent:emoji-smile-slight-24-regular",
        name: "创建社群",
        index: "createCom",
        slot: "createChat",
        callBack: () => {
          createCommunity();
        },
      },
      {
        icon: "team",
        newIcon: "fluent:people-16-regular",
        index: "joinCom",
        name: "加入社群",
        callBack: (item) => {
          if (!window.$useEnv("guest")) {
            triggerAddModal(item);
            completeTask("Z0601");
          } else {
            loginTip();
          }
        },
      },
    ],
  },
  {
    newIcon: "fluent:chat-16-regular",
    tab: "session",
    type: "session",
    route: { name: "chatMain", params: { no: "" } },
    disabled: false,
    info:
      currentData.value.unread !== 0
        ? ["tr", "red", `${unreadTotal.value}`]
        : ["tr", "", ""],
  },
  {
    tab: "find",
    type: "find",
    newIcon: "eva:compass-outline",
    route: { name: "chatFind", params: { no: "" } },
  },
  {
    tab: "contact",
    type: "contact",
    newIcon: "fluent:people-community-16-regular",
    route: { name: "contact", params: { no: "" } },
  },
  {
    type: "team",
    tab: "team",
    newIcon: "fluent:people-16-regular",
    route: { name: "team", params: { no: "" } },
  },
  {
    full: true,
  },
]);

const chatAppList = computed(() => {
  const newList = myCommunity.value.concat(leftList.value);
  const mapList = _.map(newList, function (item) {
    return {
      ...item,
      callBack: (item) => {
        switchTab(item);
      },
    };
  });
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

// 提示登录弹窗
const loginTip = () => {
  window.$ui.confirm("登录提示", "目前处于游客模式，请登录后体验完整功能。", {
    ok: () => {
      loginVisible.value = true;
    },
    okText: "立即登录",
    noText: "暂不登录",
    okButtonWidth: "95",
    noButtonWidth: "95",
  });
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
  if (!window.$useEnv("guest")) {
    proxy.$bus.emit("createModal");
  } else {
    loginTip();
  }
};

onMounted(() => {
  chatCommunity.getMyCommunity();
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
  margin: 0 !important;
  & div:nth-of-type(1) {
    margin: 0 !important;
    div > div > div:nth-of-type(2) {
      .xt-base-btn {
        img {
          width: 40px !important;
          height: 40px !important;
        }
      }
    }
  }
  & div:nth-of-type(3) div {
    margin: 0 !important;
    .menu-item {
      width: 40px !important;
      min-height: 40px !important;
    }
  }
}
:deep(.xt-bt) {
  border: none !important;
}
</style>