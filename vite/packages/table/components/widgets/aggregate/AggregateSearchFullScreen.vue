<template>
  <div class="w-full h-full flex" style="background:rgba(0, 0, 0, 0.45);">
    <!-- 点击左边空白区域关闭 -->
    <div class="pointer" style="width: 25%;" @click="closeSearchFullScreen"></div>


    <!-- 搜索内容区域展示 -->
    <div class="flex items-center justify-center" style="width: 50%;">
      <div class="search-content search-full flex flex-col justify-between rounded-lg">
        <div class="p-4 flex">
          <!-- 聚合搜索左侧tab栏 -->
          <div class="flex flex-col mr-4">
            <div class="secondary-title px-3 mb-2" style="color: var(--secondary-text);">搜索引擎</div> 
            <vue-custom-scrollbar :settings="settingsScroller" style="max-height:400px;">
              <div v-for="(item,index) in searchList"  class="flex items-center pointer rounded-lg mb-3 py-3 px-3" :key="index"
              @click="selectAggSearch(item,index)" :class="{'active-bg':aggSelectIndex === index}" 
              >
               <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
                <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
               </div>
               <span class="ml-2 primary-title" style="color: var(--primary-text);">{{item.title}}</span>
              </div>
            </vue-custom-scrollbar>
          </div>
          <!-- 右侧搜索数据展示 -->
          <div class="flex flex-col">
            <div class="flex items-center justify-center rounded-lg h-12 p-3 mb-5" style="border: 1px solid var(--divider);width: 480px;background: var(--secondary-bg);">
              <div class="flex items-center justify-center" style="width: 20px;height:20px;">
               <Icon :icon="aggSelectIcon.icon" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
              </div>
              <a-input v-model:value="aggSearchWord" placeholder="搜索" :bordered="false" class="search" @change="dataSearch($event)"
              @pressEnter="enterSearch"  ref="searchRef" allowClear
              ></a-input>
            </div>
            <div class="flex flex-col" v-if="suggestShow === false">
              <vue-custom-scrollbar :settings="settingsScroller"  style="max-height:366px;">
                <div v-for="(item, index) in suggestList"  :class="{'active-bg':suggestIndex === index}"  class="py-2.5 px-3 secondary-title rounded-lg active-button search-hover pointer" 
                @click="getSuggestItem(item,index)"  
                >  
                  <!-- 百度搜索关键字 -->
                  <div v-if="item.q" class="flex">
                     <span class="ping-title" style="color: var(--active-bg);">
                      {{ matchingKey(item.q) }}
                     </span>
                     <span class="ping-title" style="color: var(--secondary-text);">
                      {{ matchingOther(item.q) }}
                     </span>
                  </div>

                  <!-- bili搜索关键字 -->
                  <div v-else-if="item.value" class="flex">
                    <span class="ping-title" style="color: var(--active-bg);">
                     {{ matchingKey(item.value) }}
                    </span>
                    <span class="ping-title" style="color: var(--secondary-text);">
                     {{ matchingOther(item.value) }}
                    </span>
                  </div>

                  <div v-else-if="item.name">
                    <span class="ping-title" style="color: var(--active-bg);">
                      {{ matchingKey(item.name) }}
                    </span>
                    <span class="ping-title" style="color: var(--secondary-text);">
                      {{ matchingOther(item.name) }}
                    </span>
                  </div>

                  <div v-else-if="item.query">
                    <span class="ping-title" style="color: var(--active-bg);">
                      {{ matchingKey(item.query) }}
                    </span>
                    <span class="ping-title" style="color: var(--secondary-text);">
                      {{ matchingOther(item.query) }}
                    </span>
                  </div>

                  <div v-else-if="item.suggestion">
                    <span class="ping-title" style="color: var(--active-bg);">
                      {{ matchingKey(item.suggestion) }}
                    </span>
                    <span class="ping-title" style="color: var(--secondary-text);">
                      {{ matchingOther(item.suggestion) }}
                    </span>
                  </div>

                  <div v-else>
                    <span class="ping-title" style="color: var(--active-bg);">
                      {{ matchingKey(item) }}
                     </span>
                     <span class="ping-title" style="color: var(--secondary-text);">
                      {{ matchingOther(item) }}
                     </span>
                  </div>
      
                </div>
              </vue-custom-scrollbar>
            </div>
          </div>
          
        </div>
        <div class="rounded-b-lg flex items-center h-12 px-4 py-3" style="background: var(--secondary-bg);">
          <div class="secondary-title " style="color: var(--secondary-text);">按下</div>
          <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mx-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">
            Tab
          </div>
          <div class="secondary-title " style="color: var(--secondary-text);">快速切换搜索引擎，支持使用</div>
          <div class="h-7 w-7 flex rounded-lg items-center justify-center mx-2 search-tag">
            <Icon icon="arrowup" style="color:rgba(0, 0, 0, 0.65);font-size: 1.5em;"></Icon>
          </div>
          <div class="h-7 w-7 flex rounded-lg items-center justify-center mx-2 search-tag">
            <Icon icon="arrowdown" style="color: rgba(0, 0, 0, 0.65);font-size: 1.5em;"></Icon>
          </div>
          <div class="secondary-title " style="color: var(--secondary-text);">
            快速选择候选项
          </div>
        </div>
      </div>
    </div>


    <!-- 点击右边空白区域关闭 -->
    <div class="pointer" style="width: 25%;" @click="closeSearchFullScreen"></div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { appStore } from "../../../store";
