<template>
  <div class="flex flex-col">
    <div class="flex p-4">
      <div class="flex flex-col mr-4">
        <div class="secondary-title px-3 mb-2" style="color: var(--secondary-text);">搜索引擎</div>
        <vue-custom-scrollbar :settings="settingsScroller" class="left-tab-container" style="max-height:400px;">
          <div v-for="(item,index) in list" class="flex items-center pointer rounded-lg mb-3 py-3 px-3" :key="index"
          :class="{'active-bg': selectIndex === index}" @click="selectAggSearch(item,index)"
          >
            <div class="flex items-center justify-center" style="width: 20px;height:20px;" >
              <Icon :icon="item.icon" style="font-size: 2em;color: rgba(82,196,26, 1);"></Icon>
            </div>
            <span class="ml-2 primary-title" style="color: var(--primary-text);">{{item.title}}</span>
          </div>
        </vue-custom-scrollbar>
      </div>
      <div class="flex flex-col " >
        <div class="flex items-center justify-center rounded-lg h-12 pl-3 pr-1  mb-5" style="border: 1px solid var(--divider);width: 480px;background: var(--secondary-bg);">
          <div class="flex items-center justify-center" style="width: 20px;height:20px;">
            <Icon :icon="selectIcon.icon" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
          </div>
          <a-input  v-model:value="searchKeyWords" placeholder="搜索" spellcheck="false" :bordered="false" class="search" allowClear ref="searchRef"  @input="dataSearch"  @pressEnter.stop="enterSearch"></a-input>
          <a-dropdown v-model:visible="isDropdownVisible" placement="bottomRight" trigger="click">
            <div class="flex pointer items-center justify-center active-button p-2 rounded-lg" style="width:210px; background: var(--active-secondary-bg);"
            >
              <Icon icon="huichetijiao" style="color: var(--active-bg);"></Icon>
              <span class="secondary-title pl-2" style="color: var(--active-bg);">{{ openMode.name }}</span>
            </div>
            <template #overlay >
              <a-menu class="custom-dropdown-menu flex items-center flex-col justify-center">
                <a-menu-item style="color: var(--primary-text);"
                 v-for="(item,index) in linkType" :key="index"
                 @click="changeOpenType(item,index)" class="rounded-lg"

                >
                <!--  :class="{current: openIndex === index }" -->
                  {{ item.name }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <vue-custom-scrollbar :settings="settingsScroller" class="suggest-container"  style="max-height:360px;">
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
          <div v-else class="flex flex-col">
            <template v-if="!getClipBoardData.includes('')">
              <div class="flex flex-col" style="width:483px;">
                <span class="mb-2.5 secondary-title"   style="color: var(--secondary-text);">剪切板</span>
                <div v-for="(item,index) in getClipBoardData" class="flex primary-title rounded-lg flex-col p-3 pointer"
                :class="{'active-bg':clipboardIndex === index}" @click="selectClipboardItem(item,index)"
                style="color: var(--secondary-text);"
                >
                 {{ item }}
                </div>
              </div>
            </template>
          </div>
        </vue-custom-scrollbar>
      </div>
    </div>

    <div class="rounded-b-lg flex items-center h-12 px-3 py-3" style="background: var(--secondary-bg);">
      <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mr-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">Tab</div>
      <div class="secondary-title " style="color: var(--secondary-text);">切换搜索引擎</div>
      <div class="h-7 w-7 flex rounded-lg items-center justify-center mx-2 search-tag">
        <Icon icon="arrowup" style="color:rgba(0, 0, 0, 0.65);font-size: 1.5em;"></Icon>
      </div>
      <div class="h-7 w-7 flex rounded-lg items-center justify-center mr-2 search-tag">
        <Icon icon="arrowdown" style="color: rgba(0, 0, 0, 0.65);font-size: 1.5em;"></Icon>
      </div>
      <div class="secondary-title " style="color: var(--secondary-text);">切换选择候选项</div>
      <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mx-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">Ctrl</div>
      <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mr-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">Tab</div>
      <div class="secondary-title " style="color: var(--secondary-text);">切换打开方式</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import browser from '../../../js/common/browser'
import _ from 'lodash-es'
import { mapActions,mapWritableState } from "pinia";
import {clipboardStore} from '../../../apps/clipboard/store'
const {clipboard} = require('electron')

export default {
  props:{
    list:{
      type:Array,
      default:()=>[]
    },
    listId:{
      type:Number,
      default:0,
    },
    urlType:{
      type:String
    }
  },
  data(){
    return{
      settingsScroller: {  // 滚动条配置
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      selectIcon:{  // 被选中的图标
        icon:this.list[this.listId].icon
      },
      selectIndex:this.listId,  // 被选中的下标
      searchKeyWords:'', // 搜索关键字
      searchSuggestionList:[], // 搜索建议列表
      suggestIndex:-1, // 搜索建议列表下标
      clipboardIndex:-1, // 剪切板内容列表下标
      isDropdownVisible:false, // 是否显示下拉列表
      linkType:[  // 设置中打开方式类型
        {name:'工作台内打开',value:'work'},
        {name:'想天浏览器',value:'thisky'},
        {name:'系统默认浏览器',value:'system'}
      ],
      openMode:{},
      openIndex:''
    }
  },


  computed:{
    ...mapWritableState(clipboardStore,['items']),
    showSearchResults(){  // 显示搜索建议列表
      if(this.searchSuggestionList !== undefined && this.searchKeyWords === ''){
        return false
      }else{
        return true
      }
    },
    getOpenMode(){
      const type = this.urlType
      const index = _.findIndex(this.linkType,function(o){ return type === o.value })
      return index
    },
    getClipBoardData(){  // 获取剪切板数据
      const clipBoardText = clipboard.readText()
      const clipBoardList = clipBoardText.split('\r\n')
      return [...clipBoardList]
    }
  },

  mounted(){
    this.$nextTick(()=>{
     this.$refs.searchRef.focus()
     // 监听键盘触发事件
     window.addEventListener('keydown',this.keyBoardTrigger)
     window.addEventListener('keyup',this.removeKeyBoardTrigger)
     this.openMode = this.linkType[this.getOpenMode]
     this.openIndex  = this.getOpenMode
    })
  },
  methods:{
    // 键盘操作
    keyBoardTrigger(evt){
      if(evt.ctrlKey && evt.key === 'Tab'){  // ctrl+tab组合键
        evt.preventDefault()
        this.isDropdownVisible = true
        if(evt.key === 'Tab'){ // tab键
          evt.preventDefault()
          this.openIndex = parseInt((this.openIndex + 1) % this.linkType.length)
          this.openMode = this.linkType[this.openIndex]
        }
      }else if(evt.key === 'Tab'){ // tab键
        evt.preventDefault()
        this.selectIndex = (this.selectIndex + 1) %  this.list.length
        this.selectIcon.icon = this.list[this.selectIndex].icon
        this.fetchSuggestions(true)
        this.leftTabScrollToTop()
      }else if(evt.key === 'ArrowUp'){ // 向上键
        evt.preventDefault()
        if(this.showSearchResults){
          this.suggestIndex = Math.max(this.suggestIndex - 1, -1);
          this.suggestScrollTop()
          this.updateInputValue()
        }else {
          this.clipboardIndex = parseInt((this.clipboardIndex + 1) % this.getClipBoardData.length)
          this.searchKeyWords = this.getClipBoardData[this.clipboardIndex]
          this.suggestScrollTop()
          this.fetchSuggestions(true)
        }
      }else if(evt.key === 'ArrowDown'){  // 向下键
        evt.preventDefault()
        if(this.showSearchResults){
          this.suggestIndex = parseInt((this.suggestIndex + 1) %  Object.keys(this.searchSuggestionList).length)
          this.suggestScrollBottom()
          this.updateInputValue()
        }else{
          this.clipboardIndex = parseInt((this.clipboardIndex + 1) % this.getClipBoardData.length)
          this.searchKeyWords = this.getClipBoardData[this.clipboardIndex]
          this.suggestScrollBottom()
          this.fetchSuggestions(true)
        }
      }
    },

    // 键盘抬起
    removeKeyBoardTrigger(evt){
      if(evt.code === 'ControlLeft'){
        this.isDropdownVisible = false
      }
    },

    dataSearch(){  // 监听输入框关键字输入
      if(this.searchKeyWords === ''){
        this.searchSuggestionList = [];
        return;
      }
      this.fetchSuggestions(true)
    },

    // 获取搜索建议列表 数据请求
    async fetchSuggestions(val){
      if(val){ // 防止重复请求
        const words = encodeURIComponent(this.searchKeyWords)
        const url = `${this.list[this.selectIndex].recommendUrl}${words}`
        const result = await axios.get(url)
        this.getDataFields(result)
      }
      return
    },

    selectAggSearch(item,index){  // 点击列表项选中
      this.selectIndex = index
      this.selectIcon.icon = item.icon
      this.$refs.searchRef.focus()
      this.fetchSuggestions(true)
    },

    // 根据不同搜索引擎api返回的字段获取数据
    getDataFields(res){
      if(this.list[this.selectIndex].id === 3 &&res.data[1]){ // 必应搜索建议
        this.searchSuggestionList = res.data[1]
      }else if(this.list[this.selectIndex].id === 1 && res.data.g){  // 百度搜索建议
        this.searchSuggestionList =  res.data.g
      }else if(this.list[this.selectIndex].id === 4 && res.data.suggest){  // 知乎搜索建议
        this.searchSuggestionList =  res.data.suggest
      }else if(this.list[this.selectIndex].id === 5 && res.data.items){  // github搜索建议
        this.searchSuggestionList =  res.data.items
      }else if(this.list[this.selectIndex].id === 6 && res.data){  // bilibili搜索建议
        this.searchSuggestionList =  res.data
      }else if(this.list[this.selectIndex].id === 8 && res.data.data){  // 优酷搜索建议
        this.searchSuggestionList  = res.data.data
      }else if(this.list[this.selectIndex].id === 9 && res.data.words){  // 豆瓣搜索建议
        this.searchSuggestionList = res.data.words
      }else if(this.list[this.selectIndex].id === 7 && res.data.data && res.data.data.hotquery){
        this.searchSuggestionList = res.data.data.hotquery
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
      const id = this.list[this.selectIndex].id
      if(id === 1 && this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
        this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].q
        this.fetchSuggestions(false)
      }else if(id === 2 && this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
        return
      }else if(id === 3 && this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
        this.searchKeyWords = this.searchSuggestionList[this.suggestIndex]
        this.fetchSuggestions(false)
      }else if(id === 4 && this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
        this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].query
        this.fetchSuggestions(false)
      }else if(id === 5 && this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
        this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].name
        this.fetchSuggestions(false)
      } else if(id === 6 && this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
        this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].value
        this.fetchSuggestions(false)
      }
    },

    openSearchSuggest(words){  // 回车或者点击其他后根据不同打开方式类型进行打开
     const url = `${this.list[this.selectIndex].searchUrl}${words}`
     switch (this.openMode.value) {
      case 'work':
        browser.openInTable(url)  // 在工作台中打开
        break;
      case 'thisky':
        browser.openInInner(url) // 在想天浏览器打开
        break;
      case 'system':
        browser.openInSystem(url) // 在系统默认的浏览器打开
        break;
      default:
        break;
     }
    },

    enterSearch(){  // 回车进行搜索
     const enterWords = encodeURIComponent(this.searchKeyWords)
     this.openSearchSuggest(enterWords)
    },

    getSuggestItem(item,index){ // 选择推荐关键字
     this.suggestIndex = index
     switch (this.list[this.selectIndex].id){
      case 1: // 百度搜索
        const baiduWords = encodeURIComponent(item.q)
        this.openSearchSuggest(baiduWords)
        break;
      case 2:
        // 谷歌接口暂时不能使用,还没有找到api
        // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
        break;
      case 3: // 必应搜索
        const bingWords = encodeURIComponent(item)
        this.openSearchSuggest(bingWords)
        break;
      case 4: // 知乎搜索
        const zhihuWords = encodeURIComponent(item.query)
        this.openSearchSuggest(zhihuWords)
        break;
      case 5:
        // github搜索引擎api暂时没有找到关键字搜索推荐
        const githubWords = encodeURIComponent(item.name)
        this.openSearchSuggest(githubWords)
        break;
      case 6: // B站搜索
        const biliWords = encodeURIComponent(item.value)
        this.openSearchSuggest(biliWords)
        break;
      case 7:  // 微博搜索
        const weiboWords = encodeURIComponent(item.suggestion)
        this.openSearchSuggest(weiboWords)
        break;
      case 8:  // 优酷搜索
        const youkuWords = encodeURIComponent(item.name)
        this.openSearchSuggest(youkuWords)
        break;
      case 9:  // 豆瓣搜索
        const doubanWords = encodeURIComponent(item)
        this.openSearchSuggest(doubanWords)
        break;
      default:
        break;
     }
    },

    changeOpenType(item,index){  // 手动切换
      this.openMode = item
      this.openIndex = index
      this.isDropdownVisible = false
    },

    selectClipboardItem(item,index){
      this.clipboardIndex = index
      this.searchKeyWords = item
      this.fetchSuggestions(true)
    },

    leftTabScrollToTop(){  // tab触发时高度滚动
      const container = document.querySelector('.left-tab-container')
      if(this.selectIndex === 0){ // 判断下标为0
        container.scrollTop = 0
      }else if(this.selectIndex === 6){
        container.scrollTop = container.clientHeight
      }
    },

    suggestScrollTop(){  // 向上键盘触发
      const container = document.querySelector('.suggest-container')
      if(this.suggestIndex === 0 && this.clipboardIndex === -1 || this.suggestIndex === 2){
        container.scrollTop = 0
      }
    },

    suggestScrollBottom(){  //  向下键盘触发
      const container = document.querySelector('.suggest-container')
      if(this.suggestIndex === 0 && this.clipboardIndex === -1){
        container.scrollTop = 0
      }else if(this.suggestIndex === 7){
        container.scrollTop = container.clientHeight
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

  font-size: 16px;
  font-weight: 500;
}

.secondary-title{

  font-size: 14px;
  font-weight: 400;
}

.ping-title{

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

.custom-dropdown-menu{
  border-radius: 8px !important;
  background-color:var(--secondary-bg) !important;
  box-shadow: none !important;

}

:deep(.ant-dropdown-menu-item ){
  &:hover{
    background-color:var(--active-secondary-bg) !important ;
  }
}

:deep(.current){
  background-color: var(--active-bg);
  color: var(--active-text) !important;
}

:deep(.ant-input){
  &::placeholder{
    color:var(--secondary-text) !important;
  }
}
</style>
