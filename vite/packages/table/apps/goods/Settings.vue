<template>
  <div class="flex flex-col p-3 xt-main-bg" style="width: 200px">
    <template v-for="(item, index) in navList">
      <div v-if="!item.disabled"
        class="flex items-center mb-3 cursor-pointer"
        style="height: 44px; border-radius: 10px"
        @click="selectNav(index)"
        :class="{ 'xt-theme-bg-2': activeIndex === index }"
      >
        <xt-ify-icon :icon="item.icon" class="mx-3" />
        {{ item.name }}
      </div>

    </template>

  </div>
  <div class="flex flex-col h-full p-3 xt-modal" style="max-height: 80vh;min-height: 40vh">
    <!-- 头部 -->
    <div class="flex items-center w-full mb-3">
      {{navList[activeIndex].name}}
      <xt-button
        class="absolute right-3"
        @click="closeNav"
        icon="fluent:dismiss-16-regular"
        w="32"
        h="32"
        radius="8"
        iconSize="16"
      ></xt-button>
    </div>
    <div v-if="activeIndex===0" class="flex flex-row flex-1 h-0 gap-2 ">
      <AddGoods></AddGoods>
    </div>
    <div v-if="activeIndex===1" class="flex flex-row flex-1 h-0 gap-2 ">
      <MyPromo :customData="customData"></MyPromo>
    </div>
    <div v-if="activeIndex===2" class="flex flex-row flex-1 h-0 gap-2 ">
      <OrderList :customData="customData"></OrderList>
    </div>
    <div v-if="activeIndex===3" class="flex flex-row flex-1 h-0 gap-2 ">
      <Appearance :customData="customData"></Appearance>
    </div>
  </div>
</template>

<script setup lang="ts">
import Appearance from './Appearance.vue'
import {ref,toRefs,defineEmits,defineProps} from 'vue'
import AddGoods from './AddGoods.vue'
import {goodsStore} from "./goodsStore";
import MyPromo from "./MyPromo.vue";
import OrderList from "./OrderList.vue";
const currentTab=ref('add')
const activeIndex = ref(0);
const {myPromoGoods} = toRefs(goodsStore())
const emit=defineEmits(['close'])
const props=defineProps(['customData'])
const selectNav = (index: number) => {
  activeIndex.value = index;
};
 const navList=[
   {
     name: "搜索商品",
     icon: "fluent:search-16-filled",
     component: "Common",
     disabled: false,
   },
   {
     name: "我的选品 " ,
     icon: "fluent:box-16-filled",
     component: "myPromo",
     disabled: false,
   },
   {
     name: "推广订单" ,
     icon: "fluent:clipboard-bullet-list-16-filled",
     component: "orderList",
     disabled: false,
   },
   {
     name: "组件外观",
     icon: "fluent:color-16-filled",
     component: "Common",
     disabled: false,
   },
 ]

const closeNav=()=>{
   emit('close')
}
</script>

<style scoped lang="scss">
.active {
  border-radius: 10px;
  background: var(--primary-bg-2);
}
</style>
