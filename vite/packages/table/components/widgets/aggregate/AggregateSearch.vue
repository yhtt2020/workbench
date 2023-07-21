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
      <template v-if="Object.keys(customData).length === 0 ||  customData.width === 1">
        <div v-for="(item,index) in  aggSearchList.slice(0,3)" @click="clickSearchItem(index)">
          <div class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11" v-if="index !== 0"
          style="background: var(--secondary-bg);" :style="customData.width === 1 || Object.keys(customData).length === 0 ? {width:'92px'} : {width:'113px'}">
           <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
            <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
           </div>
           <span class="ml-2">{{item.title}}</span>
          </div>
        </div>
      </template>


      <template v-else>
        <div v-for="(item,index) in  aggSearchList.slice(0,5)" @click="clickSearchItem(index)">
          <div class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11" v-if="index !== 0"
          style="background: var(--secondary-bg);" :style="customData.width !== 1 ? {width:'113px'} : {width:'92px'}">
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
    <AggregateSearchDrawer></AggregateSearchDrawer>
  </a-drawer>

</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import Widget from "../../card/Widget.vue";
import AggregateSearchDrawer from "./AggregateSearchDrawer.vue";
import { appStore } from "../../../store";
import { AggregateList } from "../../../js/data/searchData";

export default {
  name: "AggregateSearch",

  components: {
    Widget,
    AggregateSearchDrawer,
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
    }
  },


  computed:{
    ...mapWritableState(appStore,['fullScreen','aggList']),
    aggSearchList(){
      if(Object.keys(this.aggList).length !== 0 && this.aggList.list){
        return this.aggList.list
      }else{
        return this.AggregateList
      }
    },
    aggInputValue(){
      if(Object.keys(this.aggList).length !== 0){
        return this.aggSearchList[0].icon
      }else{
        return this.AggregateList[0].icon
      }
    }
  },


  methods:{
    ...mapActions(appStore,['setSearchFullScreen','setSearchIndex']),
    handleSearchEngine(){
      this.setSearchFullScreen(true)
      this.setSearchIndex(0)
    },
    clickSearchItem(index){ // 点击选中打开
      this.setSearchFullScreen(true)
      this.setSearchIndex(index)
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
