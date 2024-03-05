<template>
  <div class="flex flex-col h-full">
   <div class="flex items-center justify-between mb-3">
    <div class="flex items-center">
      <xt-ify-icon icon="fluent-emoji:shopping-bags" class="mr-2 xt-text" size="16"></xt-ify-icon>
      <span class="xt-text xt-font font-14">积分商城</span>
    </div>
    <Exit />
   </div>
   <TaskUserInfo v-if="!$useEnv('guest')"/>
   <div class="flex grow " style="height: 200px;">
    <xt-scrollbar class="w-full "  :x="false" :y="true">
     <div class="grid grid-cols-2 gap-4">
      <div v-for="item in list" :key="item.id" class="good-item  pointer rounded-lg xt-bg-2 flex flex-col" @click="goGoodDetail(item.id)">
       <div style="height: 194px;" class="w-full">
        <img :src="item.image" class="rounded-tl-xl rounded-tr-xl w-full h-full object-cover" />
       </div>
       <div class="px-2.5 py-2 flex flex-col">
        <div class="xt-text xt-font truncate font-14" style="max-width: 194px;">
         {{ item.store_name }}
        </div>
        <div class="xt-font font-14 font-600" style="color:#FA7B14;">
         {{ item.price_project.item[0].jifen_num}}积分
        </div>
       </div>
      </div> 
     </div>
     <div style="height: 16px;"></div>
    </xt-scrollbar> 
   </div>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import Exit from "../../components/Exit.vue";
import TaskUserInfo from '../../components/userinfo/TaskUserInfo.vue';

const props = defineProps({
 list:{
  type:Array,
  default:()=>[]
 }
});

const emits = defineEmits(['enterDetail']);

const goGoodDetail = (id) =>{
 emits('enterDetail',id);
};
</script>

<style lang="scss" scoped>
.good-item{
 width: 194px;
}
</style>