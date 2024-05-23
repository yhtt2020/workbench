<template>
<div style="width: 400px" class="flex flex-col">
  <div class="mb-2">展示的商品</div>
  <div class="flex h-0 flex-1">
    <xt-scrollbar :y="true" class=" h-full w-full">
      <GoodsList :list="customData.goods"></GoodsList>
    </xt-scrollbar>
  </div>
  <xt-button class="mt-2" @click="clear">清空数据</xt-button>

</div>
</template>

<script setup lang="ts">
import {ref,toRefs,defineEmits,defineProps} from 'vue'
import GoodsList from "./GoodsList.vue";
const props=defineProps(['customData'])
const clear=()=>{
  props.customData={}
}
</script>

<style scoped>

</style>
