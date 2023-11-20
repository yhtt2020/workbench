<template>
 <xt-button w="184" h="44" v-for="item in emptyList" class="mb-3" @click="item.callBack">
   <div class="flex items-center ">
    <ComIcon :icon="item.icon" style="font-size:1.25rem;"/>
    <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
   </div>
 </xt-button>

 <AddNewGroup ref="addNewRef" :no="no"/>
 <AddNewCategory ref="addCategoryRef" :no="no"/>
 <AddInvite ref="addInviteRef" :no="no"/>
</template>

<script>
import { Icon as ComIcon } from '@iconify/vue'

import AddNewGroup from '../add/AddNewGroup.vue';
import AddNewCategory from '../add/AddNewCategory.vue';
import AddInvite from '../add/AddInvite.vue';

export default {
 components:{
  ComIcon,AddNewGroup,AddNewCategory,AddInvite
 },

 props:['no'],

 data(){
  return{
   emptyList: [
    { 
     icon:'fluent:people-add-16-regular', name: '邀请其他人',
     callBack:()=>{
      this.$refs.addInviteRef.openAddInvite()
     }
    },
    { 
     icon:'fluent:apps-add-in-20-filled', name: '添加新应用', 
     callBack:()=>{
      this.$refs.addCategoryRef.openAddNewCategory()
     }
    },
    {
     icon:'fluent:add-16-filled', name: '添加新分组',
     callBack:()=>{
      this.$refs.addNewRef.openAddModal()
     }
    },
   ],
  }
 }
};
</script>

<style lang="scss" scoped>
</style>