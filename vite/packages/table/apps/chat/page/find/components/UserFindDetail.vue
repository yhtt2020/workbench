<!-- 推荐用户详情页 -->
<template>
  <div class="content-list">
    <template v-for="item in userList">
      <div
        class="flex items-center xt-bg-t-2 content-item px-4 justify-between py-5 rounded-xl mb-3"
        style="width: 400px"
      >
        <div class="flex items-center pointer w-full justify-between">
          <div class="flex items-center">
            <a-avatar :src="item.avatar" :size="48"></a-avatar>
            <div class="flex flex-col pl-4">
              <div class="font-16 xt-text xt-font">
                {{ item.nickname }}
              </div>
              <div class="xt-text-2 font-14 xt-font">{{ item.reason }}</div>
            </div>
          </div>
          <div
            style="width: 120px"
            v-if="item.uid != userInfo.uid && item.relationship !== undefined"
          >
            <AddFindButton
              v-show="
                item.relationship === 'not' || item.relationship === 'error'
              "
              @relationshipChanged="updateRelationship($event, item)"
              :key="item.uid"
              :uid="item.uid"
              @login="loginTip"
            />
            <SendMessageButton
              :uid="item.uid"
              @send="enterGroup(item)"
              style="background: rgba(80, 139, 254, 0.2) !important"
              v-show="item.relationship === 'yes'"
            />
          </div>
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
import { useGlobalStore } from "../../../../Global/store";
import { contactStore } from "../../../store/contactStore";

import AddFindButton from "../../../../../components/sns/AddFindButton.vue";
import SendMessageButton from "../../../../../components/sns/SendMessageButton.vue";

const chatServer = window.$chat?.chat;
const router = useRouter();
const props = defineProps({
  userList: {
    type: Array,
    default: () => [],
  },
});
const { userList } = toRefs(props);

/**解构store缓存数据**/ 
const chat = chatStore();
const app = appStore();
const { userInfo } = storeToRefs(app);
const global = useGlobalStore();
const { loginVisible } = storeToRefs(global);
const concat = contactStore();
const { currentContact } = storeToRefs(concat);

// 更新好友关系
const updateRelationship = (e, item) => {
  item.relationship = e.relationship;
};

const enterGroup = async (item) => {
  const name = `C2C${item.uid}`;
  currentContact.value = {
    type: "group",
    groupID:conversationID,
  }
  handlerConversationList(name);
};
const handlerConversationList = (conversationID) => {
  chat.updateConversation(conversationID);
  router.push({ name: "chatMain" });
  TUIConversationService.switchConversation(conversationID);
};

/**提示登录**/
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