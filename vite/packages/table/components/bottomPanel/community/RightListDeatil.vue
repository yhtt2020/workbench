<template>
  <!-- 全部详情 -->
  <template v-if="type === 'all'">
    <ListItem :list="allDetailList"/>
  </template>

  <!-- 收藏详情 -->
  <template v-else-if="type === 'like'">
    <ListItem :list="likeDetailList" :listType="'like'"/>
  </template>

  <!-- 指定的详情 -->
  <template v-else-if="type === 'other'">
    <ListItem :list="appointDetail"/>
  </template>
</template>

<script setup>
import { toRefs,ref,computed,getCurrentInstance } from "vue";
import { storeToRefs } from 'pinia';
import { communityNavStore } from '../store/communityNavStore';

import ListItem from "./ListItem.vue";

const { proxy } = getCurrentInstance();

const communityNav = communityNavStore();
const { appModalList }  = storeToRefs(communityNav);

const props = defineProps({
  detailIndex:{
    type:Number,
  }
});

const { detailIndex } = toRefs(props);
// 获取全部详情
const allDetailList = computed(()=>{
  const list = appModalList.value.reduce((acc,item)=>{
    if(item.list && Array.isArray(item.list)){
      return [...acc,...item.list]
    }
    else{
      return [];
    }
  },[]);
  return list;
});
// 指定的详情
const appointDetail = computed(()=>{
  if(Array.isArray(appModalList.value[detailIndex.value].list)){
    return appModalList.value[detailIndex.value].list;
  }
});
// 获取type
const type = computed(()=>{
  if(appModalList.value[detailIndex.value].type){
    return appModalList.value[detailIndex.value].type;
  }
  else {
    return 'other';
  }
});
// 获取我的收藏数据
const likeDetailList = computed(()=>{
  if(type.value === 'like'){
    return appModalList.value[0].list;
  }
});



</script>

<style lang="scss" scoped>
</style>