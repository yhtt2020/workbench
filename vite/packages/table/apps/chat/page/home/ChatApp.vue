<!-- 群聊应用 -->
<template>
  <div class="w-full h-full">
    <xt-left-menu :list="chatAppList" end="6" :index="currentChatIndex">
      <div class="w-full h-full">
        <router-view></router-view>
      </div>
    </xt-left-menu>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import _ from "lodash-es";
import { useRouter, useRoute } from "vue-router";

const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

const router = useRouter();

const currentData = ref({
  // 当前左侧栏选中的下标
  currentChatIndex: "OfficialCommunity",
});

const leftList = ref([
  {
    newIcon: "fluent:add-16-filled",
    icon: "tianjia2",
    children: [
      {
        newIcon: "fluent:chat-16-regular",
        name: "发起群聊",
        index: "launch",
        callBack: (item) => {},
      },
      {
        newIcon: "fluent:people-16-regular",
        name: "加入群聊",
        index: "addGroup",
        callBack: (item) => {},
      },
      {
        newIcon: "fluent:people-add-16-regular",
        name: "添加好友",
        index: "addFriend",
        callBack: (item) => {},
      },
      {
        newIcon: "fluent:emoji-smile-slight-24-regular",
        name: "创建社群",
        index: "createCom",
        callBack: () => {},
      },
      {
        icon: "team",
        newIcon: "fluent:people-16-regular",
        index: "joinCom",
        name: "加入社群",
        callBack: (item) => {},
      },
    ],
  },
  {
    newIcon: "fluent:chat-16-regular",
    tab: "session",
    type: "session",
    route: { name: "chatMain", params: { no: "" } },
    disabled: false,
  },
  {
    tab: "find",
    type: "find",
    newIcon: "eva:compass-outline",
    route: { name: "chatFind", params: { no: "" } },
  },
  {
    tab: "meta",
    type: "meta",
    newIcon: "fluent:star-16-regular",
  },
  {
    type: "more",
    tab: "more",
    newIcon: "fluent:more-horizontal-16-regular",
    children:[],
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

// 切换tab
const switchTab = (item) => {
  console.log("测试", item.route);
  currentData.currentChatIndex = item.type;
  if (item.route) {
    router.push(item.route);
  }
};

onMounted(() => {
  chatCommunity.getMyCommunity();
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
  & div:nth-of-type(3) div{
    margin: 0 !important;
    .menu-item{
      width: 40px !important;
      min-height: 40px !important;
    }
  }
}
:deep(.xt-bt) {
  border: none !important;
}
</style>