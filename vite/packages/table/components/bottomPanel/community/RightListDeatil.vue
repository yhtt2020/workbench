<template>
  <template v-if="searchResult.length === 0">
    <!-- 全部详情 -->
    <template v-if="type === 'all'">
      <ListItem :list="allDetailList" :listType="'all'" />
    </template>
    <!-- 收藏详情 -->
    <template v-else-if="type === 'like'">
      <ListItem :list="likeDetailList" :listType="'like'" />
    </template>
    <!-- 指定的详情 -->
    <template v-else-if="type === 'other'">
      <ListItem :list="appointDetail" />
    </template>
  </template>

  <template v-else>
    <ListItem :list="searchResult" />
  </template>
</template>

<script setup>
import { toRefs, ref, computed, getCurrentInstance, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

import ListItem from "./ListItem.vue";

const { proxy } = getCurrentInstance();

const communityNav = communityNavStore();
const { appModalList } = storeToRefs(communityNav);

const props = defineProps({
  detailIndex: {
    type: Number,
  },
});

const { detailIndex } = toRefs(props);
const searchResult = ref([]);

// 获取全部详情
const allDetailList = computed(() => {
  return appModalList.value[1].list;
});
// 指定的详情
const appointDetail = computed(() => {
  const n_id = appModalList.value[detailIndex.value].id;
  const list = appModalList.value[1].list.filter((item) => {
    return item.n_id === n_id;
  });
  return list;
});
// 获取type
const type = computed(() => {
  if (appModalList.value[detailIndex.value].type) {
    return appModalList.value[detailIndex.value].type;
  } else {
    return "other";
  }
});
// 获取我的收藏数据
const likeDetailList = computed(() => {
  if (type.value === "like") {
    return appModalList.value[0].list;
  }
});

onMounted(() => {
  proxy.$bus.on("getSearchList", (data) => {
    searchResult.value = data;
  });
});
</script>

<style lang="scss" scoped>
</style>