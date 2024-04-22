<template>
  <div
    v-if="!item?.isBg"
    :style="{
      borderRadius: navigationBar.iconRadius + 'px',
       background: item?.bg || '',
       width:size + 'px',
       height:size + 'px' }"
    class="relative flex items-center justify-center ">
    <a-avatar
      :size="size"
      shape="square"
      :src="item?.icon"
      :style="{
        borderRadius: navigationBar.iconRadius + 'px' }">
    </a-avatar>
    <slot :name="item?.slot"></slot>
  </div>
  <div v-else :style="{width:size + 'px',height:size + 'px'}">
    <div
      class="relative flex items-center justify-center overflow-hidden"
      :style="{ borderRadius: navigationBar.iconRadius + 'px', background: item?.bg || '',width:size + 'px',height:size + 'px' }">
      <a-avatar
        :size="(size / 2)"
        shape="square"
        :src="renderIcon(item?.icon)"
        :style="[{ borderRadius: navigationBar.iconRadius + 'px' }, item?.color]">
      </a-avatar>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive,computed} from 'vue'
import { renderIcon } from '../../../../js/common/common';
import { useNavigationStore } from '../navigationStore';
const navigationBar = useNavigationStore();
const props = defineProps({
  item: Object,
  size:{
    type:Number,
    default:52
  }
})
</script>
<style lang='scss' scoped></style>
