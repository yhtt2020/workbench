<template>
 <div class="flex">
  数据列表详情
  {{ list }}
 </div>
</template>

<script setup>
import { computed, toRefs } from "vue"

// 接收父组件传递的数据
const props = defineProps({
 rightDetail:{
  type:Object,
  default:()=>{}
 }
})
const { rightDetail } = toRefs(props);

// 数据列表
const filterList = ref([]);

// 通过计算属性筛选数据
const list = computed(()=>{
 switch(rightDetail.value.type){
  case 'desk':
   // filterList.value = rightDetail.value.desk;
   break;
  case 'nav':
   console.log('导航');
   break;
  case 'folder':
   console.log('文件夹');
   break;
 }
});

</script>

<style lang="scss" scoped>

</style>