<template>
 <div class="flex items-center justify-center w-full">
  <a-empty :image="simpleImage" :description="text"  />
 </div>
</template>

<script>
export default {
  props:['text'],
  data(){
   return{
    simpleImage:'/img/state/null.png'
   }
  }
}
</script>

<style lang="scss" scoped>
:deep(.ant-empty-image){
  height: 56px !important; 
}
</style>