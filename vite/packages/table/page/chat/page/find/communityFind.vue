<template>
  <div class="flex  flex-col" v-if="searchShow === false">
    <div class="flex flex-col" style="height: 50%;">
      <span class="category-16-500 mb-4" style="color: var(--primary-text);">官方推荐</span>
      <vue-custom-scrollbar :settings="settingsScroller">
        <a-row justify="space-between">
          <a-col :span="5" class="category-bg p-4 pointer rounded-xl" v-for="item in findList">
            <div class="flex mb-4">
              <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
            </div>
             
            <div class="category-18-500 mb-3" style="color:var(--primary-text);">{{ item.name }}</div>
            
            <div class="flex mb-3">
              <div class="category-12-400 px-2 rounded-md flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">社群号:{{item.no}}</div>
              <div class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center" style="color:var(--warning);background:rgba(250,173,20,0.2);">{{item.level}}级</div>
            </div>
             
            <div class="category-14-400 mb-4" style="color:var(--primary-text);max-width: 248px;">
              《荒野大镖客》是一款由Rockstar Games开发和发行的动作冒险游戏。
            </div>

            <div class="flex justify-between">
              <span class="category-12-400" style="color:var(--secondary-text)">{{item.memberNum}}人</span>
              <span class="category-12-400" style="color:var(--secondary-text)">
                {{ item.joinOption === 'freeAccess' ? '公开加入' : '' }}
              </span>
            </div>
          </a-col>
        </a-row>
      </vue-custom-scrollbar>
    </div>

    <div class="flex flex-col" style="height: 60%;">
      <span class="category-16-500 my-4" style="color: var(--primary-text);">热门社群</span>
      <vue-custom-scrollbar :settings="settingsScroller">
        <a-row justify="space-between">
          <a-col :span="5" class="category-bg p-4 pointer rounded-xl" v-for="item in hotList">
            <div class="flex mb-4">
              <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
            </div>
             
            <div class="category-18-500 mb-3" style="color:var(--primary-text);">{{ item.name }}</div>
            
            <div class="flex mb-3">
              <div class="category-12-400 px-2 rounded-md flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">社群号:{{item.no}}</div>
              <div class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center" style="color:var(--warning);background:rgba(250,173,20,0.2);">{{item.level}}级</div>
            </div>
             
            <div class="category-14-400 mb-4" style="color:var(--primary-text);max-width: 248px;">
              {{ item.summary }}
            </div>

            <div class="flex justify-between">
              <span class="category-12-400" style="color:var(--secondary-text)">{{item.memberNum}}人</span>
              <span class="category-12-400" style="color:var(--secondary-text)">
                {{ item.joinOption === 'freeAccess' ? '公开加入' : '' }}
              </span>
            </div>
          </a-col>
        </a-row>
      </vue-custom-scrollbar>
    </div>
  </div>

  <div class="flex  flex-col" v-else style="height: 90%;">
    <span class="category-16-500 my-4" style="color: var(--primary-text);">搜索结果</span>
    <vue-custom-scrollbar :settings="settingsScroller">
      <a-row>
        <a-col :span="6" class="category-bg mr-4 mb-4 p-4 pointer rounded-xl" v-for="item in searchResList">
          <div class="flex mb-4">
            <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
          </div>
           
          <div class="category-18-500 mb-3" style="color:var(--primary-text);">{{ item.name }}</div>
          
          <div class="flex mb-3">
            <div class="category-12-400 px-2 rounded-md flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">社群号:{{item.no}}</div>
            <div class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center" style="color:var(--warning);background:rgba(250,173,20,0.2);">{{item.level}}级</div>
          </div>
           
          <div class="category-14-400 mb-4" style="color:var(--primary-text);max-width: 248px;">
            {{ item.summary }}
          </div>

          <div class="flex justify-between">
            <span class="category-12-400" style="color:var(--secondary-text)">{{item.memberNum}}人</span>
            <span class="category-12-400" style="color:var(--secondary-text)">
              {{ item.joinOption === 'freeAccess' ? '公开加入' : '' }}
            </span>
          </div>
        </a-col>
      </a-row>
    </vue-custom-scrollbar>
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
   searchShow:false,
   searchResList:[],
  }
 },

 mounted(){
  this.getMyCommunity()
  this.getRecommendCommunityList()
 },

 computed:{
  ...mapWritableState(communityStore,['communityList','recommendCommunityList']),
  findList(){
    const list = Object.values(this.recommendCommunityList.reduce((acc, curr) => {
     if (!acc[curr.id]) {
     acc[curr.id] = curr;
     }
     return acc;
    }, {}));
    return list
  },

  // 热门社群模拟数据
  hotList(){
   return hotCommunityData
  },

 },

 methods:{
  ...mapActions(communityStore,['getMyCommunity','getRecommendCommunityList']),
 },

 watch:{
  'dataList':{
    handler(newVal){
      // console.log('监听props数据是否为空',newVal);
      if(newVal?.length !== 0){
        this.searchShow = true
        this.searchResList = newVal
      }else{
        this.searchShow = false
        this.searchResList = []
      }
    },
    immediate:true,
    deep:true,
  }
 }

}
</script>

<style lang="scss" scoped>
.find-item{
 flex: 1 1  23%;
 margin: 0 16px 16px 0;
 width:280px;
}

:deep(.ant-avatar-square){
  border-radius: 8px !important;
}
</style>