<template>
 <a-timeline>
  <a-timeline-item v-for="item in list" class="item-time">
    <div class="flex">
     <template v-if="item.title !==''">
      <div  class="category-16-600 xt-font mr-4" :class="item.type === 'sign' && item.status === '0' ? 'xt-text': 'xt-text-2'"> {{ item.title }}</div>
     </template>
     <div class="category-14-400 xt-font" :class="item.type === 'sign' && item.status === '0' ? 'xt-text': 'xt-text-2'">{{ item.time }}</div>
    </div>
    <div class="category-14-400 xt-text-2">{{ item.content }}</div>
  </a-timeline-item>
 </a-timeline>
</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'

export default {
 props:['list'],
 components:{
  SmallIcon
 },
}
</script>

<style lang="scss" scoped>
:deep(.ant-timeline-item-head){
 background: var(--secondary-text) !important;
 color: var(--secondary-text) !important;
}
:deep(.ant-timeline-item-head-blue){
 border: none !important;
}

:deep(.item-time){
  &:first-of-type{
   padding-top: 16px;
  }
}
</style>