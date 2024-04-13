<!-- 社群加入页面 -->
<template>
  <xt-modal
    v-if="joinComVisible"
    v-model="joinComVisible"
    title="加入社群"
    @close="closeJoinCom"
  >
    <div style="width: 500px; height: 400px" class="flex flex-col mt-4">
      <a-input
        placeholder="搜索"
        :spellcheck="false"
        v-model:value="joinData.searchKeyword"
        class="h-10"
        style="border-radius: 10px"
        @keyup.enter="searchCommunity"
        @input="searchCommunity"
      >
        <template #suffix>
          <div
            class="flex items-center justify-center"
            v-if="joinData.searchKeyword === ''"
          >
            <xt-ify-icon icon="fluent:search-16-regular" size="20" />
          </div>
          <div v-else class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-circle-16-filled"
              size="16"
              @click="joinData.searchKeyword = ''"
            />
          </div>
        </template>
      </a-input>

      <div class="w-full flex flex-col my-4">
        <span
          v-if="joinData.searchKeyword === ''"
          class="font-14 font-400 xt-text-2 xt-font"
        >
          推荐社群
        </span>
        <span v-else class="font-14 font-400 xt-text-2 xt-font">
          搜索结果
        </span>
      </div>

      <template v-if="joinData.searchKeyword === ''">
        <RecommendDetail :list="getCommunity" @close="closeJoinCom" />
      </template>

      <template v-else>
        <SearchDetail :list="joinData.searchResult" @close="closeJoinCom" />
      </template>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import { message } from "ant-design-vue";
import _ from "lodash-es";

import RecommendDetail from "../../components/join/RecommendDetail.vue";
import SearchDetail from "../../components/join/SearchDetail.vue";

const chatCommunity = chatCommunityStore();
const { officialList } = storeToRefs(chatCommunity);

const joinData = ref({
  searchKeyword: "",
  searchResult: [],
});

// 开启加入社区弹窗
const joinComVisible = ref(false);
const openJoinCom = () => {
  joinComVisible.value = true;
  nextTick(() => {
    chatCommunity.getRecommendCommunity();
  });
};

// 关闭加入社区弹窗
const closeJoinCom = () => {
  joinComVisible.value = false;
  joinData.value.searchKeyword = "";
};

// 通过计算属性获取推荐社区列表
const getCommunity = computed(() => {
  return officialList.value;
});

// 搜索
const searchCommunity = async (evt) => {
  // if (joinData.value.searchKeyword !== "") {
  //   const result = await com.searchRecommendCommunity(
  //     joinData.value.searchKeyword
  //   );
  //   if (result.status === 1) {
  //     joinData.value.searchResult = result.list;
  //   } else {
  //     joinData.value.searchResult = [];
  //   }
  // } else {
  //   joinData.searchResult = [];
  // }
};

// 暴露给父组件的方法
defineExpose({
  openJoinCom,
});
</script>

<style lang="scss" scoped>
</style>