<!-- 移除群成员禁言 -->
<template>
  <xt-modal
    v-if="deleteMuteVisible"
    v-model="deleteMuteVisible"
    title="设置禁言"
    :index="1660"
    :maskIndex="1650"
  >
    <UserSelect
      :currentLeftList="currentMuteList"
      @close="muteVisible = false"
      @forward="updateList"
    />
  </xt-modal>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";

import UserSelect from "../user/UserSelect.vue";

const props = defineProps({
  muteList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["deleteMute"]);
const currentMuteList = ref([]);
const deleteMuteVisible = ref(false);
const openDeleteMuteModal = () => {
  deleteMuteVisible.value = true;
  nextTick(() => {
    currentMuteList.value = _.cloneDeep(props.muteList);
  });
};

// 更新列表
const updateList = (list) => {
  emit("deleteMute", list);
};

defineExpose({
  openDeleteMuteModal,
  deleteMuteVisible,
});
</script>

<style lang="scss" scoped>
</style>