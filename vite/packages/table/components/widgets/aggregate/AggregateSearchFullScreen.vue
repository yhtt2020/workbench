<template>
  <div class="w-full h-full search-full"  >
    <div class="w-full flex flex-col p-3">
      <div class="w-full flex justify-end mb-8">
        <div class="flex items-center rounded-lg pointer justify-center active-button h-12 w-12" @click="closeSearchFullScreen" style="background: var(--secondary-bg);">
          <Icon icon="guanbi" style="font-size: 1.5em;color: var(--secondary-text);"></Icon>
        </div>
      </div>
      <div class="w-full flex  justify-center">
        <div class="mr-3 flex flex-col">
          <div class="secondary-title px-3 mb-2" style="color: var(--secondary-text);">搜索引擎</div>
          <div v-for="(item,index) in searchList"  class="flex items-center pointer rounded-lg mb-3 py-3 px-3" :key="index"
           @click="selectAggSearch(item,index)" :class="{'active-bg':aggSelectIndex === index}" 
          >
            <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
              <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <span class="ml-2 secondary-title" style="color: var(--secondary-text);">{{item.title}}</span>
          </div>
        </div>
        <div  class="mt-4 flex flex-col">
           <div class="flex items-center justify-center rounded-lg h-12 p-3" style="border: 1px solid var(--divider);width: 480px;background: var(--secondary-bg);">
             <div class="flex items-center justify-center" style="width: 20px;height:20px;">
              <Icon :icon="aggSelectIcon.icon" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
             </div>
             <a-input v-model:value="aggSearchWord" placeholder="搜索" :bordered="false" class="search" @change="dataSearch($event)"
             @pressEnter="enterSearch"
             ></a-input>
           </div>
           <div class="flex flex-col">
            <vue-custom-scrollbar :settings="settingsScroller" style="height:50vh;">
              <div v-for="(item, index) in suggestList" :class="{'':suggestIndex === index}"  class="py-2.5 px-3 secondary-title rounded-lg active-button search-hover pointer" 
               @click="getSuggestItem(item)" 
              >
                <span style="color: var(--secondary-text);">
                  {{ 
                    item.q ? item.q : item.value ? item.value : item.query ? item.query 
                    : item.name ? item.name : item.suggestion ? item.suggestion : item 
                   }}
                </span>
              </div>
            </vue-custom-scrollbar>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { appStore } from "../../../store";
import { AggregateList } from "../../../js/data/searchData";
import axios from "axios";

export default {
 data(){
  return{
    suggestList:[],  // 接收搜索返回的推荐数据
    aggSearchWord:'', // 接收搜索关键字
    aggSelectIcon:{}, // 接收选中状态的图标
    settingsScroller: {  // 滚动条配置 
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
    },
    aggSelectIndex:'',  // 获取选中状态下标
    suggestIndex:'' // 搜索关键字推荐选中状态
  }
 },
 computed:{
  ...mapWritableState(appStore,['aggList']),
  searchList(){
    if(Object.keys(this.aggList).length !== 0){
      return this.aggList.list
    }
    return AggregateList
  },
  defaultIndex(){
    if(this.aggList.select_status && Object.keys(this.aggList).length !== 0){
      return this.aggList.select_status
    }
    return 0
  }

 },

 mounted(){
  this.aggSelectIndex = this.defaultIndex
  this.aggSelectIcon.icon = this.searchList[this.aggSelectIndex].icon
 },

 methods:{
  ...mapActions(appStore,['setSearchFullScreen']),
  closeSearchFullScreen(){  // 关闭聚合搜索全屏  
    this.setSearchFullScreen(false) 
  },
  selectAggSearch(item,index){  //  聚合搜索框在全屏情况下的筛选 
    this.aggSelectIndex = index
    this.aggSelectIcon.icon = item.icon
  },
  dataSearch(e){ // 聚合搜索关键字推荐  
    if(e.target.value.trim() === ''){ // 检查输入框是否为空状态
      this.suggestList = []
    }
    const words = encodeURIComponent(this.aggSearchWord)
    const url = `${this.searchList[this.aggSelectIndex].recommend_url}${words}`
    axios.get(url).then(res=>{
      switch (this.aggList.list[this.aggSelectIndex].id){
         case 0: // 百度搜索
          this.suggestList  = res.data.g
          break;
         case 1: 
          // 谷歌接口暂时不能使用,还没有找到api
          // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
         break;
         case 2: // 必应搜索
          this.suggestList  = res.data[1]
          break;
         case 3: // 知乎搜索
          this.suggestList  = res.data.suggest
          break;
         case 4:
          // github搜索引擎api暂时没有找到关键字搜索推荐
          this.suggestList = res.data.items
          break;
         case 5: // B站搜索
          this.suggestList  = res.data
          break;
         case 6:  // 微博搜索
          this.suggestList = res.data.data.hotquery
          break;
         case 7:  // 优酷搜索
          this.suggestList  = res.data.data
          break; 
         case 8:
          this.suggestList = res.data.words
          break; 
         default:
          break;
      }
    })
  },
  getSuggestItem(item){ // 选择推荐关键字  
    console.log(item);
    switch (this.aggList.list[this.aggSelectIndex].id){
      case 0: // 百度搜索
        this.aggSearchWord = item.q
        break;
      case 1: 
        // 谷歌接口暂时不能使用,还没有找到api
        // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
        break;
      case 2: // 必应搜索
        this.aggSearchWord = item
        break;
      case 3: // 知乎搜索
        this.aggSearchWord  = item.query
        break;
      case 4:
        // github搜索引擎api暂时没有找到关键字搜索推荐
        this.aggSearchWord = item.name
        break;
      case 5: // B站搜索
        this.aggSearchWord = item.value
        break;
      case 6:  // 微博搜索
        this.aggSearchWord = item.suggestion
        break;
      case 7:  // 优酷搜索
        this.aggSearchWord = item.name
        break; 
      case 8:
        this.aggSearchWord = item
        break; 
      default:
        break;
    }
  },
  enterSearch(){
    const words = encodeURIComponent(this.aggSearchWord)
    const url = `${this.searchList[this.aggSelectIndex].recommend_url}${words}`
    // console.log(url);
  }
 }    

}
</script>

<style lang="scss" scoped>
.search-full{
  background: var(--mask-bg);
  backdrop-filter: blur(12px);
}
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

.active-bg{
  background: var(--secondary-bg);
  color: var(--secondary-text);
}

.search-hover{
  &:hover{
    background: var(--secondary-bg);
  }
}
</style>