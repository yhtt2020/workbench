<template>
  <a-dropdown :trigger="['click']" :placement="placement">
    <div class="flex items-center justify-center">
      <div class="flex items-center justify-center" v-if="!buttonVisible">
        <slot></slot>
      </div>
      <xt-button v-else :style="{width:`${w}px`,height:`${h}px`}" style="border-radius: 8px;padding: 4px;">
        <div class="flex items-center justify-center">
          <DropIcon :icon="newIcon" :style="{fontSize:`${iconSize}px`}"/>
        </div>
      </xt-button>
    </div>

    <template #overlay>
      <div class="xt-modal rounded-xl p-1 xt-b">
        <template v-for="item in list">
          <div class="flex items-center pl-3 cursor-pointer box text-base xt-text" style="width: 184px; height: 44px; border-radius: 8px" @click="item.callBack">
            <xt-new-icon :icon="item.icon" size="16" class="mr-3"></xt-new-icon>
            {{ item.name }}
          </div>
        </template>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup>
import { computed } from 'vue';
import { Icon as DropIcon } from '@iconify/vue';
const props = defineProps({
  list:{
    type:Array,
    default:()=>[],
  },
  buttonVisible:{
    type:Boolean,
    default:true,
  },
  w:32,
  h:32,
  newIcon:'fluent:play-16-filled',
  iconSize:16,
  placement:String,
})
</script>

<style lang="scss" scoped>
.box{
  &:hover{
    background: var(--active-secondary-bg);
  }
}
</style>