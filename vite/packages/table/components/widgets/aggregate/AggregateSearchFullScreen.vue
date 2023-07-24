<template>
  <div class="w-full h-full" style="position: relative;">
    <div class="search-mask pointer w-full h-full" @click="closeSearchFullScreen"></div>
    <div class="search-content search-full rounded-lg flex flex-col justify-between">
      <div class="p-4 flex">
        <!-- 左侧 -->
        <div class="flex flex-col mr-4">
          <div class="secondary-title px-3 mb-2" style="color: var(--secondary-text);">搜索引擎</div>
          <vue-custom-scrollbar :settings="settingsScroller" style="max-height:400px;">
              <div v-for="(item,index) in searchList" 
               class="flex items-center pointer rounded-lg mb-3 py-3 px-3" :key="index"
               :class="{'active-bg':searchIconIndex === index}"
               @click="selectAggSearch(item,index)" 
              >
                <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
                  <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
                </div>
                <span class="ml-2 primary-title" style="color: var(--primary-text);">{{item.title}}</span>
              </div>
          </vue-custom-scrollbar>
        </div>

        <!-- 右侧 -->
        <div class="flex flex-col">
          {{ selectIcon }}
          <div class="flex items-center justify-center rounded-lg h-12 p-3 mb-5" style="border: 1px solid var(--divider);width: 480px;background: var(--secondary-bg);">
            <div class="flex items-center justify-center" style="width: 20px;height:20px;">
              <Icon :icon="searchEngineIcon.icon" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <a-input v-model:value="searchKeyWords" placeholder="搜索" :bordered="false" class="search" allowClear ref="searchRef" @input="dataSearch" @pressEnter="enterSearch"></a-input>
          </div>
          <vue-custom-scrollbar :settings="settingsScroller"  style="max-height:366px;">
            <ul v-if="showSearchResults" style="padding: 0; margin: 0;">
              <li v-for="(suggestion,index) in searchSuggestionList" :key="index"  
               :class="{'active-bg':suggestIndex === index}" 
               class="py-2.5 px-3 secondary-title rounded-lg active-button search-hover pointer"
               @click="getSuggestItem(suggestion,index)"
              >
                <!-- 百度搜索 -->
                <div v-if="suggestion.q" class="flex">
                  <span class="ping-title" style="color:var(--secondary-text);" v-html="matchingKey(suggestion.q)"></span>
                </div>

                <!-- bili搜索 -->
                <div v-else-if="suggestion.value" class="flex">
                  <span class="ping-title" style="color: var(--secondary-text);" v-html="matchingKey(suggestion.value)"></span>
                </div>

                <!-- 豆瓣、微博搜索 -->
                <div v-else-if="suggestion.suggestion">
                  <span class="ping-title" style="color: var(--secondary-text);" v-html="matchingKey(suggestion.suggestion)"></span>
                </div>

                <!-- github、优酷搜索 -->
                <div v-else-if="suggestion.name">
                  <span class="ping-title" style="color: var(--secondary-text);" v-html="matchingKey(suggestion.name) "></span>
                </div>

                <!-- 知乎搜索 -->
                <div v-else-if="suggestion.query">
                  <span class="ping-title" style="color: var(--secondary-text);" v-html="matchingKey(suggestion.query)"></span>
                </div>

                <!-- 必应搜索 -->
                <div v-else-if="suggestion">
                  <span class="ping-title" style="color: var(--secondary-text);" v-html="matchingKey(suggestion)"></span>
                </div>
              </li>
            </ul> 
          </vue-custom-scrollbar>
        </div>
      </div>

      <!-- 底部 -->
      <div class="rounded-b-lg flex items-center h-12 px-4 py-3" style="background: var(--secondary-bg);">
        <div class="secondary-title " style="color: var(--secondary-text);">按下</div>
        <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mx-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">Tab</div>
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
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { appStore } from "../../../store";
import { AggregateList } from "../../../js/data/searchData";
import axios from "axios";
import browser from '../../../js/common/browser'
import _ from 'lodash-es'

