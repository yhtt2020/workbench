<template>
 <vue-custom-scrollbar :settings="settingsScroller">
  <div v-for="item in 5" class="px-4 py-2 flex w-full justify-between">
    <div class="flex items-center ">
     <div class="flex w-8 h-8 mr-4 items-center justify-center">
      <a-avatar shape="circle" :size="32" src="https://up.apps.vip/avatar/013.png"/>
     </div>
     <div class="flex flex-col">
      <span class="xt-font font-16 font-400 xt-text">Victor Ruiz</span>
      <span class="xt-font font-14 font-400 xt-text-2">Team小队成员</span>
     </div>
    </div>
    <div class="flex">
     <xt-button w="64" h="40" class="mr-3" @click="reject">拒绝</xt-button>
     <xt-button w="64" h="40" class="xt-active-bg-2 " style="color: var(--active-bg) !important;" @click="agree">
      同意
     </xt-button>
    </div>
  </div>
 </vue-custom-scrollbar>
</template>

<script>
 export default {
  data(){
   return{
    settingsScroller: {
     useBothWheelAxes: true,
     swipeEasing: true,
     suppressScrollY: false,
     suppressScrollX: true,
     wheelPropagation: true
    },
   }
  },

  methods:{
   reject(){
    // 拒绝 todo
   },
   agree(){
    // 同意 todo
   }
  }
 }
</script>

<style lang="scss" scoped>
</style>