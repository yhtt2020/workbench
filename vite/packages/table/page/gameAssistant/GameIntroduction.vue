<template>
<div class="flex flex-row items-center " style="margin-left: 1em">
  <div class="flex flex-row">
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="defaultRunGame.title"
    class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false" >
    <a-select-option v-for="item in gameName" :value="item.title">{{item.title}}</a-select-option>
  </a-select>
  <HorizontalPanel  :navList="introductionSubList" v-model:selectType="introductionType"></HorizontalPanel>
  <!-- <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="defaultSortType.name"
    @change="selectHotType($event)"
    class="w-60 h-12 ml-3 rounded-lg s-bg text-xs right-nav" size="large" :bordered="false" >
    <a-select-option v-for="item in sortType" :value="item.name">{{item.title}}</a-select-option>
  </a-select> -->
  </div>
  <div class="flex flex-row ml-3">
    <div @click="openDrawer('search')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
    <div @click="openDrawer('tip')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="tishi-xianxing"></Icon></div>
  </div>
</div>

<template v-if="introductionType.name==='video'">
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em);margin-left: 1em" class="mt-3 mr-3 s-bg rounded-lg" >
    <div class="flex flex-row flex-wrap -ml-3  p-3" >
      <div  @click="openUrl(item.arcurl)" class="pb-3  pl-3 game-list-item flex-shrink-0" v-for="(item,index) in gameVideoList">
        <div class=" rounded-lg w-auto pointer mb-2"   style="height: 65.5%;position: relative;" >
          <img :src="`https:${item.pic}`" class="w-full h-full rounded-lg object-cover"  alt="">
          <div class="bfl px-4 mb-1 flex justify-between" >
            <div class="flex">
              <div class="flex items-center justify-center">
                <Icon icon="play-square" class="text-color" style="font-size: 1.2em;"></Icon>
                <span class="ml-1 text-color">{{item.play.toString().slice(0,2)+ '.' + item.play.toString().slice(0,4).slice(3)}}万</span>
              </div>
              <div class="mx-2">
                <Icon icon="detail" class="text-color" style="font-size: 1.2em;"></Icon>
                <span class="ml-1 text-color">{{item.danmaku}}</span>
              </div>
            </div>
            <div class="text-color">{{item.duration}}</div>
          </div>
        </div>
        <div class="text-white mb-2 px-1 pointer" @click="openUrl(item.arcurl)" style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;  ">
          {{item.title.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '')}}
        </div>
        <div class="flex flex-row justify-between items-center px-2">
          <div>{{item.author}}</div>
          <div>{{ changeTime(item.senddate)}}</div>
        </div>
      </div>
    </div>
    <!-- <div class="flex items-center justify-center mb-5">
    <a-pagination v-model:current="current" :total="1176" :pageSizeOptions="['42']" defaultPageSize="42" @change="getPage($event)">
        <template #itemRender="{ type, originalElement }">
          <a v-if="type === 'prev'" class="px-1 py-1 page-ination mx-5">上一页</a>
          <a v-else-if="type === 'next'" class="mx-5">下一页</a>
          <component :is="originalElement" v-else></component>
        </template>
      </a-pagination>
    </div> -->
  </vue-custom-scrollbar>
</template>
<template v-else>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em);margin-left: 1em" class="mt-3 mr-3" >
    <div v-for="item in gameIntroductionList" style="width: calc(100vw - 275px)" class="s-bg h-14 mb-3 rounded-xl nav-top-game flex flex-row items-center px-4 inline-block">
      <div class="round-dot mr-4 flex-shrink-0"></div>
      <div class="text-more inline-block">{{item.title}}</div>
      <div class="ml-auto flex-shrink-0">{{item.date}}</div>
    </div>
  </vue-custom-scrollbar>
</template>


