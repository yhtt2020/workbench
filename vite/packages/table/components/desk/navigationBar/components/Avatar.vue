<template>
  <div style="width: 52px; height: 52px;" v-if="!item.isBg"
    :style="{ borderRadius: navigationBar.iconRadius + 'px', background: item.bg || '' }"
    class="relative flex items-center justify-center ">
    <a-avatar  :size="52" shape="square" :src="item.icon" :style="{ borderRadius: navigationBar.iconRadius + 'px' }"></a-avatar>
    <slot :name="item.slot"></slot>
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
</script>
<style lang='scss' scoped></style>