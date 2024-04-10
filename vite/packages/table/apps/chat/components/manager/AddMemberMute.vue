<!-- 设置群成员禁言 -->
<template>
  <xt-modal
    v-if="muteVisible"
    v-model="muteVisible"
    title="设置禁言"
    :index="1660"
    :maskIndex="1650"
  >
    <UserSelect :currentLeftList="currentMuteList" @close="muteVisible = false" @forward="updateList"/>
  </xt-modal>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";

import UserSelect from "../user/UserSelect.vue";

const emit = defineEmits(["updateMute"]);
const currentMuteList = ref([]);

// 开启成员禁言弹窗
const muteVisible = ref(false);
const openMuteModal = () => {
  muteVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.GRP,{
      currentGroupMemberList: (data) => {
        const filterList = data.filter((item) => {
          return item.role === "Member";
        });
        currentMuteList.value = filterList;
      },
    })
  });
};

// 更新列表
const updateList = (list) => {
  emit("updateMute", list);
};

defineExpose({
  openMuteModal,
  muteVisible,
});
</script>

<style lang="scss" scoped>
</style>