<a-drawer :width="500"  v-model:visible="drawerVisible" placement="right">
    <template #title>
      <div class="text-center" v-if="drawerType==='search'">搜索</div>
      <div class="text-center" v-else>说明</div>
    </template>
    <a-input v-model:value="searchData" class="no-drag h-10 w-full" @pressEnter="searchVideoData" placeholder="搜索"  style="
    border-radius: 12px;background: rgba(42, 42, 42, 0.6);" v-if="drawerType==='search'">
      <template #prefix>
        <Icon icon="sousuo"></Icon>
      </template>
    </a-input>
    <div v-else class="px-14">
      <div>视频攻略数据均来自「Bilibili」，本应用不提供任何攻略数据</div>
      <div class="drawer-item-bg h-10 rounded-lg w-20 mx-auto flex justify-center items-center mt-3 pointer" @click="goBil">访问官网</div>
      <div class="mt-3">图文攻略数据均来自「游民星空」，本应用不提供任何攻略数据</div>
      <div class="drawer-item-bg h-10 rounded-lg w-20 mx-auto flex justify-center items-center mt-3 pointer" @click="goYm">访问官网</div>
    </div>
</a-drawer>
</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue'
// import { sendRequest } from '../../js/axios/api';
import cheerio from 'cheerio'
import browser from '../../js/common/browser'
import axios from 'axios'

export default {
  name: "GameIntroduction",
  components:{
    HorizontalPanel
  },
  data(){
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      drawerVisible:false,
      drawerType:'search',
      introductionType:{title:'视频攻略',name:'video'},
      searchData:'',
      gameName:[
        {title:'FIFA 23'}
      ],
      sortType:[
        {title:'综合排序',name:''},
        {title:'最多点击',name:'click'},
        {title:'最新发布',name:'pubdate'},
        {title:'最多弹幕',name:'dm'},
        {title:'最多收藏',name:'stow'}
      ],
      defaultSortType:{title:'综合排序',name:''},
      defaultRunGame: {title:'FIFA 23'} ,
      introductionSubList:[{title:'视频攻略',name:'video'},{title:'图文攻略',name:'textImg'}],
      gameVideoList:[],
      gameIntroductionList:[],
      current:1,
    }
  },

  mounted(){
    this.getGameIllustrated()
    this.loadIllustratedData()
  },

  methods:{
    openDrawer(e){
      this.drawerType = e
      this.drawerVisible = true
    },
    goBil(){
      browser.openInUserSelect('https://www.bilibili.com/')
    },
    goYm(){
      browser.openInUserSelect('https://www.gamersky.com/')
    },
    // 初始化数据
    async loadIllustratedData(){
      // https://api.bilibili.com/x/web-interface/search/all/v2?page=1&keyword=${encodeURIComponent(this.defaultRunGame.title)}
      const synUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.defaultRunGame.title)}&search_source=1`
      // const synUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.defaultRunGame.title)}`
      const now = (Date.now() + '').substr(-8)
      // const url = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.defaultRunGame.title)}&search_source=1&order=${this.defaultSortType.name}`
      const url =  `https://search.bilibili.com/all?vt=${now}&keyword=${encodeURIComponent(this.defaultRunGame.title)}&search_source=1&order=${this.defaultSortType.name}`
      if(this.defaultSortType.name === ''){
        this.dataRequest(synUrl)
      }else{
        this.dataRequest(url)
      }
    },

    // 搜索接口  
    async searchVideoData(){
      this.gameVideoList = []
      const url = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.searchData)}`
      this.dataRequest(url)
      // try {
      //   const result =  await sendRequest(`https://search.bilibili.com/all?keyword=${encodeURIComponent(this.searchData)}`,{})
      //   const html = result.data
      //   const dom = cheerio.load(html)
      //   dom('.bili-video-card').each((i,el)=>{
      //     const docFirst = dom(el).children().eq(1)
      //     const linkUrl = docFirst.children().eq(0).attr('href')
      //     const newDateTime = docFirst.children().eq(1).text().split('·')[1]
      //     const title = docFirst.children().eq(1).children().eq(0).children().eq(0).children().eq(0).attr('title')
      //     const author = docFirst.children().eq(1).children().eq(0).children().eq(1).children().eq(0).children().text().split('·')[0]
      //     const image  = docFirst.children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(2).attr('src')
      //     if(author !== '' && newDateTime !== undefined){
      //       this.gameVideoList.push({url:linkUrl,image,newDateTime,author,title})
      //     }
      //   })
      // } catch (error) {
      //   console.warn(error);
      // }
    },

    // 游戏图文攻略数据获取
    async getGameIllustrated(){
      this.gameIntroductionList = []
      const url = `https://so.gamersky.com/all/handbook?s=${this.defaultRunGame.title}`
      axios.get(url).then(res=>{
        const html = res.data
        const dom = cheerio.load(html)
        dom('.t2').children().each((i,el)=>{
          const href = dom(el).eq(0).attr('href')
          const title = dom(el).eq(0).text()
          // console.log({href,title});
          this.gameIntroductionList.push({href,title})
        })
      })
      // try {
      //   // const illResult = await sendRequest(`https://so.gamersky.com/all/handbook?s=FIFA+23&p=3`)
      //   const html = illResult.data
      //   const dom = cheerio.load(html)
      //   dom('.t2').children().each((i,el)=>{
      //     const href = dom(el).eq(0).attr('href')
      //     const title = dom(el).eq(0).text()
      //     // console.log({href,title});
      //     this.gameIntroductionList.push({href,title})
      //   })
      // } catch (error) {
      //   console.warn(error)
      // }
    },

    openUrl(url){
      browser.openInUserSelect(url)
    },

    selectHotType(e){
      // this.defaultSearchType.name = e
      this.loadIllustratedData()
    },

    //数据请求
    dataRequest(url){
      // console.log('地址',url);
      axios.get(url).then(res =>{
          const htmlText = res.data
          // 使用正则表达式匹配 <script> 标签中的 JavaScript 代码
          const regex = /<script.*?>((.|\n)*?)<\/script>/gi;
          const matches = htmlText.match(regex)[12];
          const startIndex = matches.indexOf('(');
          const endIndex = matches.lastIndexOf(')');
          const jsonString = matches.substring(startIndex, endIndex + 1);
          const data = window.eval(jsonString).index.searchAllResponse.result[10].data
          data.forEach(el=>{
            if(el.title !== ''){
              this.gameVideoList.push(el)
            }
          })
      })
    },
    // 日期转换
    changeTime(newDate){
      const nowTime = new Date(parseInt(newDate)*1000)
      return nowTime.toLocaleDateString()
    },
    getPage(e){
      // console.log('页码',e);
      const url = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.defaultRunGame.title)}&search_source=3&page=${e}&o=36`
      // const url = `https://api.bilibili.com/x/web-interface/search/all/v2?page=${e}&keyword=${encodeURIComponent(this.defaultRunGame.title)}`
      // console.log(url);
      // axios.get(url).then(res=>{
      //   console.log(res);
      // })
      // console.log(url);
      this.dataRequest(url)
    }
  },
}
</script>

