<!-- 社群频道创建流程中, 选择自己创建的群聊(自定义) -->
<template>
  <xt-modal v-if="customVisible" v-model="customVisible" custom>
    <div class="p-4 flex flex-col">
      <div class="w-full flex items-center justify-between mb-4">
        <xt-button
          w="32"
          h="32"
          @click="returnPreviousStep"
          style="border-radius: 8px"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>
        <span class="xt-text xt-font font-16">选择群聊</span>
        <xt-button
          w="32"
          h="32"
          style="border-radius: 8px"
          @click="customVisible = false"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-16-filled"
              class="xt-text"
              size="20"
            />
          </div>
        </xt-button>
      </div>

      <GroupSelect
        :currentLeftList="customGroupList"
        @close="customVisible = false"
        @forward="getCreateList"
      />
    </div>
  </xt-modal>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";

import GroupSelect from "../../user/GroupSelect.vue"

const emit = defineEmits(["prev"]);

const customGroupList = ref([]);

// 开启自定义群聊选择弹窗
const customVisible = ref(false);
const openCustomGroupModal = () => {
  customVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.GRP, {
      groupList: (list) => {
        const filterList = _.filter(list, function (item) {
          const role = item?.selfInfo?.role;
          return role === "Owner";
        });
        customGroupList.value = filterList;
        console.log('filterList',filterList);
      },
    });
  });
};

// 返回上一步
const returnPreviousStep = () => {
  customVisible.value = false;
  emit("prev");
};

// 选择后的回调函数
const getCreateList = (list) => {
  customVisible.value = false;
  emit("next", list);
};

defineExpose({
  openCustomGroupModal,
});
</script>

<style lang="scss" scoped>
</style>