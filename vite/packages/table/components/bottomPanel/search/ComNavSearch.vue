<template>
  <div class="com-nav-bg flex flex-col">
    <!-- 搜索 -->
    <a-input
      v-model:value="search"
      placeholder="搜索"
      class="w-full xt-bg-t-2"
      @change="getSearchResult"
      style="border-radius: 8px !important; height: 40px"
    >
      <template #suffix>
        <div v-if="search === ''" class="pointer" @click="getSearchResult">
          <xt-ify-icon icon="fluent:search-16-regular" size="20"></xt-ify-icon>
        </div>
        <div v-else @click="search = ''" class="pointer">
          <xt-ify-icon icon="fluent:dismiss-16-regular" size="16"></xt-ify-icon>
        </div>
      </template>
    </a-input>
    <div style="height: 8px"></div>
    <!-- 已加入的社群列表 -->
    <xt-scrollbar
      class="flex-1 w-full h-2/3 overflow-hidden"
      :x="false"
      :y="true"
    >
      <div class="flex flex-col">
        <div
          v-for="(item, index) in communityList"
          :key="item.communityInfo.no"
          class="p-2 flex justify-between items-center rounded-lg mb-2 pointer"
          @click="selectCommunity(item, index)"
          :class="currentCommunity.index === index ? 'select' : ''"
        >
          <div class="flex items-center">
            <div style="width: 40px; height: 40px" class="mr-3">
              <img
                :src="item.communityInfo.icon"
                alt=""
                class="w-full h-full object-cover"
                style="border-radius: 10px"
              />
            </div>
            <span class="xt-text xt-font font-16">
              {{ item.communityInfo.name }}
            </span>
          </div>

          <xt-ify-icon
            icon="fluent:checkmark-circle-16-filled"
            v-if="currentCommunity.index === index"
            style="color:rgba(80, 139, 254, 0.6);"
          ></xt-ify-icon>
        </div>
      </div>
    </xt-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { communityStore } from "../../../page/chat/store/communityStore";
import { communityNavStore } from "../store/communityNavStore";

const com = communityStore();
const { community } = storeToRefs(com);
const comNav = communityNavStore();
const { currentCommunity } = storeToRefs(comNav);

const search = ref("");
const communityList = ref([]);

// 获取当前已经加入的社群列表
const getCurrentCommunityList = () =>{
  if (community.value.communityList.length !== 0) {
    const filterList = community.value.communityList.filter((item) => {
      if (item.communityInfo) {
        return item;
      }
    });
    communityList.value = filterList;
  } else {
    communityList.value = [];
  }
}
watchEffect(() => {
  getCurrentCommunityList();
});

// 搜索社群
const getSearchResult = () => {
  if(search.value !== ''){
    const searchList = community.value.communityList.filter((item) => {
      if (item.communityInfo) {
        return item.communityInfo.name.includes(search.value);
      }
    });
    communityList.value = searchList;
  }
  else {
    // 搜索框为空时，重置原来的数据列表
    getCurrentCommunityList();
  }
};
// 选择社群
const selectCommunity = (item, index) => {
  comNav.setCurrentCommunity(item, index);
};
</script>

<style lang="scss" scoped>
.com {
  &-nav-bg {
    width: 280px;
    height: 321px;
    background: var(--primary-bg);
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 13px 12px 12px 12px;
    backdrop-filter: blur(12px);
  }
}
.select {
  background: rgba(80, 139, 254, 0.2) !important;
}
</style>