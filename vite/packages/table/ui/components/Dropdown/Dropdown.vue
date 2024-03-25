<template>
  <a-dropdown :disabled="disabled"  :trigger="[`${trigger}`]" :placement="placement">
    <div class="flex items-center justify-center">
      <div class="flex items-center justify-center" v-if="!buttonVisible">
        <slot name="sendIcon"></slot>
      </div>
      <xt-button v-else :disabled="disabled" :style="{width:`${w}px`,height:`${h}px`}" :class="buttonClass" style="border-radius: 8px;padding: 4px;">
        <div class="flex items-center justify-center" v-if="title === ''">
          <DropIcon :icon="newIcon" :style="{fontSize:`${iconSize}px`,color:`${iconBg}`}" />
        </div>
        <slot name="sendTitle" v-else></slot>
      </xt-button>
    </div>

    <template #overlay>
      <slot></slot>
    </template>
  </a-dropdown>
</template>

<script setup>
import { computed } from 'vue';
import { Icon as DropIcon } from '@iconify/vue';
const props = defineProps({
  // 是否按钮形式点击
  buttonVisible:{
    type:Boolean,
    default:true,
  },
  w:32,
  h:32,
  newIcon:'fluent:play-16-filled',
  // 图标大小
  iconSize:16,
  // 位置摆放
  placement:{
    type:String,
    default:'top'
  },
  // 事件切换模式
  trigger:{
    type:String,
    default:'click',
  },
  buttonClass:{
    type:String,
    default:'xt-bg-2'
  },
  iconBg:{
    type:String,
    default:'var(--primary-text)'
  },
  title:{
    type:String,
    default:'',
  },
  disabled:{
    type:Boolean,
    default:false,
  }
  
})

</script>

<style lang="scss" scoped>
</style>