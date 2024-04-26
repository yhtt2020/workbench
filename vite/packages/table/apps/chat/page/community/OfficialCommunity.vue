<!-- 默认官方社群页 -->
<template>
  <a-row class="w-full h-full">
    <a-col
      class="flex flex-col h-full find-left"
      v-if="floatVisible === false"
      style="border-right: 1px solid var(--divider)"
    >
      <OfficialCategoryFloat />
    </a-col>

    <template v-if="currentItem">
      <a-col flex=" 1 1 200px"  class="flex flex-col h-full">
        <!-- <CommunityHeader :headerContent="currentItem"/> -->
        <RightDetailMain :currentItem="currentItem"/>
      </a-col>
    </template>

    <template v-else>
      <a-col flex=" 1 1 200px"  class="flex flex-col h-full">
        <CommunityDetailEmpty :no="1"/>
      </a-col>
    </template>

  </a-row>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { chatCommunityStore } from "../../store/chatCommunity";
import { storeToRefs } from "pinia";
import {
  TUIStore,
  StoreName,
  TUIConversationService,
} from "@tencentcloud/chat-uikit-engine";
import browser from "../../../../js/common/browser";
import { checkGroupShip } from "../../../../js/common/sns";

import OfficialCategoryFloat from "../../components/suspendMode/OfficialCategoryFloat.vue";
import RightDetailMain from "./RightDetailMain.vue";
// import CommunityHeader from "../../components/suspendMode/CommunityHeader.vue";
import CommunityDetailEmpty from "../empty/CommunityDetailEmpty.vue"

const chatCommunity = chatCommunityStore();
const { setting, defaultOfficialList } = storeToRefs(chatCommunity);
const { proxy } = getCurrentInstance();

/**ref定义数据**/
const currentItem = ref(null);

// 获取是否收起侧边栏
const floatVisible = computed(() => {
  return (
    setting.value.suspendVisible.enable &&
    setting.value.suspendVisible.no !== null &&
    Number(setting.value.suspendVisible.no) ===
      Number(defaultOfficialList.value[0].no)
  );
});

// 触发当前左侧点击事件
const handleCurrentItem = async (data) => {
  switch (data.type) {
    /**链接**/
    case "link":
      switch (data.props.openMethod) {
        case "userSelect":
          browser.openInInner(data.props.url);
          break;
        case "systemMethod":
          browser.openInSystem(data.props.url);
          break;
        case "currentPage":
          return;
      }
      break;
    /**群聊**/
    case "group":
      const res = await window.$chat?.chat?.searchGroupByID(data.props.id);
      const enableGroup = await checkGroupShip([`${data.props.id}`]);
      const isDisable = res.data.group.joinOption !== "DisableApply";
      // 判断有没有加入社群, yes表示已经加入, not表示没有加入
      if (enableGroup[0] === "yes") {
        const name = `GROUP${data.props.id}`;
        TUIConversationService.switchConversation(name);
      } else {
        // isDisable 禁止加入
        if (isDisable) return (data.group = res.data.group);
        message.warn("该群禁止加入");
      }
      break;
    /**其他**/
    default:
      currentItem.value = data;
      break;
  }
};

onMounted(() => {
  proxy.$bus.on("handleOfficalClick", (item) => {
    currentItem.value = item;
    handleCurrentItem(item);
  });
});
</script>

<style lang="scss" scoped>
</style>