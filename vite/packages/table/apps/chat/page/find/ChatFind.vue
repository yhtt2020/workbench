<!-- 群聊发现入口页 -->
<template>
  <div class="w-full h-full flex flex-col px-4">
    <div class="flex items-center h-10 mb-4">
      <xt-option-tab
        :list="communityList"
        v-model="communityDefault"
        :circle="false"
        style="height: 40px; width: 500px"
      />
      <a-input
        v-model:value="searchKeyWord"
        v-if="communityDefault === 'community'"
        style="
          width: 244px;
          border-radius: 10px;
          background: var(--secondary-bg);
        "
        spellcheck="false"
        placeholder="搜索"
        class="h-10 ml-3"
        @pressEnter="findSearch"
        @change="findSearch"
        ref="findSearchRef"
      >
        <template #suffix>
          <xt-ify-icon
            icon="fluent:search-20-filled"
            @click="findSearch"
            size="20"
            v-if="searchKeyWord === ''"
          />
          <xt-ify-icon
            icon="fluent:dismiss-circle-16-filled"
            size="16"
            class="xt-text-2"
            v-else
            @click="searchKeyWord = ''"
          />
        </template>
      </a-input>
    </div>
    <div class="flex flex-1" style="height: calc(100% - 56px);">
      <CommunityFind
        v-if="communityDefault === 'community'"
        :communityList="searchList" :searchKeyWord="searchKeyWord"
      />
      <GroupUserFind v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { CommunityAPI } from "../../api/communityAPI";

import CommunityFind from "./CommunityFind.vue";
import GroupUserFind from "./GroupUserFind.vue";

const comAPI = new CommunityAPI();

const communityList = ref([
  { name: "社群", value: "community" },
  { name: "群聊和用户", value: "user" },
]);
const communityDefault = ref("community");
// 搜索关键字
const searchKeyWord = ref("");
const findSearchRef = ref(null);
const searchList = ref([]);

// 搜索事件
const findSearch = async() => {
  if(searchKeyWord.value !== ''){
    const res = await comAPI.communitySearch(searchKeyWord.value);
    if(res.status === 1){
      const list = res.data.list;
      searchList.value = list;
    }
    else {
      searchList.value = [];
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.box-border) {
  margin: 0 !important;
}
:deep(.ant-input) {
  color: var(--secondary-text) !important;
  font-size: 14px;
  font-weight: 400;
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
</style>