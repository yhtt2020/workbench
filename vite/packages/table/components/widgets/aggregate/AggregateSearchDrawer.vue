<template>
  <div class="mb-6">
    <transition name="fade">
      <div class="flex flex-col" id="aggregate-drop">
        <div v-for="item in drawerList" class="flex items-center agg-set mb-4 p-3 rounded-xl" :data-index="item.id">
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

</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { appStore } from '../../../store';
import { AggregateList } from '../../../js/data/searchData'
import { HolderOutlined } from '@ant-design/icons-vue'
import Sortable from 'sortablejs';
import _ from 'lodash-es'
import cache from '../../card/hooks/cache';

export default {
  components:{
    HolderOutlined
  },
  props:{
    drawerList:{
      type:Object,
      default:()=>[]
    }
  },

  data(){
    return{
      aggDarggingCore:false,
      AggregateList
    }
  },

  computed:{},

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
    ...mapActions(appStore,['getAggList']),
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
          that.$emit('setSortedList',newItems)
          cache.set('aggSortList',newItems)
          that.getAggList()
        },
      })
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