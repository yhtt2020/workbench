<template>
 <div class="flex items-center flex-col justify-center mt-4" >
  <div class="flex flex-col">
   <span class="category-16-500 mb-4" style="color: var(--primary-text);">官方推荐</span>
   <vue-custom-scrollbar :settings="settingsScroller">
    <div class="find-container items-center" style="height:267px;">
     <div v-for="item in findList" class="rounded-lg p-4 mb-4 find-item flex flex-col  category-bg">
      <div class="flex mb-4">
       <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
      </div>
      
      <span class="category-18-500 mb-3" style="color:var(--primary-text);">{{ item.name }}</span>
     
      <div class="flex mb-3">
       <div class="category-12-400 px-2 rounded-md flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">社群号:{{item.no}}</div>
       <div class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center" style="color:var(--warning);background:rgba(250,173,20,0.2);">{{item.level}}级</div>
      </div>
      
      <span class="category-14-400 mb-4" style="color:var(--primary-text);max-width: 248px;">
       《荒野大镖客》是一款由Rockstar Games开发和发行的动作冒险游戏。
      </span>
      
      <div class="flex justify-between">
       <span class="category-12-400" style="color:var(--secondary-text)">{{item.memberNum}}人</span>
       <span class="category-12-400" style="color:var(--secondary-text)">
         {{ item.joinOption === 'freeAccess' ? '公开加入' : '' }}
       </span>
      </div>
     </div>
    </div>
   </vue-custom-scrollbar>
  </div>

  <div class="flex flex-col" style="height:455px;width:80%;">
   <span class="category-16-500 mb-4" style="color: var(--primary-text);">热门社群</span>
   <vue-custom-scrollbar :settings="settingsScroller">
    <div class="find-container items-center" style="height:267px;">
     <div v-for="item in hotList" class="rounded-lg p-4 mb-4 find-item flex flex-col  category-bg">
      <div class="flex mb-4">
       <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
      </div>
      
      <span class="category-18-500 mb-3" style="color:var(--primary-text);">{{ item.name }}</span>
     
      <div class="flex mb-3">
       <div class="category-12-400 px-2 rounded-md flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">社群号:{{item.no}}</div>
       <div class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center" style="color:var(--warning);background:rgba(250,173,20,0.2);">{{item.level}}级</div>
      </div>
      
      <span class="category-14-400 mb-4" style="color:var(--primary-text);max-width: 248px;">
        {{ item.summary  }}
      </span>
      
      <div class="flex justify-between">
       <span class="category-12-400" style="color:var(--secondary-text)">{{item.memberNum}}人</span>
       <span class="category-12-400" style="color:var(--secondary-text)">
         {{ item.joinOption === 'freeAccess' ? '公开加入' : '' }}
       </span>
      </div>
     </div>
    </div>
   </vue-custom-scrollbar>
  </div>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { communityStore } from '../../store/communityStore'
import { hotCommunityData } from '../../../../js/data/chatList'

export default {
 props:['dataList'], 

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

 mounted(){
  this.getMyCommunity()
  this.getRecommendCommunityList()
 },

 computed:{
  ...mapWritableState(communityStore,['communityList','recommendCommunityList']),
  findList(){
   if(this.dataList.length !== 0){
     return this.dataList
   }else{
    const list = Object.values(this.recommendCommunityList.reduce((acc, curr) => {
     if (!acc[curr.id]) {
     acc[curr.id] = curr;
     }
     return acc;
    }, {}));
    return list
   }

  },

  // 热门社群模拟数据
  hotList(){
   return hotCommunityData
  }

 },

 methods:{
  ...mapActions(communityStore,['getMyCommunity','getRecommendCommunityList']),
 }

}
</script>

<style lang="scss" scoped>
.find-container{
 display: flex;
 flex-wrap: wrap;
 justify-content: space-between;
 max-width: 100%;
} 
.find-item{
 flex: 1;
 margin: 0 16px 16px 0;
 width:280px;
}

:deep(.ant-avatar-square){
  border-radius: 8px !important;
}
</style>