<style scoped>
.nav-top-game{
  max-width: 1050px;
}
.game-list-item{
  aspect-ratio: 231/200;
  max-width: 340px;
}
@media screen and (max-width: 1226px){
  .right-nav{
  display: none;
  }
}
@media screen and (max-width: 940px){
  .game-list-item{
    width: calc(100% / 2);
  }
}
@media screen and (min-width: 940px) and (max-width: 1140px){
  .game-list-item{
    width: calc(100% / 3);
  }
}
@media screen and (min-width: 1140px) and (max-width: 1340px){
  .game-list-item{
    width: calc(100% / 4);
  }
}
@media screen and (min-width: 1340px)and (max-width: 1540px){
  .game-list-item{
    width: calc(100% / 5);
  }
}

@media screen and (min-width: 1540px)and (max-width: 1740px){
  .game-list-item{
    width: calc(100% / 6);
  }
}
@media screen and (min-width: 1740px)and (max-width: 1940px){
  .game-list-item{
    width: calc(100% / 7);
  }
}
@media screen and (min-width: 1940px)and (max-width: 2140px){
  .game-list-item{
    width: calc(100% / 8);
  }
}
@media screen and (min-width: 2140px)and (max-width: 2340px){
  .game-list-item{
    width: calc(100% / 9);
  }
}
@media screen and (min-width: 2340px)and (max-width: 2540px){
  .game-list-item{
    width: calc(100% / 10);
  }
}
@media screen and (min-width: 2540px)and (max-width: 2740px){
  .game-list-item{
    width: calc(100% / 11);
  }
}
@media screen and (min-width: 2740px)and (max-width: 2940px){
  .game-list-item{
    width: calc(100% / 12);
  }
}
.bfl{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color:rgba(255, 255, 255, 0.85) !important;
}

:deep(.ant-pagination-options){
  display: none;
}

/*

.page-ination{
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: rgba(255, 255, 255, 0.6);
}
*/
</style>
