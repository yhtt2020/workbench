<template>
    <div style="width: 52px; height: 52px;" v-if="!item.isBg"
        :style="{ borderRadius: iconRadius + 'px', background: item.bg || '' }"
        class="relative flex items-center justify-center ">
        <a-avatar :size="52" shape="square" :src="item.icon" :style="{ borderRadius: iconRadius + 'px' }"
            :class="{ 'shaking-element': shakeElement }"></a-avatar>
    </div>
    <div v-else style="width: 52px; height: 52px;margin-top: -5px;"
        class="relative flex items-center justify-center overflow-hidden"
        :style="{ borderRadius: iconRadius + 'px', background: item.bg || '' }">
        <a-avatar :size="36" shape="square" :src="renderIcon(item.icon)"
            :style="[{ borderRadius: iconRadius + 'px' }, item.color]"
            :class="{ 'shaking-element': shakeElement }"></a-avatar>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { renderIcon } from '../../../../js/common/common';
import { useNavigationStore } from '../navigationStore';
const { iconRadius } = useNavigationStore();
const props = defineProps({
    item: Object,
    shakeElement: Boolean
})

</script>
<style lang='scss' scoped>
.shaking-element {
  // animation: shake 0.5s infinite;
  animation: shake 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 2 alternate;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }

  25% {
    transform: rotate3d(0, 0, 1, -15deg);
  }

  50% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  75% {
    transform: rotate3d(0, 0, 1, -15deg);
  }

  100% {
    transform: translateY(0);
  }
}

</style>