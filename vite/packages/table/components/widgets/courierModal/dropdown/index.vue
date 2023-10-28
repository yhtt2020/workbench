<template>
 <a-dropdown :trigger="['click']" placement="bottom">
  <div class="xt-text flex items-center justify-center pointer"> 
    <span class="xt-text">{{selectType.title }} </span>
    <DropIcon icon="fluent:caret-down-12-filled" style="font-size: 1.25rem;"/> 
  </div>
  <template #overlay>
   <a-menu class="flex flex-col items-center xt-bg justify-center" style="width: 180px;border-radius: 8px; padding: 8px;">
    <a-menu-item v-for="item in navList" class="flex xt-text w-full nav-item rounded-lg flex-col items-center justify-center"
     @click="selectNav(item)"
    >
     {{ item.title }}
    </a-menu-item>
   </a-menu>
  </template>
 </a-dropdown>
 <!-- <a-dropdown trigger="click" placement="bottom"
 overlayStyle="background-color: var(--primary-bg); padding-left:3px ;padding-right:3px; width: 100px;">
 <div class="flex items-center justify-center w-full">
     <div class="ml-20 font-16 xt-text">{{ defaultType.title }}</div>
     <newIcon icon="fluent:caret-down-12-filled" class="ml-1 xt-text" style="font-size: 20px;" />
 </div>
 <template #overlay>
     <a-menu class="text-center xt-bg"
         style="display: flex;justify-content: center;flex-direction: column;align-items: center;">
         <a-menu-item v-for="(item, index) in publishType" :key="index"
             @click="handleMenuItemClick(index)">
             <span class="ml-12 text-center xt-text">{{ item.title }}</span>
         </a-menu-item>
     </a-menu>
 </template>
 </a-dropdown> -->

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
    // 当前选中的内容
    selectType: {
      type: Object,
      default: () => {}
    },
 },

 components:{
    DropIcon
 },

 methods:{
  selectNav(item){
   this.$emit("update:selectType",item)
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