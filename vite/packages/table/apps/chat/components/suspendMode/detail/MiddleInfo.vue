<!-- 左侧栏中间段 -->
<template>
 <!-- 单列 -->
 <template v-if="!columnVisible">
  <div>单列</div>
 </template>

 <!-- 双列 -->
 <template v-else>
  <div>双列</div>
 </template>

</template>

<script setup>
import { computed, toRefs } from "vue"
import { chatCommunityStore } from "../../../store/chatCommunity";
import { storeToRefs } from "pinia";

const props = defineProps({
 columnVisible:{
  type:Boolean,
  default:false,
 },
 no:{
  type:String,
  required:true,
 }
})
const { columnVisible,no } = toRefs(props);

/**解构store数据缓存**/
const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

/**加入社群条件**/
const hasRole = computed(()=>{
  
}) 

</script>

<style lang="scss" scoped>
</style>