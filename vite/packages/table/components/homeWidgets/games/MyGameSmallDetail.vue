<template>
  <div class="flex flex-col items-center justify-center">
     <div class="rounded-lg " style="width: 100px; height: 100px;margin-top: 40px;">
       <img class="rounded-lg" :src="detailData.src" alt="" style="width: 100%;height: 100%; object-fit: cover;">
     </div>  
     <span class="mt-4" style="font-size: 18px; font-weight: 500; margin-bottom: 60px;">{{ detailData.title }}</span>
     <div @click="openGameGuide" class="rounded-lg flex items-center pointer-active mb-3 s-item  pointer justify-center" style=" padding: 13px 80px;">
        <Icon icon="trophy" style="font-size: 1.429em;"></Icon>
        <span style="font-size: 16px; font-weight: 400;">游戏攻略</span>
     </div>
     <div @click="closeGame" class="rounded-lg flex items-center pointer-active s-item  pointer justify-center" style=" padding: 13px 80px;">
      <Icon icon="tuichu" style="font-size: 1.429em;"></Icon>
      <span style="font-size: 16px; font-weight: 400;">关闭游戏</span>
   </div>
  </div>
</template>

<script>
export default {
   name:'MyGameSmallDetail',
   props:{
    detailData:{
      type:Object,
      default:()=>{}
    }
   },
   methods:{
    // 关闭游戏
    closeGame(){
      this.$emit('quitGame',false)
    },
    // 打开游戏攻略
    openGameGuide(){

    }
   }
}
</script>

<style lang="scss" scoped>
.pointer-active:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
</style>