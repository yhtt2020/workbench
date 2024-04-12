<!-- 推荐用户详情页 -->
<template>
  <div class="content-list">
    <template v-for="item in userList">
      <div
        class="flex items-center xt-bg-t-2 content-item px-4 justify-between py-5 rounded-xl mb-3"
        style="width: 400px"
      >
        <div class="flex items-center pointer w-full">
          <a-row :gutter="10" class="flex w-full">
            <a-col flex="50px">
              <a-avatar :src="item.avatar" :size="48"></a-avatar>
            </a-col>
            <a-col flex="auto">
              <div class="font-16 xt-text xt-font">
                {{ item.nickname }}
              </div>
              <div class="xt-text-2 font-14 xt-font">{{ item.reason }}</div>
            </a-col>
            <a-col
              @click.stop
              flex="100px"
              v-if="item.uid != userInfo.uid && item.relationship !== undefined"
            >
              <AddFindButton
                v-show="item.relationship === 'not'"
                @relationshipChanged="updateRelationship($event, item)"
                :key="item.uid"
                :uid="item.uid"
              />
              <SendMessageButton
                :uid="item.uid"
                @send="enterGroup(item)"
                style="background: rgba(80, 139, 254, 0.2) !important"
                v-show="item.relationship === 'yes'"
              />
            </a-col>
          </a-row>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../../store";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";
import { chatStore } from "../../../../../store/chat";
import { useRouter } from "vue-router";

import AddFindButton from "../../../../../components/sns/AddFindButton.vue";
import SendMessageButton from "../../../../../components/sns/SendMessageButton.vue";

const chatServer = window.$chat.chat;
const router = useRouter();
const props = defineProps({
  userList: {
    type: Array,
    default: () => [],
  },
});
const { userList } = toRefs(props);

const chat = chatStore();
const app = appStore();
const { userInfo } = storeToRefs(app);

// 更新好友关系
const updateRelationship = (e, item) => {
  item.relationship = e.relationship;
};

const enterGroup = async (item) => {
  const name = `C2C${item.uid}`;
  handlerConversationList(name)
};
const handlerConversationList = (conversationID) => {
  chat.updateConversation(conversationID);
  router.push({ name: "chatMain" });
  TUIConversationService.switchConversation(conversationID);
};
</script>

<style lang="scss" scoped>
.content-item {
  margin-right: 16px !important;
  aspect-ratio: 5 / 1;
  max-width: 400px;
}
:deep(.ant-avatar-square) {
  border-radius: 8px !important;
}
@media screen and (max-width: 964px) {
  .content-list {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 16px;
  }
  .content-item {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 965px) {
  .content-list {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
  .content-item {
    width: calc(100% / 1);
  }
}
</style>