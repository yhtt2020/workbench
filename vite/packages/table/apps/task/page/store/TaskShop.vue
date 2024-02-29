<template>
  <div class="flex w-full h-full flex-col">
    <PointGoodsList :list="goodList" @enterDetail="goDetail"  v-if="!detailVisible"/>
    <PointGoodsDetail v-else  :id="goodID" @back="detailVisible = false"/>
  </div>
</template>

<script setup>
import {ref,onMounted,computed} from 'vue';
import { taskStore } from '../../store';
import { storeToRefs } from 'pinia';


import PointGoodsList from './PointGoodsList.vue';
import PointGoodsDetail from './PointGoodsDetail.vue';

const task = taskStore();
const { pointGoods }  = storeToRefs(task);
// 商品列表
const goodList = ref(pointGoods.value);

// 今日详情
const detailVisible = ref(false);
// 获取商品详情id
const goodID = ref(0)

/**事件**/
// 进入详情 
const goDetail = (id) =>{
  task.getPointGoodsDetail(id);
  setTimeout(()=>{
    detailVisible.value = true;
  },300)
}


</script>

<style lang="scss" scoped>
</style>