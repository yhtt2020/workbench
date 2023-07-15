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

  <a-drawer
    :width="500"
    title="设置"
    :placement="right"
    v-model:visible="aggSearchShow"
    @close="onClose"
  >
    <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
      <!-- <div class="primary-title mb-6" style="color: var(--primary-text);">小组件尺寸</div>
      <HorizontalPanel :navList="smallSize" v-model:selectType="defaultMinSize"></HorizontalPanel> -->
      <div class="primary-title" style="color: var(--primary-text);">搜索引擎</div>
      <div class="secondary-title mt-2 mb-6" style="color: var(--secondary-text);">长按拖拽排序，最多支持在卡片上的展示5个搜索引擎</div>
      <div class="mb-6">
        <transition name="fade">
          <div class="flex flex-col" id="aggregate-drop">
            <div v-for="item in AggregateList" class="flex items-center agg-set mb-4 p-3 rounded-xl">
              <div class="flex items-center" style="width: 40%;">
                 <HolderOutlined style="font-size: 20px;"></HolderOutlined>
              </div>
              <div class="flex items-center">
                <div class="flex items-center justify-center mr-2">
                  <Icon :icon="item.icon" style="font-size: 1.75em;" :style="item.icon === 'bing' ? {color:'rgba(82,196,26, 1)'} : {}">
                  </Icon>
                </div>
                <span>{{ item.title }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="mb-6">链接打开方式</div>
      <HorizontalPanel :navList="linkType" v-model:selectType="openByDefault"></HorizontalPanel>
    </vue-custom-scrollbar>
    <!--  -->
  </a-drawer>

  
</template>

<script>
import Widget from '../../card/Widget.vue';
import HorizontalPanel from '../../HorizontalPanel.vue';
import { AggregateList } from '../../../js/data/searchData'
import { HolderOutlined } from '@ant-design/icons-vue'
import Sortable from 'sortablejs'

export default {
  name:'AggregateSearch',
  components:{
    Widget,
    HorizontalPanel,
    HolderOutlined
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
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      aggSearchShow:false, // 控制右侧抽屉显示
      AggregateList,
      searchEngineIcon:'',
      smallSize:[  // 设置小组件尺寸
        {title:'2x2',className:'small',name:'2x2'},
        {title:'4x2',className:'double',name:'4x2'}
      ],
      defaultMinSize:{title:'2x2',className:'small',name:'2x2'}, // 默认初始尺寸
      linkType:[  // 设置中打开方式类型
        {title:'工作台内打开',name:'work'},
        {title:'想天浏览器',name:'thisky'},
        {title:'系统默认浏览器',name:'system'}
      ],
      darggingCore:false, 
      propSize:{}, 
      openByDefault:{title:'工作台内打开',name:'work'}, // 默认打开链接方式
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
  methods:{
    // aggSearchDrop(){
    //   let that = this
    //   let aggregateDrop = document.querySelector('#aggregate-drop')
    //   Sortable.create(aggregateDrop,{
    //     sort: true,
    //     animation: 150,
    //     direction: 'vertical',
    //     delay: 0,
    //     onStart:function(event){
    //       console.log('拖拽测试::>>',event);
    //     }
    //   })
    // }
  },
  watch:{
    openByDefault:{ // 监听设置中链接打开方式切换状态  
      handler(){
        this.openByDefault = this.openByDefault
      }
    },
    defaultMinSize:{  // 监听设置初始尺寸状态切换  
      handler(){
        this.defaultMinSize = this.defaultMinSize
        // if(this.defaultMinSize.className === 'small'){
          
        // }else{
         
        // }
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

.agg-set{
  background: var(--secondary-bg);
}

:deep(.nav-item){
  width: 50% !important;
  border-radius: 8px !important;
}

:deep(.ps__rail-y){
  display: none !important;
}
</style>