export default {

  data(){
    return{
      
      searchKeyWords:'', // 搜索关键字
      searchIconIndex:'', // 搜索引擎图标下标
      searchEngineIcon:{}, // 搜索引擎图标
      searchSuggestionList:[], // 搜索建议列表
      suggestIndex:-1, // 搜索建议列表下标

      settingsScroller: {  // 滚动条配置 
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
    }
  },
  
  computed:{
    ...mapWritableState(appStore,['aggList']),
    searchList(){ // 获取左侧tab栏列表数据  
      if(this.aggList && this.aggList.list){
        return this.aggList.list
      }else{
        return AggregateList
      }
    },
    selectIcon(){  // 获取选中的图标 
   
      if(this.aggList && this.aggList.select_status){
        const statusIndex = this.aggList.select_status
        const index = _.findIndex(this.searchList,function(o){ return statusIndex === o.id })
        return index
      }else{
        return 0
      }
    },
    showSearchResults(){  // 显示搜索建议列表
      if(this.searchSuggestionList !== undefined && this.searchKeyWords === ''){
        return false
      }else{
        return true
      }
    }
  },


  mounted(){
    this.searchIconIndex = this.selectIcon
    this.searchEngineIcon.icon = this.searchList[this.searchIconIndex].icon
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

    keyBoardTrigger(e){  // 键盘触发  
      if(e.key === 'Tab'){ // 触发tab键切换功能  
        e.preventDefault();
        this.searchIconIndex = (this.searchIconIndex + 1) %  this.searchList.length
        this.searchEngineIcon.icon = this.searchList[this.searchIconIndex].icon
      }
      if(e.key === 'ArrowUp'){  // 上切换键 
      this.suggestIndex = Math.max(this.suggestIndex - 1, -1);
      this.updateInputValue()
      }else if(e.key === 'ArrowDown'){  // 下切换键
       this.suggestIndex = (this.suggestIndex + 1) %  this.searchSuggestionList.length
       this.updateInputValue()
      }
      if(e.key === 'Escape'){ // 触发esc键关闭弹窗
        this.setSearchFullScreen(false) 
      }
    },

    dataSearch(){  // 输入关键字词 
      if(this.searchKeyWords === ''){
        this.searchSuggestionList = [];
        return;
      }
      this.fetchSuggestions(true)
    },

    async fetchSuggestions(val){  // 获取搜索建议列表 数据请求 
      if(val){  // 防止重复请求
        const words = encodeURIComponent(this.searchKeyWords)
        const url = `${this.searchList[this.searchIconIndex].recommend_url}${words}`
        const result = await axios.get(url)
        switch (this.aggList.list[this.searchIconIndex].id){
        case 0: // 百度搜索
          this.searchSuggestionList  = result.data.g
          break;
        case 1: 
          // 谷歌接口暂时不能使用,还没有找到api
          // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
         break;
        case 2: // 必应搜索
           if(this.aggSearchWord !== '' ){  // 处理必应搜索为空时显示自带的数据
            this.searchSuggestionList = result.data[1]
           }
          break;
        case 3: // 知乎搜索
          this.searchSuggestionList  = result.data.suggest
          break;
        case 4:
          // github搜索引擎api暂时没有找到关键字搜索推荐
          if(this.aggSearchWord !== '' ){
            this.searchSuggestionList = result.data.items
          }
          break;
        case 5: // B站搜索
          this.searchSuggestionList  = result.data
          break;
        case 6:  // 微博搜索
          this.searchSuggestionList = result.data.data.hotquery
          break;
        case 7:  // 优酷搜索
          this.searchSuggestionList  = result.data.data
          break; 
        case 8:
          this.searchSuggestionList = result.data.words
          break; 
        default:
          break;
        }
      }else{
        return
      }
    },

    matchingKey(val){ // 匹配搜索关键字是否存在  
      const isMatched = val.includes(this.searchKeyWords);
      if(isMatched && this.searchSuggestionList.length !== 1){
       const regex = new RegExp(this.searchKeyWords,'gi');
       return val.replace(regex, `<span style="color:var(--active-bg);">${this.searchKeyWords}</span>`);
      }else{
        return val
      }
    },

    updateInputValue(){ // 搜索建议列表项选中赋值给搜索关键词 
      const id = this.aggList.list[this.searchIconIndex].id
      switch (id) {
        case 0:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].q
            this.fetchSuggestions(false)
          }
          break;
        case 1:
          break;
        case 2:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex]
            this.fetchSuggestions(false)
          }
         break;
        case 3:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].query
            this.fetchSuggestions(false)
          }
         break;
        case 4:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].name
            this.fetchSuggestions(false)
          }
          break;
        case 5:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].value
            this.fetchSuggestions(false)
          }
          break;
        case 6:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].suggestion
            this.fetchSuggestions(false)
          }
          break;
        case 7:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].name
            this.fetchSuggestions(false)
          }
          break;
        case 8:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex]
            this.fetchSuggestions(false)
          }
          break;
        default:
          break;
      }
    },

    enterSearch(){  // 回车进行搜索
     const enterWords = encodeURIComponent(this.searchKeyWords)
     this.openSearchSuggest(enterWords)
    },

    openSearchSuggest(words){  // 回车或者点击其他后根据不同打开方式类型进行打开
     const url = `${this.searchList[this.searchIconIndex].search_url}${words}`
     switch (this.aggList.type) { 
      case 'work':
        browser.openInTable(url)  // 在工作台中打开
        this.aggSearchWord = ''
        this.suggestList = []
        break;
      case 'thisky':
        browser.openInInner(url) // 在想天浏览器打开
        this.aggSearchWord = ''
        this.suggestList = []
        break;
      case 'system':
        browser.openInSystem(url) // 在系统默认的浏览器打开
        this.aggSearchWord = ''
        this.suggestList = []
        break;
      default:
        break;
     }
    },

    getSuggestItem(item,index){ // 选择推荐关键字  
     this.suggestIndex = index
     switch (this.aggList.list[this.searchIconIndex].id){
      case 0: // 百度搜索
        const baiduWords = encodeURIComponent(item.q)
        this.openSearchSuggest(baiduWords)
        break;
      case 1: 
        // 谷歌接口暂时不能使用,还没有找到api
        // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
        break;
      case 2: // 必应搜索
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

    selectAggSearch(item,index){  //  聚合搜索框在全屏情况下的筛选 
     this.searchIconIndex = index
     this.searchEngineIcon.icon = item.icon
     this.setSearchIndex(index)
     this.$refs.searchRef.focus()
     this.fetchSuggestions(true)
    },

  },
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
  color: var(--primary-text);
  list-style: none;
  &:hover{
    background: var(--secondary-bg);
  }
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

.search-mask{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  background:rgba(0, 0, 0, 0.45);
}

.search-content{
  position:absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 1000;
  width:649px;
  height: 500px;
  background: var(--primary-bg);
}
</style>