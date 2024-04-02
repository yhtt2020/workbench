<!-- 通过群聊中的按钮触发用户选择继续群聊创建弹窗页 -->
<template>
  <xt-modal v-if="groupVisible" v-model="groupVisible" title="群聊创建">
    <UserSelect
      :currentLeftList="friendList"
      @forward="handleForward"
      @close="groupVisible = false"
    />
  </xt-modal>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";

import UserSelect from "../../../components/user/UserSelect.vue";

const friendList = ref([]);

// 群聊创建弹窗
const groupVisible = ref(false);
const openGroupCreate = () => {
  groupVisible.value = true;
  nextTick(() => {
    // 打开弹窗后的回调
    TUIStore.watch(StoreName.FRIEND, {
      friendList: (data) => {
        const list = data.map((item) => {
          return { ...item?.profile };
        });
        friendList.value = list;
      },
    });
  });
};

// 用户数据选择后,通过回调进行群聊创建
const handleForward = (list) => {
  const getUserID = list.map((item) => {
    return { userID: item?.userID };
  });
  console.log("测试", getUserID);
};

defineExpose({
  openGroupCreate,
});
</script>

<style lang="scss" scoped>
</style>