import { AggregateList } from "../../../js/data/searchData";
import axios from "axios";
import browser from '../../../js/common/browser'

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
    suggestIndex:0, // 搜索关键字推荐选中状态
    suggestShow:false, // 选中后将推荐不显示 
  }
 },
 computed:{
  ...mapWritableState(appStore,['aggList']),
  searchList(){
    if(Object.keys(this.aggList).length !== 0){
      return this.aggList.list
    }else{
      return AggregateList
    }
  },
  defaultIndex(){
    if(this.aggList.select_status && Object.keys(this.aggList).length !== 0){
      return this.aggList.select_status
    }else{
      return 0
    }
  },
  
 },

 mounted(){
  this.aggSelectIndex = this.defaultIndex
  this.aggSelectIcon.icon = this.searchList[this.aggSelectIndex].icon
  this.$nextTick(()=>{
    this.$refs.searchRef.focus()
  })
  // 监听键盘触发事件
  window.addEventListener('keydown',this.keyBoardTrigger)
 },

 methods:{
  ...mapActions(appStore,['setSearchFullScreen','setSearchIndex']),
  closeSearchFullScreen(){  // 关闭聚合搜索全屏  
    this.setSearchFullScreen(false) 
  },
  selectAggSearch(item,index){  //  聚合搜索框在全屏情况下的筛选 
    this.aggSelectIndex = index
    this.aggSelectIcon.icon = item.icon
    this.setSearchIndex(index)
    this.$refs.searchRef.focus()
    const words = encodeURIComponent(this.aggSearchWord)
    const url = `${item.recommend_url}${words}`
    this.searchFetch(url)
  },
  dataSearch(e){ // 聚合搜索关键字推荐  
    if(e.target.value.trim() === ''){ // 检查输入框是否为空状态
      this.suggestShow = false
      this.suggestList = []
    }
    const words = encodeURIComponent(this.aggSearchWord)
    const url = `${this.searchList[this.aggSelectIndex].recommend_url}${words}`
    this.searchFetch(url)
  },

  getSuggestItem(item,index){ // 选择推荐关键字  
    this.suggestShow = true
    this.suggestIndex = index
    switch (this.aggList.list[this.aggSelectIndex].id){
      case 0: // 百度搜索
        // this.aggSearchWord = item.q
        const baiduWords = encodeURIComponent(item.q)
        this.openSearchSuggest(baiduWords)
        break;
      case 1: 
        // 谷歌接口暂时不能使用,还没有找到api
        // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
        break;
      case 2: // 必应搜索
        // this.aggSearchWord = item
        const bingWords = encodeURIComponent(item)
        this.openSearchSuggest(bingWords)
        break;
      case 3: // 知乎搜索
        const zhihuWords = encodeURIComponent(item.query)
        this.openSearchSuggest(zhihuWords)
        break;
      case 4:
        // github搜索引擎api暂时没有找到关键字搜索推荐
        const githubWords = encodeURIComponent(item.name)
        this.openSearchSuggest(githubWords)
        break;
      case 5: // B站搜索
        const biliWords = encodeURIComponent(item.value)
        this.openSearchSuggest(biliWords)
        break;
      case 6:  // 微博搜索
        const weiboWords = encodeURIComponent(item.suggestion)
        this.openSearchSuggest(weiboWords)
        break;
      case 7:  // 优酷搜索
        const youkuWords = encodeURIComponent(item.name)
        this.openSearchSuggest(youkuWords)
        break; 
      case 8:  // 豆瓣搜索
        const doubanWords = encodeURIComponent(item)
        this.openSearchSuggest(doubanWords)
        break; 
      default:
        break;
    }
  },

  enterSearch(){  // 回车进行搜索
    const enterWords = encodeURIComponent(this.aggSearchWord)
    this.openSearchSuggest(enterWords)
  },

  openSearchSuggest(words){  // 回车或者点击其他后根据不同打开方式类型进行打开
    const url = `${this.searchList[this.aggSelectIndex].search_url}${words}`
    switch (this.aggList.type) { 
      case 'work':
        browser.openInTable(url)  // 在工作台中打开
        this.aggSearchWord = ''
        break;
      case 'thisky':
        browser.openInInner(url) // 在想天浏览器打开
        this.aggSearchWord = ''
        break;
      case 'system':
        browser.openInSystem(url) // 在系统默认的浏览器打开
        this.aggSearchWord = ''
        break;
      default:
        break;
    }
  },

  keyBoardTrigger(e){  // 键盘触发事件
    if(e.key === 'Tab'){ // 触发tab键切换功能
      e.preventDefault();
      this.aggSelectIndex = (this.aggSelectIndex + 1) %  this.searchList.length
      this.aggSelectIcon.icon = this.searchList[this.aggSelectIndex].icon
      const words = encodeURIComponent(this.aggSearchWord)
      const url = `${this.searchList[this.aggSelectIndex].recommend_url}${words}`
      this.searchFetch(url)
    }
    if(e.key === 'ArrowUp'){
      if((this.suggestIndex - 1) %  this.suggestList.length >= -1){
        e.preventDefault()
        this.suggestIndex = 0
      }else{
        this.suggestIndex --
      }
    }else if(e.key === 'ArrowDown'){
      this.suggestIndex = (this.suggestIndex + 1) %  this.suggestList.length
    }
    // if(e.key === 'Enter'){
    //   // const enterWords = encodeURIComponent(this.)
    //   // this.openSearchSuggest(enterWords)
    // }
  },
 
  matchingKey(val){ // 匹配搜索关键字是否存在  
    const isMatched = val.includes(this.aggSearchWord);
    if(isMatched){
      const resultVal = val.slice(0,this.aggSearchWord.length)
      return resultVal
    }
  },

  matchingOther(val){ // 除了搜索关键字之外的字符串
    return val.slice(this.aggSearchWord.length)
  },

  async searchFetch(url){  // 搜索api数据请求
    const result = await axios.get(url)
    switch (this.aggList.list[this.aggSelectIndex].id){
      case 0: // 百度搜索
          this.suggestList  = result.data.g
          break;
         case 1: 
          // 谷歌接口暂时不能使用,还没有找到api
          // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
         break;
         case 2: // 必应搜索
           if(this.aggSearchWord !== '' ){  // 处理必应搜索为空时显示自带的数据
            this.suggestList  = result.data[1]
           }
          break;
         case 3: // 知乎搜索
          this.suggestList  = result.data.suggest
          break;
         case 4:
          // github搜索引擎api暂时没有找到关键字搜索推荐
          this.suggestList = result.data.items
          break;
         case 5: // B站搜索
          this.suggestList  = result.data
          break;
         case 6:  // 微博搜索
          this.suggestList = result.data.data.hotquery
          break;
         case 7:  // 优酷搜索
          this.suggestList  = result.data.data
          break; 
         case 8:
          this.suggestList = result.data.words
          break; 
         default:
          break;
    }
  },

 }    

}
</script>

<style lang="scss" scoped>
.search-full{
  background: var(--mask-bg);
  backdrop-filter: blur(40px);
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
  font-size: 14px;
  font-weight: 400;
}

.ping-title{
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

.search-content{
  width:649px;
  height: 500px;
  background: var(--primary-bg);
}

:deep(.anticon.ant-input-clear-icon-has-suffix){
 background: var(--secondary-bg) !important;
 color: var(--secondary-text) !important;
 font-size: 1.5em !important;
}

.search-tag{
  opacity: 0.5;
  background:var(--disable-text);
  border-radius: 6px;
}
</style>