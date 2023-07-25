<template>
  <div class="flex flex-col">
    <div class="flex p-4">
      <div class="flex flex-col mr-4">
        <div class="secondary-title px-3 mb-2" style="color: var(--secondary-text);">搜索引擎</div>
        <vue-custom-scrollbar :settings="settingsScroller" style="max-height:400px;">
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
        <div class="flex items-center justify-center rounded-lg h-12 p-3 mb-5" style="border: 1px solid var(--divider);width: 480px;background: var(--secondary-bg);">
          <div class="flex items-center justify-center" style="width: 20px;height:20px;">
            <Icon :icon="selectIcon.icon" style="font-size: 4em;color: rgba(82,196,26, 1);"></Icon>
          </div>
          <a-input v-model:value="searchKeyWords" placeholder="搜索" :bordered="false" class="search" allowClear ref="searchRef"  @input="dataSearch"  @pressEnter="enterSearch"></a-input>
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

    <div class="rounded-b-lg flex items-center h-12 px-3 py-3" style="background: var(--secondary-bg);">
      <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mx-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">Tab</div>
      <div class="secondary-title " style="color: var(--secondary-text);">切换搜索引擎</div>
      <div class="h-7 w-7 flex rounded-lg items-center justify-center mx-2 search-tag">
        <Icon icon="arrowup" style="color:rgba(0, 0, 0, 0.65);font-size: 1.5em;"></Icon>
      </div>
      <div class="h-7 w-7 flex rounded-lg items-center justify-center mx-2 search-tag">
        <Icon icon="arrowdown" style="color: rgba(0, 0, 0, 0.65);font-size: 1.5em;"></Icon>
      </div>
      <div class="secondary-title " style="color: var(--secondary-text);">切换选择候选项</div>
      <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mx-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">Ctrl</div>
      <div class="px-4 py-2.5 w-12 h-7 flex items-center justify-center primary-title rounded-lg mx-2 search-tag" style="color: rgba(0, 0, 0, 0.65);">Tab</div>
      <div class="secondary-title " style="color: var(--secondary-text);">切换打开方式</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import browser from '../../../js/common/browser'

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
    }
  },

  computed:{
    showSearchResults(){  // 显示搜索建议列表
      if(this.searchSuggestionList !== undefined && this.searchKeyWords === ''){
        return false
      }else{
        return true
      }
    }
  },

  mounted(){
    this.$nextTick(()=>{
     this.$refs.searchRef.focus()
    })
    // 监听键盘触发事件
    window.addEventListener('keydown',this.keyBoardTrigger)
  },
  methods:{
    keyBoardTrigger(e){
      if(e.key === 'Tab'){ // 触发tab键切换功能  
        e.preventDefault();
        this.selectIndex = (this.selectIndex + 1) %  this.list.length
        this.selectIcon.icon = this.list[this.selectIndex].icon
        this.fetchSuggestions(true)
      }
      if(e.key === 'ArrowUp'){  // 上切换键 
       e.preventDefault()
       this.suggestIndex = Math.max(this.suggestIndex - 1, -1);
       this.updateInputValue()
      }else if(e.key === 'ArrowDown'){  // 下切换键
       this.suggestIndex = (this.suggestIndex + 1) %  this.searchSuggestionList.length
       this.updateInputValue()
      }
    },

    selectAggSearch(item,index){  // 点击列表项选中  
      this.selectIndex = index
      this.selectIcon.icon = item.icon
      this.$refs.searchRef.focus()
      this.fetchSuggestions(true)
    },
    
    async fetchSuggestions(val){  // 获取搜索建议列表 数据请求 
      if(val){  // 防止重复请求
        const words = encodeURIComponent(this.searchKeyWords)
        const url = `${this.list[this.selectIndex].recommendUrl}${words}`
        const result = await axios.get(url)
        switch (this.list[this.selectIndex].id){
         case 1: // 百度搜索
          this.searchSuggestionList  = result.data.g
          break;
         case 2: 
          // 谷歌接口暂时不能使用,还没有找到api
          // 谷歌搜索引擎api暂时没有找到关键字搜索推荐
         break;
         case 3: // 必应搜索
          if(this.searchKeyWords !== '' ){  // 处理必应搜索为空时显示自带的数据
            this.searchSuggestionList = result.data[1]
          }
          break;
         case 4: // 知乎搜索
          this.searchSuggestionList  = result.data.suggest
          break;
         case 5:
          // github搜索引擎api暂时没有找到关键字搜索推荐
          if(this.searchKeyWords !== ''){
            this.searchSuggestionList = result.data.items
          }
          break;
         case 6: // B站搜索
          this.searchSuggestionList  = result.data
          break;
         case 7:  // 微博搜索
          this.searchSuggestionList = result.data.data.hotquery
          break;
         case 8:  // 优酷搜索
          this.searchSuggestionList  = result.data.data
          break; 
         case 9:
          this.searchSuggestionList = result.data.words
          break; 
         default:
           break;
        }
      }else{
        return
      }
    },

    dataSearch(){  // 监听输入框关键字输入   
      if(this.searchKeyWords === ''){
        this.searchSuggestionList = [];
        return;
      }
      this.fetchSuggestions(true)
    },

    enterSearch(){  // 回车进行搜索
     const enterWords = encodeURIComponent(this.searchKeyWords)
     this.openSearchSuggest(enterWords)
    },

    openSearchSuggest(words){  // 回车或者点击其他后根据不同打开方式类型进行打开 
     const url = `${this.list[this.selectIndex].searchUrl}${words}`
     console.log(url);
     switch (this.urlType) { 
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
      switch (id) {
        case 1:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].q
            this.fetchSuggestions(false)
          }
          break;
        case 2:
          break;
        case 3:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex]
            this.fetchSuggestions(false)
          }
         break;
        case 4:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].query
            this.fetchSuggestions(false)
          }
         break;
        case 5:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].name
            this.fetchSuggestions(false)
          }
          break;
        case 6:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].value
            this.fetchSuggestions(false)
          }
          break;
        case 7:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].suggestion
            this.fetchSuggestions(false)
          }
          break;
        case 8:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex].name
            this.fetchSuggestions(false)
          }
          break;
        case 9:
          if(this.searchKeyWords !== '' &&  this.suggestIndex !== -1){
            this.searchKeyWords = this.searchSuggestionList[this.suggestIndex]
            this.fetchSuggestions(false)
          }
          break;
        default:
          break;
      }
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