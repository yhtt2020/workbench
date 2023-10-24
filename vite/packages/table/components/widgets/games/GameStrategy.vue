<template>
  <Widget :options="options" :customData="customData" :customIndex="customIndex" :desk="desk">
    <div class="flex items-center" style="position: absolute; top: 0.85rem; left:1rem;">
      <StrategyIcon icon="akar-icons:trophy" style="font-size: 1.25rem;color:var(--secondary-text);"/>
      <div class="flex items-center justify-center category-button ml-2 py-0.5 px-2 xt-divider-bg xt-text rounded-lg pointer" @click="openGuideDrawer">
        游戏攻略- {{ customData.chineseName }}
      </div>
    </div>
    
    <div class="w-full flex mt-3.5 mb-3">
      <HorizontalPanel style="width: 23.5rem;height: 44px;" 
       :navList="strategyType" v-model:selectType="strategy">
      </HorizontalPanel>
      <xt-new-icon type="theme" icon="fluent:search-20-filled" w="44" bgClass="xt-bg  category-button mx-3" @click="openSearch"></xt-new-icon>
      
      <!-- 视频 -->
      <template v-if="strategy.name === 'video'">
        <xt-new-icon type="theme" v-if="biliVideoList.length !== 0" 
        icon="fluent:chevron-left-16-filled" w="44" bgClass="xt-bg  category-button mr-3" 
        @click="prevButton"
       >
       </xt-new-icon>
       <xt-new-icon type="theme" v-if="biliVideoList.length !== 0"
        icon="fluent:chevron-right-16-filled" w="44" bgClass="xt-bg  category-button " 
        @click="nextButton" 
       >
       </xt-new-icon>
      </template>

      <!-- 图文列表 -->
      <template v-else>
        <xt-new-icon type="theme" v-if="graphicList.length !== 0" 
        icon="fluent:chevron-left-16-filled" w="44" bgClass="xt-bg  category-button mr-3" 
        @click="prevButton"
       >
       </xt-new-icon>
       <xt-new-icon type="theme" v-if="graphicList.length !== 0"
        icon="fluent:chevron-right-16-filled" w="44" bgClass="xt-bg  category-button " 
        @click="nextButton" 
       >
       </xt-new-icon>
      </template>

    </div>

    <template v-if="strategy.name === 'video'">
      <!-- {{ videoCurrentPage }} -->
      <BiliVideoDetail :list="videoList"/>
    </template>

    <template v-else>
      
      <!-- {{ graphicCurrentPage }} -->
      <GraphicDetail :list="graphicsList"/>

    </template>


  </Widget>

  <HorizontalDrawer ref="strategyDrawer" drawerTitle="游戏名称" v-model:selectRegion="customData.id"
    :rightSelect="recentGameList" @getArea="getArea"></HorizontalDrawer>

  <a-drawer v-model:visible="searchShow" title="搜索" width="500" placement="right">
    <div class="line">
      <a-input class="w-full h-10 no-drag" placeholder="搜索" spellcheck="false" v-model:value="searchWord"
        style="border-radius: 12px;background: var(--primary-bg); color:var(--primary-text);" @pressEnter="searchEnter">
        <template #prefix>
          <Icon icon="sousuo"></Icon>
        </template>
      </a-input>
    </div>
  </a-drawer>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { Icon as StrategyIcon } from '@iconify/vue'
import { gameStrategyStore } from '../../../store/gameStrategyStore'
import { steamUserStore } from '../../../store/steamUser';


import Widget from '../../card/Widget.vue';
import HorizontalPanel from '../../HorizontalPanel.vue';
import HorizontalDrawer from '../../HorizontalDrawer.vue';
import BiliVideoDetail from './strategy/BiliVideoDetail.vue';
import GraphicDetail from './strategy/GraphicDetail.vue';

