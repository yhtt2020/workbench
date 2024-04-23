<!-- 联系人模块的好友列表页 -->
<template>
  <div class="w-full h-full flex flex-col px-4">
    <div class="flex w-full items-center justify-between pt-1">
      <span class="xt-text xt-font font-16">好友({{ currentFriendList.length }}个)</span>
    </div>

    <!-- 空状态 -->
    <template v-if="currentFriendList.length === 0">
      <div class="flex flex-col items-center justify-center h-full">
        <xt-ify-icon
          icon="fluent-emoji:sleeping-face"
          size="64"
          style="color: #d9d9d9"
        />
        <span class="xt-text xt-font font-16" style="color: #d9d9d9"
          >暂无群聊</span
        >
      </div>
    </template>

    <xt-scrollbar :y="true" style="height: 100%" v-else>
      <div style="height: 16px"></div>
      <template v-for="item in currentFriendList">
        <div
          class="flex items-center pointer rounded-lg p-4 friend-item"
          @click="handleFriend(item)"
        >
          <a-avatar size="32" :src="item.profile.avatar" />
          <div class="flex flex-col ml-2">
            <span class="xt-text xt-font font-16">{{ item.profile.nick }}</span>
          </div>
        </div>
      </template>
      <div style="height: 16px"></div>
    </xt-scrollbar>
  </div>

  <xt-modal v-if="friendVisible" v-model="friendVisible" custom boxClass="p-0">
    <UserCard
      :key="currentFriendID"
      :uid="currentFriendID"
      :userInfo="userCardUserInfo"
      @close="friendVisible = false"
    />
  </xt-modal>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../../store";
import {
  TUIStore,
  StoreName,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";

import UserCard from "../../../../../components/small/UserCard.vue";

const app = appStore();
const { userCardUserInfo,userInfo } = storeToRefs(app);

/**当前好友数据**/
const currentFriendList = ref([]);
/**查看当前好友信息**/ 
const currentFriendID = ref("");
const friendVisible = ref(false);

TUIStore.watch(StoreName.FRIEND, {
  friendList: (data) => {
    const filterData = _.filter(data, function (item) {
      return String(item.userID) !== String(userInfo.value.uid);
    });
    currentFriendList.value = filterData;
  },
});

// const props = defineProps({
//   list: {
//     type: Array,
//     default: () => [],
//   },
// });
// const { list } = toRefs(props);


// 查看好友信息
const handleFriend = (item) => {
  currentFriendID.value = item.profile.userID;
  friendVisible.value = true;
};
</script>

<style lang="scss" scoped>
.friend {
  &-item {
    &:hover {
      background: rgba(80, 139, 254, 0.2);
    }
  }
}
</style>