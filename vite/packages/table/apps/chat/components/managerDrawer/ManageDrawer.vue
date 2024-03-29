<!-- 群管理页 -->
<template>
  <teleport to="body">
    <a-drawer
      v-model:visible="manageVisible"
      title="群管理"
      width="500"
      :zIndex="1500"
    >
      <!-- 群基本信息 -->
      <div
        class="xt-bg-2 rounded-xl flex flex-col p-4 pointer"
        @click="openManageName"
      >
        <div class="flex items-center justify-between pointer mb-3">
          <span class="xt-text font-16 xt-font">群信息</span>
          <xt-ify-icon
            icon="fluent:chevron-right-28-regular"
            class="xt-text-2"
            size="20"
          ></xt-ify-icon>
        </div>
        <div class="flex items-center pointer">
          <a-avatar
            :src="manageInfo.avatar"
            size="48"
            shape="square"
          ></a-avatar>
          <span class="ml-3 xt-text-2 font-14 xt-font">{{
            manageInfo.groupName
          }}</span>
        </div>
      </div>

      <!-- 群公告 -->
      <div
        class="xt-bg-2 rounded-xl flex flex-col p-4 my-4"
        @click="openManageNotice"
      >
        <div class="flex items-center justify-between pointer mb-3" @click="openManageNotice">
          <span class="xt-text font-16 xt-font">群公告</span>
          <xt-ify-icon
            icon="fluent:chevron-right-28-regular"
            class="xt-text-2"
            size="20"
          ></xt-ify-icon>
        </div>
        <span class="w-full xt-text-2 xt-font font-14">
          {{ manageInfo.notification }}
        </span>
      </div>

      <!-- 群成员 -->
      <div class="xt-bg-2 rounded-lg flex flex-col p-4 mb-4">
        <div class="flex items-center justify-between pointer mb-3">
          <span class="xt-text font-16 xt-font">群成员</span>
          <xt-ify-icon
            icon="fluent:chevron-right-28-regular"
            class="xt-text-2"
            size="20"
          ></xt-ify-icon>
        </div>
      </div>

      <!-- 群类型展示区域 -->
      <div class="xt-bg-2 rounded-lg flex flex-col p-4">
        <div class="flex items-center justify-between pointer mb-3">
          <span class="xt-text font-16 xt-font">群管理</span>
          <xt-ify-icon
            icon="fluent:chevron-right-28-regular"
            class="xt-text-2"
            size="20"
          ></xt-ify-icon>
        </div>
      </div>
    </a-drawer>
  </teleport>

  <!-- 修改群昵称和头像基本信息弹窗 -->
  <GroupName
    ref="nameRef"
    :info="manageInfo"
    @closeName="manageVisible = true"
  />
  <!-- 修改公告弹窗 -->
  <NoticeDrawer
    :groupID="manageInfo.groupID"
    ref="noticeRef"
    :isBack="true"
    @closeNotice="manageVisible = true"
  />
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";

import GroupName from "../manager/GroupName.vue";
import NoticeDrawer from "./NoticeDrawer.vue";

const props = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});
const { groupID } = toRefs(props);

// 群管理信息
const manageInfo = ref({});
const nameRef = ref(null);
const noticeRef = ref(null);

// 开启群基础信息修改弹窗
const manageVisible = ref(false);
const openManageDrawer = () => {
  manageVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.CONV, {
      currentConversation: (data) => {
        const { groupProfile } = data;
        console.log("groupProfile", groupProfile);
        manageInfo.value.avatar = groupProfile?.avatar;
        manageInfo.value.groupName = groupProfile?.name;
        manageInfo.value.groupID = groupProfile?.groupID;
        manageInfo.value.role = groupProfile?.selfInfo?.role;
        manageInfo.value.notification = groupProfile?.notification;
      },
    });
  });
};

// 开启群昵称和头像修改弹窗
const openManageName = () => {
  manageVisible.value = false;
  nameRef.value.openNameDrawer();
};
// 开启群公告修改弹窗
const openManageNotice = () => {
  manageVisible.value = false;
  noticeRef.value.openNoticeDrawer();
};

defineExpose({
  openManageDrawer,
});
</script>

<style lang="scss" scoped>
</style>