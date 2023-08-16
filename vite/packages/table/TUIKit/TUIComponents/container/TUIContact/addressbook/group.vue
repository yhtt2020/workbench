<template>
 <div class="flex flex-col" style="width: 100%;">
  <div class="flex items-center justify-between" style="margin-bottom: 14px;">
   <span class="font-16" style="color: var(--primary);">组织群聊 ({{ list.length }}个) </span>
   
   <div class="w-11 h-11 rounded-lg flex pointer items-center active-button justify-center" style="background: var(--active-bg);">
    <Icon icon="tianjia2" style="width: 20px;height: 20px;"></Icon>
   </div>
  </div>

  <vue-custom-scrollbar :settings="settingsScroller" style="height:90%;">
   <div v-for="item in list" class="flex items-center pointer" style="padding: 14px 15px;" @click="clickGroupList(item)">
    <a-avatar shape="square" :size="32" :src="item.avatar"></a-avatar>
    <div class="flex flex-col" style="margin-left: 16px;">
     <span class="font-16" style="color:var(--primary-text);">{{ item.name }}</span>
     <span class="font-14" style="color:var(--secondary-text);">200人</span>
    </div>
   </div>
  </vue-custom-scrollbar>

 </div>

</template>

<script>
import { defineComponent,ref,toRefs,computed,watch, reactive, onMounted } from 'vue'

export default defineComponent({

  setup(){

   const data = reactive({
     list:[], // 接收群聊列表
     settingsScroller: {  // 滚动条配置 
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
     },

   })
   
   const loadGroupList = async () => {  // 点击进入加载群聊列表
    const res = await window.$chat.getGroupList()
    data.list = res.data.groupList
   }

   const clickGroupList = (item) =>{  // 点击群聊列表
    console.log(item);
   }

   onMounted(loadGroupList)

   return{
     ...toRefs(data),loadGroupList,clickGroupList,
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