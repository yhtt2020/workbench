<template>
 <div class="flex flex-col" style="width: 100%;">
  <div class="flex items-center justify-between" style="margin-bottom: 14px;">
   <span class="font-16" style="color: var(--primary-text);">好友 ({{ list.length }}个) </span>
  </div>

  <vue-custom-scrollbar :settings="settingsScroller" style="height:100%;">
   <div v-for="item in list" class="flex items-center pointer" style="padding: 14px 15px;" @click="clickGroupList(item)">
    <a-avatar  :size="32" :src="item.profile.avatar"></a-avatar>
    <div class="flex flex-col font-16" style="margin-left: 16px;color:var(--primary-text);">
     {{ item.profile.nick }}
    </div>
   </div>
  </vue-custom-scrollbar>

 </div>

</template>

<script>
import { defineComponent,ref,toRefs,computed,watch, reactive, onMounted } from 'vue'

export default defineComponent({
  props:['list'],
  setup(){

   const data = reactive({
     settingsScroller: {  // 滚动条配置 
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
     },

   })
  

   const clickGroupList = (item) =>{  // 点击群聊列表
    console.log(item);
   }

   return{
     ...toRefs(data),clickGroupList,
   }
  }

})
</script>

<style lang="scss" scoped>
.font-16{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}

.font-14{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}

.active-button{
 &:active{
  filter: brightness(0.8);
  opacity: 0.8;
 }
 &:hover{
  opacity: 0.8;
 }
}

</style>