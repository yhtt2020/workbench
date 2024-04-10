<!-- 群聊联系人页面 -->
<template>
  <div class="w-full h-full flex">
    <!-- 左侧tab切换 -->
    <div style="width: 285px" class="flex flex-col">
      <template v-for="item in leftTab">
        <div
          class="w-full flex p-4 items-center pointer contact-item"
          :class="{ select: currentContact === item.type }"
          @click="changeContact(item)"
        >
          <div
            :style="{ background: `${item.color}` }"
            class="w-8 h-8 mr-3 rounded-lg flex items-center justify-center"
          >
            <xt-ify-icon :icon="item.icon" size="20" style="color: #ffffff" />
          </div>
          <span class="xt-text xt-font font-16">
            {{ item.title }}
            <template v-if="item.type === 'group' &&  groupList.length !== 0">
              ({{ groupList.length }})
            </template>
            <template v-else-if="item.type === 'friend' &&  currentFriendList.length  !== 0">
              ({{ currentFriendList.length }})
            </template>
            <template v-else-if="item.type === 'notice' && noticeList.length !== 0">
              ({{ noticeList.length }})
            </template>
          </span>
        </div>
      </template>
    </div>
    <!-- 分割线 -->
    <div class="h-full" style="background: var(--divider); width: 1px"></div>

    <!-- 右侧对应数据显示区域,由于页面较少,暂时没有走路由 -->
    <div class="flex-1 w-auto h-full">
      <template v-if="currentContact === 'notice'">
        <Notice/>
      </template>
      <template v-else-if="currentContact === 'group'">
        <Group :list="groupList"/>
      </template>
      <template v-else-if="currentContact === 'friend'">
        <Friend :list="currentFriendList"/>
      </template>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  TUIStore,
  StoreName,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";
import { storeToRefs } from "pinia";
import { contactStore } from "../../store/contactStore";
import { appStore } from "../../../../store";
import _ from "lodash-es";

import Group from "./page/Group.vue";
import Friend from "./page/Friend.vue";
import Notice from "./page/Notice.vue";

const chat = window.$chat.chat;

const contact = contactStore();
const app = appStore();
const { currentContact } = storeToRefs(contact);
const { userInfo } = storeToRefs(app);

const groupList = ref([]);
const currentFriendList = ref([]);
const noticeList = ref([]);

const leftTab = ref([
  {
    title: "通知",
    icon: "fluent:alert-16-regular",
    color: "var(--warning)",
    type: "notice",
  },
  {
    title: "群聊",
    icon: "ant-design:message-outlined",
    color: "var(--link)",
    type: "group",
  },
  {
    title: "好友",
    icon: "fluent:emoji-smile-slight-24-regular",
    color: "var(--success)",
    type: "friend",
  },
]);

const changeContact = (item) => {
  currentContact.value = item.type;
};

// 获取联系人数据
const getContact = () => {
  TUIStore.watch(StoreName.GRP, {
    groupList: (data) => {
      groupList.value = data;
    },
  });
  TUIStore.watch(StoreName.FRIEND, {
    friendList: (data) => {
      const filterData = _.filter(data,function(item){ return String(item.userID) !== String(userInfo.value.uid) });
      currentFriendList.value = filterData;
    },
  });
};

onMounted(() => {
  getContact();
});
</script>

<style lang="scss" scoped>
.contact {
  &-item {
    &:hover {
      background: rgba(80, 139, 254, 0.2) !important;
    }
  }
}
.select {
  background: rgba(80, 139, 254, 0.2) !important;
}
</style>