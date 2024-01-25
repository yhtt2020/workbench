<template>
  <div style="width: 52px; height: 52px;" v-if="!item.isBg"
    :style="{ borderRadius: navigationBar.iconRadius + 'px', background: item.bg || '' }"
    class="relative flex items-center justify-center ">
    <xt-new-icon icon="fluent-emoji:globe-with-meridians" size="45" v-if="isLink"></xt-new-icon>
    <a-avatar v-else  :size="52" shape="square" :src="item.icon" :style="{ borderRadius: navigationBar.iconRadius + 'px' }"></a-avatar>
  </div>
  <div v-else style="width: 52px; height: 52px;">
    <div style="width: 52px; height: 52px;" class="relative flex items-center justify-center overflow-hidden"
      :style="{ borderRadius: navigationBar.iconRadius + 'px', background: item.bg || '' }">
      <a-avatar :size="36" shape="square" :src="renderIcon(item.icon)"
        :style="[{ borderRadius: navigationBar.iconRadius + 'px' }, item.color]"></a-avatar>
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
})

const isLink = computed(()=>{
  if(props.item.linkIcon){
    return true
  }else{
    return false
  }
})
</script>
<style lang='scss' scoped></style>