<!-- 群聊联系人页面 -->
<template>
  <!-- 这部分是最新调整 -->
  <div class="flex w-full justify-between flex-col">
    <div class="flex w-full justify-between items-center">
      <span class="w-full xt-font xt-text font-14 mb-3">通讯录</span>
      <xt-button style="width: auto !important" h="0" @click="clickCollapse">
        <div class="flex items-center justify-center">
          <xt-ify-icon
            icon="fluent:caret-down-16-filled"
            v-if="!setting.isCollapse"
            size="20"
            class="xt-text"
          />
          <xt-ify-icon
            icon="fluent:caret-up-16-filled"
            size="20"
            class="xt-text"
            v-else
          />
        </div>
      </xt-button>
    </div>

    <template v-if="!setting.isCollapse">
      <template v-for="item in leftTab">
        <div
          class="w-full flex pl-2 pr-2 pt-2.5 pb-2.5 mb-2 items-center pointer rounded-lg justify-between contact-item"
          :class="{ select: currentContact.type === item.type }"
          @click="changeContact(item)"
        >
          <div class="mr-3 rounded-lg flex items-center justify-center">
            <xt-ify-icon :icon="item.icon" size="16" class="xt-text-2 mr-2" />
            <span class="xt-text-2 xt-font font-14"> {{ item.title }}</span>
          </div>
          <template v-if="item.type === 'contact-group'">
            <span class="xt-text-2 xt-font font-14">
              {{ groupList?.length }}
            </span>
          </template>
  
          <template v-else-if="item.type === 'contact-friend'">
            <span class="xt-text-2 xt-font font-14">
              {{ currentFriendList?.length }}
            </span>
          </template>
  
          <template v-else-if="item.type === 'contact-notice'">
            <span class="xt-text-2 xt-font font-14">
              {{ noticeList?.length }}
            </span>
          </template>
  
          <template v-else-if="item.type === 'contact-community'">
            <span class="xt-text-2 xt-font font-14">
              {{ community?.length }}
            </span>
          </template>
        </div>
      </template>
    </template>
  </div>

  <!-- 旧版通讯录UI代码 -->
  <!-- <div class="w-full h-full flex">
    左侧tab切换
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
            <template v-if="item.type === 'group' &&  groupList?.length !== 0">
              ({{ groupList?.length }})
            </template>
            <template v-else-if="item.type === 'friend' &&  currentFriendList?.length  !== 0">
              ({{ currentFriendList?.length }})
            </template>
            <template v-else-if="item.type === 'notice' && noticeList?.length !== 0">
              ({{ noticeList?.length }})
            </template>
          </span>
        </div>
      </template>
    </div>
    分割线
    <div class="h-full" style="background: var(--divider); width: 1px"></div>
    右侧对应数据显示区域,由于页面较少,暂时没有走路由
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
  </div> -->
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  TUIStore,
  StoreName,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";
import { storeToRefs } from "pinia";
import { contactStore } from "../../store/contactStore";
import { appStore } from "../../../../store";
import _ from "lodash-es";

// import Group from "./page/Group.vue";
// import Friend from "./page/Friend.vue";
// import Notice from "./page/Notice.vue";

const chat = window.$chat.chat;

const contact = contactStore();
const app = appStore();
const { currentContact, setting } = storeToRefs(contact);
const { userInfo } = storeToRefs(app);

const groupList = ref([]);
const currentFriendList = ref([]);
const noticeList = ref([]);
/**组织**/
const community = ref([]);

const leftTab = ref([
  {
    title: "通知",
    icon: "fluent:alert-16-regular",
    type: "contact-notice",
  },
  {
    title: "群聊",
    icon: "ant-design:message-outlined",
    type: "contact-group",
  },
  {
    title: "好友",
    icon: "fluent:emoji-smile-slight-24-regular",
    type: "contact-friend",
  },
  /**后期开发再放开**/
  // {
  //   title: "组织",
  //   type: "contact-community",
  //   icon: "fluent:people-community-16-regular",
  // },
]);

const changeContact = (item) => {
  currentContact.value = {
    type: item.type,
    groupID: "",
  };
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
      const filterData = _.filter(data, function (item) {
        return String(item.userID) !== String(userInfo.value.uid);
      });
      currentFriendList.value = filterData;
    },
  });
};

/**隐藏通讯录**/
const clickCollapse = () => {
  setting.value.isCollapse = !setting.value.isCollapse;
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