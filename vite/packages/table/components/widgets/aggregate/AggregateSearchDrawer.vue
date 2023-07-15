<template>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
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
</template>

<script>
import { AggregateList } from '../../../js/data/searchData'
import { HolderOutlined } from '@ant-design/icons-vue'
import HorizontalPanel from '../../HorizontalPanel.vue';
// import Sortable from 'sortablejs'

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
  watch:{
    openByDefault:{ // 监听设置中链接打开方式切换状态  
      handler(){
        this.openByDefault = this.openByDefault
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