export default {
  name:'GameStrategy',

  props:['customIndex','customData','desk'],

  components:{
    Widget,StrategyIcon,HorizontalPanel,
    HorizontalDrawer,BiliVideoDetail,GraphicDetail
  },

  data(){
    return{
      options: {
        className: 'card double',
        title: '',
        // icon: 'trophy',
        rightIcon:'',
        type: 'strategy',
      },
      strategyType: [
        { title: '视频攻略', name: 'video' },
        { title: '图文攻略', name: 'image-text' }
      ],
      strategy: { title: '视频攻略', name: 'video' },
      searchShow:false,
      searchWord: this.customData.chineseName, // 搜索关键词
      simpleImage: '/public/img/test/not-data.png',// 空状态数据
      videoCurrentPage:1, // 视频当前页码
      graphicCurrentPage:1, // 图文当前页码
    }
  },

  computed:{
    ...mapWritableState(steamUserStore, ['recentGameList']),
    ...mapWritableState(gameStrategyStore,['biliVideoList','graphicList']),
    // 计算总页数
    totalPages(){
      if(this.strategy.name === 'video'){
        return Math.ceil(this.biliVideoList.length / 6) // 数据总量除以6，向上取整
      }else{
        return Math.ceil(this.graphicList.length / 6) // 数据总量除以6，向上取整
      }
    },
    // 计算当前页要显示的数据
    videoList(){
      const start = (this.videoCurrentPage - 1) * 6;  // 每页6个数据，计算起始索引
      const end = start + 6;  // 计算结束索引
      return this.biliVideoList.slice(start, end);  // 返回当前页要显示的数据
    },
    graphicsList(){
      const start = (this.graphicCurrentPage - 1) * 6;  // 每页6个数据，计算起始索引
      const end = start + 6;  // 计算结束索引
      return this.graphicList.slice(start, end);  // 返回当前页要显示的数据
    }
  
  },

  mounted(){
    if (Object.keys(this.customData).length === 0) {
      this.customData.name = this.recentGameList[0]?.chineseName
      this.customData.id = this.recentGameList[0]?.appid
      this.customData.chineseName = this.recentGameList[0]?.chineseName
    } else {
      this.getBiliData(this.customData.name)
      this.getGraphicData(this.customData.name)
    }
  },

  methods:{
    ...mapActions(gameStrategyStore,['getBiliData','getGraphicData','searchVideoData','searchGraphicData']),
    openGuideDrawer(){
      this.$refs.strategyDrawer.openDrawer()
    },

    // 刷新获取数据
    refreshStrategy(){
      if(this.strategy.name === 'video'){
        this.getBiliData(this.customData.chineseName)
      }else{
        this.getGraphicData(this.customData.chineseName)
      }
    },

    openSearch() {
      this.searchShow = true
    },

    // 更新customData
    getArea(v) {
      console.log('查看数据',v);
      this.customData.name = v.chineseName
      this.customData.id = v.appid
      this.customData.chineseName = v.chineseName
      this.refreshStrategy()
    },

    searchEnter(){
      this.searchGraphicData(this.searchWord)
      this.searchVideoData(this.searchWord)
    },

    // 分页
    nextButton(){
      if(this.strategy.name === 'video'){
        if (this.videoCurrentPage < this.totalPages) {
         this.videoCurrentPage++;
        }
      }else{
        if (this.graphicCurrentPage < this.totalPages) {
         this.graphicCurrentPage ++;
        }
      }
      

    },
    prevButton(){
     if(this.strategy.name === 'video'){
        if(this.videoCurrentPage > 1){
          this.videoCurrentPage--;
        }
      }else{
        if(this.graphicCurrentPage > 1){
          this.graphicCurrentPage--;
        }
      }
    }


  },

  watch:{
    'strategy':{
      handler(){
        this.refreshStrategy()
      },
      immediate:true
    }
  }

}
</script>

<style lang="scss" scoped>
:deep(.nav-item) {
  width: 50% !important;
  border-radius: 6px !important;
}


</style>