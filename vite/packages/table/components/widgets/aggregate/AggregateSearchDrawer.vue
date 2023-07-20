<template>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
    <div class="primary-title" style="color: var(--primary-text);">搜索引擎</div>
    <div class="secondary-title mt-2 mb-6" style="color: var(--secondary-text);">长按拖拽排序，最多支持在卡片上的展示5个搜索引擎</div>
    <div class="mb-6">
      <transition name="fade">
        <div class="flex flex-col" id="aggregate-drop">
          <div v-for="(item,index) in AggregateList" class="flex items-center agg-set mb-4 p-3 rounded-xl" :data-index="index">
            <div class="flex items-center cursor-move search-engine" style="width: 40%;">
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
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { AggregateList } from '../../../js/data/searchData'
import { HolderOutlined } from '@ant-design/icons-vue'
import HorizontalPanel from '../../HorizontalPanel.vue';
import Sortable from 'sortablejs';
import _ from 'lodash-es'
import cache from '../../card/hooks/cache';
import { appStore } from '../../../store';


export default {
  components:{
    HolderOutlined,
    HorizontalPanel
  },
  data(){
    return{
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      AggregateList,
      linkType:[  // 设置中打开方式类型
        {title:'工作台内打开',name:'work'},
        {title:'想天浏览器',name:'thisky'},
        {title:'系统默认浏览器',name:'system'}
      ],
      openByDefault:{title:'工作台内打开',name:'work'}, // 默认打开链接方式
      
    }
  },
  computed:{
    ...mapWritableState(appStore,['aggList'])
  },
  mounted(){
    let aggregateDrop = document.getElementById("aggregate-drop")
    aggregateDrop.addEventListener('ondragover',()=>{
      ev.preventDefault()
    })
    aggregateDrop.addEventListener('drop',()=>{
      this.aggDarggingCore = false
    })
    this.$nextTick(()=>{
      this.searchEngineList()
    })
  },
  methods:{
    ...mapActions(appStore,['getAggList','setSearchUrlOpenType']),
    searchEngineList(){
      let that = this
      let listDrag = document.getElementById('aggregate-drop') // 获取外层容器实现拖拽
      Sortable.create(listDrag,{
        sort: true,  // 开启排序
        animation: 150,
        direction: 'vertical', 
        delay: 0,
        onStart:function(event){},
        onUpdate:function(event){
          const items = event.target.children // 获取拖拽的使用子项
          const newItems = []
          for (let i = 0; i < items.length; i++) { // 遍历获取每一项
           const index = parseInt(items[i].getAttribute('data-index'));  // 获取到指定的data-index属性
           newItems.push(that.AggregateList[index]); // 将数据更新
          }   
          cache.set('aggSortList',newItems)
          that.getAggList()
        },
      })
    }
  },
  watch:{
    openByDefault:{ // 监听设置中链接打开方式切换状态  
      handler(){
        this.openByDefault = this.openByDefault
        this.setSearchUrlOpenType(this.openByDefault.name)
      }
    },
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