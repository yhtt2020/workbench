<template>
  <div class="w-full h-full flex flex-col">
   <div style="width: 572px" class="flex mb-3 items-center h-10 justify-between">
    <HorizontalPanel style="width: 304px;" :height="40" :navList="memberTab" v-model:selectType="tabType"/>
    <div class="flex items-center">
     <xt-button w="96" h="40" class="mr-3">全部拒绝</xt-button>
     <xt-button w="96" h="40" class="xt-active-bg-2 " style="color: var(--active-bg) !important;">
      全部同意
     </xt-button>
    </div>
   </div>
   <div class="flex flex-col flex-grow " style="width: 572px;height: calc(100vh - 100px / 1.25);">
    <MemberManage v-if="tabType.name === 'memberManage'"/>
    <ApplyCheck v-else />
   </div>
  </div>
</template>

<script>

import HorizontalPanel from '../../../../components/HorizontalPanel.vue';
import ApplyCheck from '../../components/setting/ApplyCheck.vue';
import MemberManage from '../../components/setting/MemberManage.vue';

export default {
 components:{
  HorizontalPanel,ApplyCheck,MemberManage
 },
 
 data(){
  return{
   memberTab:[
    {
     title:'成员管理',
     name:'memberManage',
    },
    {
     title:'申请审核',
     name:'applyCheck'
    },
   ],
   tabType:{ title:'成员管理',name:'memberManage',},
  }
 },


};
</script>

<style lang="scss" scoped>
:deep(.nav-item){
 border-radius: 8px !important;
}
</style>