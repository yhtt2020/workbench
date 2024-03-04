<template>
  <div class="flex w-full h-full flex-col">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <!-- <xt-ify-icon icon="fluent:building-shop-16-filled" class="mr-2 xt-text" size="16"></xt-ify-icon> -->
        <!-- fluent-emoji:shopping-bags -->
        <xt-ify-icon icon="fluent-emoji:shopping-bags" class="mr-2 xt-text" size="16"></xt-ify-icon>
        <span class="xt-text xt-font font-14">积分商城</span>
      </div>
      <Exit />
    </div>
    <template v-if="isGuest">
      <div class="h-full flex items-center flex-col justify-center">
        <img src="/img/taskShop.png" style="width: 220px;height: 220px;" class="object-cover mb-4"/>
        <span class="xt-font  xt-text font-16">打开微信扫一扫</span>
      </div>
    </template>

    <PointGoodsList :list="goodList" @enterDetail="goDetail"  v-else-if="!detailVisible"/>
    <PointGoodsDetail v-else  :id="goodID" @back="detailVisible = false"/>
  </div>
</template>

<script setup>
import {ref,onMounted,computed} from 'vue';
import { taskStore } from '../../store';
import { storeToRefs } from 'pinia';


import PointGoodsList from './PointGoodsList.vue';
import PointGoodsDetail from './PointGoodsDetail.vue';
import Exit from "../../components/Exit.vue";

const task = taskStore();
const { pointGoods }  = storeToRefs(task);
// 商品列表
const goodList = ref(pointGoods.value);

// 详情
const detailVisible = ref(false);
// 获取商品详情id
const goodID = ref(0);

// 游客模式
// window.$useEnv('guest')
const isGuest = computed(()=>{
  return window.$useEnv('guest');
})

/**事件**/
// 详情 
const goDetail = (id) =>{
  task.getPointGoodsDetail(id);
  setTimeout(()=>{
    detailVisible.value = true;
  },300)
}


</script>

<style lang="scss" scoped>
</style>