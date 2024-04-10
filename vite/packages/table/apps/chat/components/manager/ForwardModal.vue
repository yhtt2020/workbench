<!-- 群聊内容转发弹窗页面 -->
<template>
  <xt-modal v-if="forwardVisible" v-model="forwardVisible" title="转发消息">
    <UserSelect
      :currentLeftList="currentLeftList"
      @close="forwardVisible = false"
      @forward="submitForward"
    />
  </xt-modal>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import {
  TUIStore,
  StoreName,
  TUIChatService,
} from "@tencentcloud/chat-uikit-engine";
import { isEnabledMessageReadReceiptGlobal } from "../../../TUIKit/components/TUIChat/utils/utils";
import { message } from "ant-design-vue";

import UserSelect from "../user/UserSelect.vue";

const { proxy } = getCurrentInstance();

// 开启转发弹窗,存储当前左侧用户数据列表
const currentLeftList = ref([]);
const forwardVisible = ref(false);
const getForwardChatList = () => {
  TUIStore.watch(StoreName.CONV, {
    conversationList: (list) => {
      currentLeftList.value = list.map((conversation) => {
        return {
          // 为了实现Transfer的复用，这里用userID代替ConversationID
          userID: conversation.conversationID,
          nick: conversation.getShowName(),
          avatar: conversation.getAvatar(),
          type: conversation.type,
        };
      });
    },
  });
};
const openForwardModal = () => {
  forwardVisible.value = true;
  nextTick(() => {
    getForwardChatList();
  });
};

// 转发数据
const submitForward = (list) => {
  // 这里传递的是 coversationID
  // 但为了实现 Transfer 的复用 这里用 userID 代替 ConversationID
  const selectedConversationList = list.map((convIDWrapper) => {
    const { userID: conversationID } = convIDWrapper;
    return TUIStore.getConversationModel(conversationID);
  });
  const singleForwardMessageID = TUIStore.getData(
    StoreName.CUSTOM,
    "singleForwardMessageID"
  );
  const message = TUIStore.getMessageModel(singleForwardMessageID);
  TUIChatService.sendForwardMessage(selectedConversationList, [message], {
    needReadReceipt: isEnabledMessageReadReceiptGlobal(),
  })
  .catch((error) => {
    if (error.code === 80001) {
      message.error(`${TUITranslateService.t("内容包含敏感词汇")}`);
    } else {
      message.error(`${error.message}`);
    }
  });
  forwardVisible.value = false;
};

onMounted(() => {
  proxy.$bus.on("openForwardModal", openForwardModal);
});
</script>

<style lang="scss" scoped>
</style>