<!-- 群聊转让页面 -->
<template>
  <xt-modal v-if="transferVisible" v-model="transferVisible" title="转让群管理">
    <UserSelect
      :currentLeftList="currentTransfer"
      @close="transferVisible = false"
      @forward="getTransferList"
      :isRadio="false"
    />
  </xt-modal>
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import { TUIStore, StoreName,TUIGroupService } from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";

import UserSelect from "../user/UserSelect.vue";
import { message } from "ant-design-vue";

const chat = window.$chat?.chat;
const currentTransfer = ref([]);

const props = defineProps({
  currentGroupID: {
    type: String,
    required: true,
  },
});
const { currentGroupID } = toRefs(props);

const transferVisible = ref(false);
const openTransferModal = () => {
  transferVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.GRP, {
      currentGroupMemberList: (data) => {
        const memberArr = _.filter(data, function (item) {
          return item?.role !== "Owner";
        });
        currentTransfer.value = memberArr;
      },
    });
  });
};

// 触发转让
const getTransferList = async (list) => {
  const option = {
    groupID: currentGroupID.value,
    newOwnerID: list.userID,
  };
  const res = await chat.changeGroupOwner(option);
  if(res.code === 0){
   message.success('转让成功');
   transferVisible.value = false;
  }
};

defineExpose({
  openTransferModal,
});
</script>

<style lang="scss" scoped>
</style>