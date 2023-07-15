<!-- 聚合搜索 -->
<template>
  <Widget :customData="customData" :customIndex="customIndex" :desk="desk" :options="options"
    :menuList="gameMiddleBare" ref="aggregateSearchSlot" :sizeList="bottomSizeList"
  > 
    <div class="flex items-center rounded-xl p-2 w-full justify-center mt-8 mb-3" style="border: 1px solid var(--divider);">
      <div class="flex items-center justify-center" style="width: 20px;height:20px;">
        <Icon icon="baidu" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
      </div>
      <a-input v-model:value="value" placeholder="搜索" :bordered="false" ></a-input>
    </div>
    <div class="flex">
      <div v-for="item in searchEngine" class="flex rounded-xl active-button pointer items-center justify-center mr-2.5 h-11"
       style="background: var(--secondary-bg);" :style="customData.width !== 1 ? {width:'113px'} : {width:'92px'}"
      >
        <div class="flex items-center justify-center" style="width: 20px;height:20px;">
          <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
        </div>
        <span class="ml-2">{{item.title}}</span> 
      </div>
      <div class="w-11 h-11 active-button flex items-center justify-center rounded-xl pointer" style="background: var(--secondary-bg);"
        @click="aggSearchShow = true"
      >
        <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
  </Widget>

  <a-drawer :width="500" title="设置" :placement="right" v-model:visible="aggSearchShow" @close="onClose">
    <AggregateSearchDrawer></AggregateSearchDrawer>
    <!-- <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
      <div class="primary-title mb-6" style="color: var(--primary-text);">小组件尺寸</div>
      <HorizontalPanel :navList="smallSize" v-model:selectType="defaultMinSize"></HorizontalPanel>
    </vue-custom-scrollbar> -->

  </a-drawer>

  
</template>

<script>
import Widget from '../../card/Widget.vue';
import AggregateSearchDrawer from './AggregateSearchDrawer.vue';
import { AggregateList } from '../../../js/data/searchData'

export default {
  name:'AggregateSearch',
  components:{
    Widget,
    AggregateSearchDrawer
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
      searchEngineIcon:'',
      smallSize:[  // 设置小组件尺寸
        {title:'2x2',className:'small',name:'2x2'},
        {title:'4x2',className:'double',name:'4x2'}
      ],
      defaultMinSize:{title:'2x2',className:'small',name:'2x2'}, // 默认初始尺寸
      darggingCore:false, 
      propSize:{}, 
      bottomSizeList:[{title:'2x2',width:1,height:1,name:'2x2'},{title:'4x2',width:2,height:1,name:'4x2'}], // 底部设置中尺寸大小切换
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
    },
  },
  mounted(){
    this.searchEngineIcon = AggregateList[0].url
  },
  methods:{},
  watch:{
    defaultMinSize:{  // 监听设置初始尺寸状态切换  
      handler(){
        this.defaultMinSize = this.defaultMinSize
      },
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

</style>