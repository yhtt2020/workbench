<!-- 创建群聊会话 -->
<template>
  <xt-modal
    v-if="createGroupVisible"
    v-model="createGroupVisible"
    :title="modalTitle"
    :index="1000"
  >
    <UserSelect
      :currentLeftList="currentFriendList"
      @close="createGroupVisible = false"
      @forward="getCreateList"
      class="mt-3"
    />
  </xt-modal>

   <NextCreateGroupSession ref="nextRef" :nextList="nextList" @close="createGroupVisible = false"/>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../store";

import UserSelect from "../user/UserSelect.vue";
import NextCreateGroupSession from "./NextCreateGroupSession.vue";

// 解构app中的缓存数据
const app = appStore();
const { userInfo } = storeToRefs(app);

// 弹窗标题
const modalTitle = ref("选择联系人");
// 获取好友列表
const currentFriendList = ref([]);
// 下一步数组
const nextList = ref([]);
const nextRef = ref(null);

// 开启创建群聊用户选择弹窗
const createGroupVisible = ref(false);
const openCreateGroupSession = () => {
  createGroupVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.FRIEND, {
      friendList: (data) => {
        const filterData = _.filter(data, function (item) {
          return String(item.userID) !== String(userInfo.value.uid);
        });
        const mapList = _.map(filterData, function (item) {
          return item.profile;
        });
        console.log("测试", mapList);
        currentFriendList.value = mapList;
      },
    });
  });
};

// 获取用户选择后的结果进行下一步处理
const getCreateList = (list) => {
  nextList.value = list;
  nextRef.value.openNextCreateGroup();
};

defineExpose({
  openCreateGroupSession,
});
</script>

<style lang="scss" scoped>
</style>