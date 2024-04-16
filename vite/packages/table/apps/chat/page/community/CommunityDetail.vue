<!--非官方社群详情页 -->
<template>
  <a-row class="w-full h-full">
    <a-col
      class="flex flex-col h-full find-left"
      v-if="floatVisible === false"
      style="border-right: 1px solid var(--divider)"
    >
      <CategoryFloat :no="currentNo" />
    </a-col>
    <a-col flex=" 1 1 200px" v-if="currentItem" class="flex flex-col h-full">
      <CommunityHeader :headerContent="currentItem" />
      <RightDetailMain :currentItem="currentItem" />
    </a-col>
  </a-row>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { chatCommunityStore } from "../../store/chatCommunity";
import browser from "../../../../js/common/browser";
import _ from "lodash-es";
import { checkGroupShip } from "../../../../js/common/sns";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";

import CategoryFloat from "../../components/suspendMode/CategoryFloat.vue";
import RightDetailMain from "./RightDetailMain.vue";
import CommunityHeader from "../../components/suspendMode/CommunityHeader.vue";

const { proxy } = getCurrentInstance();
const route = useRoute();
const chatCommunity = chatCommunityStore();
const { currentCommunityNo, setting } = storeToRefs(chatCommunity);

const currentItem = ref(null);
const currentData = ref({
  group: [],
  isChat: "yes",
  artName: "community_after_created_empty",
  emptyArticle: {
    title: "",
    content: "",
  },
});

// 通过计算属性获取当前社群编号
const currentNo = computed(() => {
  // console.log('查看',currentCommunityNo.value === route.params.no);
  // 初始值是否为null,并且判断no是否与路由的no相同
  if (
    currentCommunityNo.value === route.params.no &&
    currentCommunityNo.value
  ) {
    return currentCommunityNo.value;
  } else {
    return route.params.no;
  }
});
// 获取是否收起侧边栏
const floatVisible = computed(() => {
  return (
    setting.value.suspendVisible.enable &&
    setting.value.suspendVisible.no !== null &&
    Number(setting.value.suspendVisible.no) === Number(currentNo.value)
  );
});

onBeforeRouteUpdate((to, from, next) => {
  // console.log("更新当前路由", to.params.no, from);
  if (to.params?.no) {
    chatCommunity.setCurrentCommunityNo(to.params?.no);
  }
  next();
});

// 触发当前左侧点击事件
const handleCurrentItem = async (data) => {
  const { type } = data.value ? data.value : data;
  const currentData = data.value ? data.value : data;
  // 链接
  if (type === "link") {
    if (currentData.name !== "Roadmap") {
      const method = currentData.props?.openMethod;
      const url = currentData.props.url;
      // 想天浏览器打开
      if (method === "userSelect") {
        browser.openInInner(url);
      }
      // 系统浏览器打开
      else if (method === "systemSelect") {
        browser.openInSystem(url);
      } else if (method === "thinksky") {
        browser.openInInner(url);
      } else if (method === "mob") {
        browser.openInMobMod(url, {
          partition: "persist:webcontent",
          newName: "手机模式",
        });
      }
    }
  }
  // 群聊
  else if (type === "group") {
    const groupList = window.$TUIKit?.TUIStore?.storeMap?.group?.store?.groupList;
    const groupProps =currentData.props[0] ? currentData.props[0] : currentData.props;
    const index = _.findIndex(groupList, (findItem) => {
      return String(findItem.groupID) === String(groupProps.groupID);
    });
  }
  // 其他
  currentItem.value = currentData;
};

onMounted(() => {
  proxy.$bus.on("handleCurrentCommunity", (item) => {
    currentItem.value = item;
    handleCurrentItem(item);
  });
});
</script>

<style lang="scss" scoped>
</style>