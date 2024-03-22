<template>
  <template v-if="searchList.length === 0">
    <ListItem :list="list" :listType="type" />
  </template>
  <template v-else>
    <ListItem :list="searchList" />
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
const list = ref([]);
const searchList = ref([]);

// 获取type
const type = computed(() => {
  const type = appModalList.value[detailIndex.value]?.type;
  // 全部详情
  if(type === 'all'){
    list.value = appModalList.value[1].list;
    return 'all';
  }
  // 我的收藏数据
  else if(type === 'like'){
    const likeList = appModalList.value[1].list?.filter((item)=>{ return item.favo === true });
    list.value = likeList;
    return 'like';
  }
  // 指定的详情
  else if(type === undefined){
    const n_id = appModalList.value[detailIndex.value]?.id;
    const detailList = appModalList.value[1].list.filter((item) => {
      return item.n_id === n_id;
    });
    list.value = detailList;
    return 'other';
  }
});

onMounted(() => {
  proxy.$bus.on("getSearchList", (data) => {
    searchList.value = data;
  });
  proxy.$bus.on("getSelectList", (data) => {
    list.value = data;
  });
});
</script>

<style lang="scss" scoped>
</style>