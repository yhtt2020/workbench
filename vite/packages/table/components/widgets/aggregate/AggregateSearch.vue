<template>
  <Widget :sizeList="bottomSizeList" :customData="customData" :customIndex="customIndex" :desk="desk" :options="options"
  :menuList="gameMiddleBare" ref="aggregateSearchSlot" >
    <div class="flex items-center rounded-xl p-2 w-full justify-center mt-8 mb-3" style="border: 1px solid var(--divider); background: var(--secondary-bg);" @click.stop="handleSearchEngine">
      <div class="flex items-center justify-center" style="width: 20px;height:20px;">
        <Icon :icon="aggInputValue" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
      </div>
      <a-input placeholder="搜索" :bordered="false" class="search"></a-input>
    </div>
    <div class="flex">
       <template v-if="showSize.width === 1">
        <div v-for="(item,index) in  aggSearchList.slice(0,3)" @click="clickSearchItem(item.id)">
          <div class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11" v-if="index !== 0"
          style="background: var(--secondary-bg);" :style="showSize.width === 1 ? {width:'92px'} : {width:'113px'}">
           <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
            <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
           </div>
           <span class="ml-2">{{item.title}}</span>
          </div>
        </div>
      </template>


      <template v-else>
        <div v-for="(item,index) in  aggSearchList.slice(0,5)" @click="clickSearchItem(item.id)">
          <div class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11" v-if="index !== 0"
          style="background: var(--secondary-bg);" :style="showSize.width === 2 ? {width:'113px'} : {width:'92px'}">
            <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
             <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <span class="ml-2">{{item.title}}</span>
          </div>
        </div>
      </template>


      <div class="w-11 h-11 active-button flex items-center justify-center rounded-xl pointer"
       style="background: var(--secondary-bg);" @click="aggSearchShow = true">
        <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
      </div>
    </div> 
  </Widget>


  <a-drawer :width="500" title="设置" :placement="right" v-model:visible="aggSearchShow" @close="aggSearchShow = false">
    <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
      <div class="primary-title" style="color: var(--primary-text);">搜索引擎</div>
      <div class="secondary-title mt-2 mb-6" style="color: var(--secondary-text);">长按拖拽排序，最多支持在卡片上的展示5个搜索引擎</div>
      <AggregateSearchDrawer @setSortedList="setSortedList" :drawerList="aggSearchList"></AggregateSearchDrawer>
      <div class="mb-6 primary-title " style="color: var(--primary-text);">链接打开方式</div>
      <XtTab   style="height: 52px" boxClass="p-1 xt-bg-2" v-model:list="linkType"  v-model:data="customData.sort_type">
      </XtTab>
    </vue-custom-scrollbar>
  </a-drawer>
<!--  -->
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { appStore } from '../../../store';
import { cardStore } from '../../../store/card' 
import Widget from "../../card/Widget.vue";
import AggregateSearchDrawer from "./AggregateSearchDrawer.vue";
import { AggregateList } from "../../../js/data/searchData";
import HorizontalPanel from '../../HorizontalPanel.vue';
import _ from 'lodash-es'
import cache from '../../card/hooks/cache';

export default {
  name: "AggregateSearch",

  components: {
    Widget,
    AggregateSearchDrawer,
    HorizontalPanel
  },

  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    confirmCCData: {
      type: Function,
      default: () => {},
    },
    desk: {
      type: Object,
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

      AggregateList, // 没有排序过的聚合搜索数据

      bottomSizeList:[{title:'2x2',width:1,height:1,name:'1x1'},{title:'4x2',width:2,height:1,name:'2x1'}], // 底部设置中尺寸大小切换
      gameMiddleBare:[ { icon: 'shezhi1', title: '设置', fn: () => {this.aggSearchShow = true;this.$refs.aggregateSearchSlot.visible = false } } ],

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },

      linkType:[  // 设置中打开方式类型
        {name:'工作台内打开',value:'work'},
        {name:'想天浏览器',value:'thisky'},
        {name:'系统默认浏览器',value:'system'}
      ],
      defaultLink:this.updateLink,
    }
  },


  computed:{
    aggSearchList(){
      if(this.customData && this.customData.sortList){
        return this.customData.sortList
      }else{
        return this.AggregateList
      }
    },
    showSize(){
      if(this.customData && this.customData.width && this.customData.height){
        return {width:this.customData.width,height:this.customData.height}
      }
      return this.bottomSizeList[0]
    },
    // aggSizeShow(){
    //   // if(this.customData && this.customData.width === 1){
    //   //   return true
    //   // }else{
    //   //   return false
    //   // }
    // },
    aggInputValue(){
      if(this.customData && this.customData.sortList){
        if(this.aggSearchList !== undefined){
          return this.aggSearchList[0].icon
        }
      }else{
        return this.AggregateList[0].icon
      }
    },
  },

  mounted(){
    if (this.customData.sort_type === undefined) {
      let setData = {}; 
      setData.sort_type =  'work'; // 初始化分组名称
      this.updateCustomData(this.customIndex, setData, this.desk);
    } 
  },

  methods:{
    setSortedList(arr){
      this.customData.sortList = arr
    },
    ...mapActions(appStore,['setSearchFullScreen','setSearchIndex','setSearchUrlOpenType','getAggList']),
    ...mapActions(cardStore,['updateCustomData']),
    handleSearchEngine(){
      this.setSearchFullScreen(true)
      if(this.customData && this.customData.sortList){
        this.setSearchIndex(this.aggSearchList[0].id)
        cache.set('aggSortList',this.customData.sortList)
        this.getAggList()
      }else{
        this.setSearchIndex(this.AggregateList[0].id)
        cache.set('aggSortList',this.AggregateList)
        this.getAggList()
      }
    },
    clickSearchItem(id){ // 点击选中打开
      this.setSearchFullScreen(true)
      if(this.customData && this.customData.sortList){
        this.setSearchIndex(id)
      }else{
        this.setSearchIndex(id)
      }
    },
  },

  watch:{
    'customData.sort_type':{
      handler(newVal){
        this.setSearchUrlOpenType(newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

</style>
