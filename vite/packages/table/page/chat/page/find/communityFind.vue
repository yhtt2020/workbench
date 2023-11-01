<template>
  <div class="flex flex-col items-center justify-center mt-4" style="height:89%;" v-if="searchShow === false">
    <vue-custom-scrollbar :settings="settingsScroller">
      <div class="flex flex-col ">
        <span class="font-16 font-500 mb-4" style="color: var(--primary-text);">官方推荐</span>
        <div class="content-list">
          <div v-for="item in findList" class="category-bg pointer  content-item rounded-xl pb-4 mb-4" style="position: relative;">
            <div style="height:150px;margin-bottom: 30px;">
              <img class="w-full h-full rounded-t-xl object-cover " src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG">
            </div>
            <div class="flex mb-4" style="position: absolute; left: 16px;top: 120px;">
              <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
            </div>

            <div class="px-4 flex flex-col">
              <div class="category-18-500 mb-3" style="color:var(--primary-text);">
                {{ item.name }}
              </div>
  
              <div class="flex mb-3">
                <div class="category-12-400 px-2 rounded-md flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">社群号:{{ item.no }}</div>
                <div class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center" style="color:var(--warning);background:rgba(250,173,20,0.2);">{{ item.level }}级</div>
              </div>
              <div class="category-14-400 mb-4" style="color:var(--primary-text);max-width: 248px;">
                <!-- 《荒野大镖客》是一款由Rockstar Games开发和发行的动作冒险游戏。 -->
              </div>
              <div class="flex justify-between">
                <span class="category-12-400" style="color:var(--secondary-text)">{{ item.memberNum }}人</span>
                <span class="category-12-400" style="color:var(--secondary-text)">
                  {{ item.joinOption === 'freeAccess' ? '公开加入' : '' }}
                </span>
              </div>
            </div>
            
          </div>
        </div>

        <span class="font-16 font-500 mb-4" style="color: var(--primary-text);">热门社群</span>
        <div class="content-list">
          <div v-for="item in hotList" class="category-bg pointer content-item  pb-4 rounded-xl  mb-4" style="position: relative;">
            <div style="height:150px;margin-bottom: 30px;">
              <img class="w-full h-full rounded-t-xl object-cover " src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG">
            </div>
            <div class="flex mb-4" style="position: absolute; left: 16px;top: 120px;">
              <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
            </div>

            <div class="px-4 flex flex-col">
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
            </div>
          </div>
        </div>
  
      </div>
    </vue-custom-scrollbar>
  </div>

  <div class="flex flex-col items-center justify-start mt-4" style="height:89%;" v-else>
    <vue-custom-scrollbar :settings="settingsScroller">
      <div class="flex flex-col " style="width: 1184px;">
        <span class="font-16 font-500 my-4" style="color: var(--primary-text);">搜索结果</span>
        <div class="content-list">
          <div v-for="item in searchResList" class="category-bg pointer  content-item rounded-xl pb-4 mb-4" style="position: relative;">
            
            <div style="height:150px;margin-bottom: 30px;">
              <img class="w-full h-full rounded-t-xl object-cover " src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG">
            </div>
            <div class="flex mb-4" style="position: absolute; left: 16px;top: 120px;">
              <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
            </div>

            <div class="px-4 flex flex-col">
              <div class="category-18-500 mb-3" style="color:var(--primary-text);">
                {{ item.name }}
              </div>
  
              <div class="flex mb-3">
                <div class="category-12-400 px-2 rounded-md flex items-center justify-center" style="color: var(--active-bg);background: var(--active-secondary-bg);">社群号:{{ item.no }}</div>
                <div class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center" style="color:var(--warning);background:rgba(250,173,20,0.2);">{{ item.level }}级</div>
              </div>
              <div class="category-14-400 mb-4" style="color:var(--primary-text);max-width: 248px;">
                <!-- 《荒野大镖客》是一款由Rockstar Games开发和发行的动作冒险游戏。 -->
              </div>
              <div class="flex justify-between">
                <span class="category-12-400" style="color:var(--secondary-text)">{{ item.memberNum }}人</span>
                <span class="category-12-400" style="color:var(--secondary-text)">
                  {{ item.joinOption === 'freeAccess' ? '公开加入' : '' }}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
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


@media screen and (max-width: 800px) and (min-width: 1000px) {
  .content-list {
    width: 100%;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between;
  }
  .content-item{
    margin-right: 0 !important;
  }
 }
 
 @media screen and (min-width: 1001px) {
  .content-list {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(4,1fr);
    justify-content: space-between;
  }
  .content-item{
    margin-right: 16px !important;
  }
 }
</style>