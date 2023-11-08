<template>
 <a-dropdown :trigger="['click']" placement="bottomRight">
  <xt-button w="32" h="32" style="border-radius: 8px !important;">
   <div class="xt-text flex items-center justify-center pointer"> 
    <DropIcon :icon="icon" style="font-size: 1.25rem;"/> 
   </div>
  </xt-button>
  <template #overlay>
   <a-menu class="flex flex-col items-center justify-center" style="width: 140px;border-radius: 8px; padding: 8px;">
    <a-menu-item v-for="item in navList" class="flex xt-text w-full nav-item rounded-lg flex-col items-center justify-center"
     @click="selectNav(item)"
    >
     {{ item.title }}
    </a-menu-item>
   </a-menu>
  </template>
 </a-dropdown>
</template>

<script>
import { Icon as DropIcon } from '@iconify/vue'

export default {
 props:{
   //列表
   navList: {
    type: Array,
    default: () => []
   },
   icon:{
    type:String,
    default:'fluent:more-horizontal-16-filled'
   }
 },

 components:{
  DropIcon
 },

 methods:{
  selectNav(item){
   this.$emit("selectType",item)
  }
 }
}
</script>

<style lang="scss" scoped>
:deep(.nav-item){
  &:hover{
   background: var(--active-secondary-bg) !important;
  }
}

</style>