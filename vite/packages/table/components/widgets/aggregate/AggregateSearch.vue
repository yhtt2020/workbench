<!-- 聚合搜索 -->
<template>
  <Widget :customData="customData" :customIndex="customIndex" :desk="desk" :options="options"
    :menuList="gameMiddleBare" ref="aggregateSearchSlot" :sizeList="bottomSizeList"
  > 
    <div class="flex items-center rounded-xl p-2 w-full justify-center mt-8 mb-3" style="border: 1px solid rgba(255,255,255,0.1);">
      <div class="flex items-center justify-center" style="width: 20px;height:20px;">
        <img :src="searchEngineIcon" alt="" class="w-full h-full object-cover">
        <!-- <Icon icon="bing" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon> -->
      </div>
      <a-input v-model:value="value" placeholder="搜索" :bordered="false" ></a-input>
    </div>
    <div class="flex">
      <div v-for="item in searchEngine" class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11"
       style="background: var(--secondary-bg);" :style="customData.width !== 1 ? {width:'113px'} : {width:'92px'}"
      >
       <Icon :icon="item.icon" v-if="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
       <div class="flex items-center justify-center" v-else style="width: 20px;height:20px;">
        <img :src="item.url" alt="" class="w-full h-full object-cover">
       </div>
       <span class="ml-2">{{item.title}}</span>
      </div>
      <div class="w-11 h-11 active-button flex items-center justify-center rounded-xl pointer" style="background: var(--secondary-bg);">
        <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
  </Widget>

  <a-drawer
    :width="500"
    title="设置"
    :placement="right"
    v-model:visible="aggSearchShow"
    @close="onClose"
  >
    <HorizontalPanel :navList="searchSize" v-model:selectType="firstSize"></HorizontalPanel>
  </a-drawer>

  
</template>

<script>
import Widget from '../../card/Widget.vue';
import HorizontalPanel from '../../HorizontalPanel.vue';
import { AggregateList } from '../../../js/data/searchData'

export default {
  name:'AggregateSearch',
  components:{
    Widget,
    HorizontalPanel
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
      aggSearchShow:false,
      AggregateList,
      searchEngineIcon:'',
      searchSize:[
        {title:'2x2',width:1,height:1,name:'2x2'},
        {title:'4x2',width:2,height:1,name:'4x2'}
      ],
      firstSize:{title:'2x2',width:1,height:1,name:'2x2'},
      bottomSizeList:[{title:'2x2',width:1,height:1,name:'2x2'},{title:'4x2',width:2,height:1,name:'4x2'}],
      gameMiddleBare:[ { icon: 'shezhi1', title: '设置', fn: () => {this.aggSearchShow = true;this.$refs.aggregateSearchSlot.visible = false } } ],
    }
  },
  computed:{
    searchEngine(){
      if(this.customData.width !== 1){
        return this.AggregateList.slice(0,4)
      }else{
        return this.AggregateList.slice(0,2)
      }
    }
  },
  mounted(){
    this.searchEngineIcon = AggregateList[0].url
  },
  watch:{
    // 'firstSize.width':{
    //   handler(newVal){
    //     this.customData.width = newVal
    //   }
    // }
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

:deep(.nav-item){
  width: 50% !important;
}
</style>