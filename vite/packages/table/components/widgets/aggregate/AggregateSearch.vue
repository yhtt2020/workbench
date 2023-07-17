<!-- 聚合搜索 -->
<template>
  <Widget :customData="customData" :customIndex="customIndex" :desk="desk" :options="options"
  :menuList="gameMiddleBare" ref="aggregateSearchSlot" :sizeList="bottomSizeList" v-if="fullScreen === false"> 
   <div class="flex items-center rounded-xl p-2 w-full justify-center mt-8 mb-3" style="border: 1px solid var(--divider);" @click="handleSearchEngine">
    <div class="flex items-center justify-center" style="width: 20px;height:20px;">
      <Icon :icon="searchEngineIcon.icon" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
    </div>
    <a-input placeholder="搜索" :bordered="false" class="search"></a-input>
   </div>
   <div class="flex">

    <!-- <div class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11"
    style="background: var(--secondary-bg);" :style="customData.width !== 1 ? {width:'113px'} : {width:'92px'}">
    <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
      <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
    </div>
    <span class="ml-2">{{item.title}}</span> 
    </div> -->

    <div class="w-11 h-11 active-button flex items-center justify-center rounded-xl pointer" 
    style="background: var(--secondary-bg);" @click="aggSearchShow = true">
      <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
    </div>
   </div>
  </Widget>


  <a-drawer :width="500" title="设置" :placement="right" v-model:visible="aggSearchShow" @close="aggSearchShow = false">
    <AggregateSearchDrawer></AggregateSearchDrawer>
  </a-drawer>


  <transition name="fade">
    <div v-if="fullScreen === true" class="w-full p-2 flex flex-col search-fullscreen drag">
      <div class="flex justify-end items-center no-drag">
        <div class="w-12 h-12 flex pointer justify-center items-center rounded-lg active-button" style="background: var(--secondary-bg);" @click="fullScreen = false">
           <Icon icon="guanbi" style="font-size: 1.5em;color: var(--secondary-text);"></Icon>
        </div>
      </div>

      <div class="flex justify-center w-full mt-10 no-drag">
        <div class="mr-3 p-5">
          <div class="mb-3" style="color: var(--secondary-text);">搜索引擎</div>
          <div v-for="(item, index) in aggSearchList" class="flex pointer rounded-lg mb-3 p-2" :key="index" @click="selectAggSearch(item,index)" :class="{'active-bg':aggSelectIndex === index}">
            <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
              <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <span class="ml-2" style="color: var(--secondary-text);">{{item.title}}</span>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex items-center rounded-xl p-2 w-full justify-center" style="border: 1px solid var(--secondary-bg);width: 480px;">
            <div class="flex items-center justify-center" style="width: 20px;height:20px;">
              <Icon :icon="aggSelectIcon.icon" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <a-input v-model:value="aggSearchWord" placeholder="搜索" :bordered="false" class="search" @change="dataSearch"></a-input>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import { mapWritableState } from 'pinia';
import Widget from '../../card/Widget.vue';
import AggregateSearchDrawer from './AggregateSearchDrawer.vue';
import {appStore} from '../../../store'
import { AggregateList } from '../../../js/data/searchData'
import axios from 'axios';

export default {
  name:'AggregateSearch',


  components:{
    Widget,
    AggregateSearchDrawer,
  },


  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    },
    desk:{
      type:Object
    },
  },


  data(){
    return{
      options: {
        className: 'card small',
        title: '聚合搜索',
        icon: 'sousuo1',
        type: 'search',
      },
      aggSearchShow:false, // 控制右侧抽屉显示
      AggregateList,
      searchEngineIcon:'', // 接收默认数值
      aggSearchWord:'', // 搜索关键字
      bottomSizeList:[{title:'2x2',width:1,height:1,name:'2x2'},{title:'4x2',width:2,height:1,name:'4x2'}], // 底部设置中尺寸大小切换
      gameMiddleBare:[ { icon: 'shezhi1', title: '设置', fn: () => {this.aggSearchShow = true;this.$refs.aggregateSearchSlot.visible = false } } ],
      aggSelectIndex:'', // 全屏状态搜索引擎下标
      aggSelectIcon:{},
    }
  },


  computed:{
    ...mapWritableState(appStore,['fullScreen','aggList']),
    aggSearchList(){  // 全屏模式下的搜索数据 
      if(Object.keys(this.aggList).length !== 0){
        this.aggSelectIcon.icon = this.aggList.list[0].icon
        this.aggSelectIndex = 0
        return this.aggList.list
      }
    },
    
  },


  mounted(){
    // this.searchEngineIcon = this.aggSearchList[0]
    // console.log('获取默认项', this.aggSearchList[0]);
  },


  methods:{
    handleSearchEngine(){  // 将聚合搜索框全屏展示  
      this.fullScreen = true 
    },
    selectAggSearch(item,index){  //  聚合搜索框在全屏情况下的筛选 
      this.aggSelectIndex = index
      this.aggSelectIcon.icon = item.icon
    },
    dataSearch(){ // 聚合搜索关键字推荐
      const words = encodeURIComponent(this.aggSearchWord)
      const url = `${this.aggList.list[this.aggSelectIndex].recommend_url}${words}`
      axios.get(url).then(res=>{
        console.log('返回结果::>>>',res);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.active-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

.primary-title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.secondary-title{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.search-fullscreen{
  position:relative;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 97vw;
}

.active-bg{
  background: var(--secondary-bg);
  color: var(--secondary-text);
}
</style>