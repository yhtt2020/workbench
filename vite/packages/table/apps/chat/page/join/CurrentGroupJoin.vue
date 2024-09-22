<!-- 当前群聊未加入的状态页面 -->
<template>
  <div class="w-full flex h-full flex-col items-center justify-center">
    <div style="width: 452px" class="flex flex-col items-center justify-center">
      <template v-if="currentUnGroupInfo?.joinOption === 'FreeAccess'">
        <span
          class="xt-text font-16 xt-font w-full flex items-center justify-center"
        >
          加入群聊
        </span>
      </template>
      <template v-else-if="currentUnGroupInfo?.joinOption === 'NeedPermission'">
        <span
          class="xt-text font-16 xt-font w-full flex items-center justify-center"
        >
          申请加入
        </span>
      </template>

      <!-- 说明 -->
      <div class="xt-bg-2 w-full rounded-xl p-4 mb-4" style="margin-top: 29px">
        <span
          class="xt-text-2 xt-font font-16"
          v-if="currentUnGroupInfo?.joinOption === 'FreeAccess'"
        >
          暂未加入群聊，点击立即加入即可访问
        </span>
        <span
          class="xt-text-2 xt-font font-16"
          v-else-if="currentUnGroupInfo?.joinOption === 'NeedPermission'"
        >
          当前群聊需要申请加入，请提交申请后等待管理员审核
        </span>
      </div>

      <!-- 群聊信息 -->
      <div
        class="xt-bg-t-2 rounded-xl p-4 mb-6 w-full flex items-center justify-start"
      >
        <a-avatar :src="currentUnGroupInfo?.avatar" size="48" shape="square" />
        <div class="flex flex-col ml-4">
          <span class="xt-text xt-font font-16">
            {{ currentUnGroupInfo?.name }}
          </span>
          <span class="xt-text-2 xt-font font-14">
            {{ currentUnGroupInfo?.memberCount }}人
          </span>
        </div>
      </div>

      <!-- 申请加入按钮 -->
      <div class="w-full flex items-center justify-center">
        <xt-button w="96" h="40" class="mr-3" @click="cancelJoin">
          取消
        </xt-button>
        <xt-button
          w="96"
          h="40"
          type="theme"
          @click="joinNow"
          v-if="currentUnGroupInfo?.joinOption === 'FreeAccess'"
        >
          立即加入
        </xt-button>
        <xt-button
          w="96"
          h="40"
          type="theme"
          @click="joinNow"
          v-else-if="currentUnGroupInfo?.joinOption === 'NeedPermission'"
        >
          立即申请
        </xt-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watchEffect, getCurrentInstance } from "vue";
import {
  TUIConversationService,
  TUIStore,
  StoreName,
} from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";
import _ from "lodash-es";

const { proxy } = getCurrentInstance();

const props = defineProps({
  groupInfo: {
    type: Object,
    default: () => {},
  },
});
const { groupInfo } = toRefs(props);

/**社群信息**/
const currentUnGroupInfo = ref({});
/**当前加入的群聊**/
const currentGroupList = ref([]);

watchEffect(async () => {
  try {
    if (groupInfo.value.hasOwnProperty("id")) {
      const groupID = groupInfo.value?.id;
      const res = await window.$chat?.chat?.searchGroupByID(groupID);
      if (res.code === 0) {
        const currentGroup = res.data?.group;
        currentUnGroupInfo.value = currentGroup;
      }
    } else {
      if (groupInfo.value[0]) {
        currentUnGroupInfo.value = groupInfo.value[0];
      } else {
        currentUnGroupInfo.value = groupInfo.value;
      }
    }
  } catch (error) {
    console.warn("异常错误", error);
  }
});

/**当前加入的群聊**/
TUIStore.watch(StoreName.GRP, {
  groupList: (data) => {
    currentGroupList.value = data;
  },
});

/**取消加入**/
const cancelJoin = () => {
  proxy.$bus.emit("cancelJoin");
};
/**立即加入**/
const joinNow = async () => {
  const currentID = currentUnGroupInfo.value?.groupID;
  if(!currentID){
    return message.error('群聊ID无效')
  }
  /**是否存在**/
  const index = _.findIndex(currentGroupList.value, (item) => {
    return String(item?.groupID) === String(currentID);
  });
  if (index === -1) {
    const option = { groupID: currentID };
    let res
    try{
     res= await window.$chat?.chat?.joinGroup(option);
    }catch (e) {
      return message.error('群聊状态异常，请联系社群管理员')
    }

    if (res.code === 0) {
      if (res.data.status === "WaitAdminApproval") {
        message.success("入群申请已发出,等待群主和管理员审核");
      } else if (res.data.status === "JoinedSuccess") {
        message.success("群聊添加成功");
      } else if (res.data.status === "AlreadyInGroup") {
        message.success("已经在群聊中");
      }
      cancelJoin();
    }
  }
  else {
    cancelJoin();
  }
};
</script>

<style lang="scss" scoped>
</style>
