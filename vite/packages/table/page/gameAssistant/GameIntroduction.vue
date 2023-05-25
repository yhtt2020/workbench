<template>
<div class="flex flex-row items-center " style="margin-left: 1em">
  <div class="flex flex-row">
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="defaultRunGame.title"
    class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false" >
    <a-select-option v-for="item in gameName" :value="item.title">{{item.title}}</a-select-option>
  </a-select>
  <HorizontalPanel  :navList="introductionSubList" v-model:selectType="introductionType"></HorizontalPanel>
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="defaultSortType.name" 
    @change="selectHotType($event)"
    class="w-60 h-12 ml-3 rounded-lg s-bg text-xs right-nav" size="large" :bordered="false" >
    <a-select-option v-for="item in sortType" :value="item.name">{{item.title}}</a-select-option>
  </a-select>
  </div>
  <div class="flex flex-row ml-3">
    <div @click="openDrawer('search')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
    <div @click="openDrawer('tip')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="tishi-xianxing"></Icon></div>
  </div>
</div>

<template v-if="introductionType.name==='video'">
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em);margin-left: 1em" class="mt-3 mr-3 s-bg rounded-lg" >
    <div class="flex flex-row flex-wrap -ml-3 " >
      <div class="pb-3 pl-3 game-list-item flex-shrink-0" v-for="(item,index) in gameVideoList">
        <div class=" rounded-lg w-auto pointer "   style="height: 65.5%" >
          <img :src="item.image" class="w-full h-full rounded-lg object-cover"  alt="">
        </div>
        <div class="text-white " style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;  ">{{item.title}}</div>
        <div class="flex flex-row justify-between items-center">
          <div>{{item.author}}</div>
          <div>{{item.date}}</div>
        </div>
      </div>
    </div>
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
import { sendRequest } from '../../js/axios/api';
import cheerio from 'cheerio'
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
        {title:'副屏'},
        {title:'小缇娜的奇幻之地'}
      ],
      sortType:[
        {title:'综合排序',name:''},
        {title:'最多点击',name:'click'},
        {title:'最新发布',name:'pubdate'},
        {title:'最多弹幕',name:'dm'},
        {title:'最多收藏',name:'stow'}
      ],
      defaultSortType:{title:'综合排序',name:''},
      defaultRunGame:{title:'副屏'},
      introductionSubList:[{title:'视频攻略',name:'video'},{title:'图文攻略',name:'textImg'}],
      gameVideoList:[],
      gameIntroductionList:[]
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
      ipc.send('addTab',{url:'https://www.bilibili.com/'})
    },
    goYm(){
      ipc.send('addTab',{url:'https://www.gamersky.com/'})
    },
    // 初始化数据
    async loadIllustratedData(){
      const order = this.defaultSortType !== '' ? `order=${this.defaultSortType.name}` : '' 
      try {
        const result =  await sendRequest(`https://search.bilibili.com/all?keyword=${encodeURIComponent(this.defaultRunGame.title)}&${order}`,
        {},{localCache:true,localTtl:60*12*60})
        console.log(result.data);
        const html = result.data
        const dom = cheerio.load(html)
        dom('.bili-video-card').each((i,el)=>{
          const docFirst = dom(el).children().eq(1)
          const linkUrl = docFirst.children().eq(0).attr('href')
          const newDateTime = docFirst.children().eq(1).text().split('·')[1] 
          const title = docFirst.children().eq(1).children().eq(0).children().eq(0).children().eq(0).attr('title')
          const author = docFirst.children().eq(1).children().eq(0).children().eq(1).children().eq(0).children().text().split('·')[0]
          const image  = docFirst.children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(2).attr('src')
          if(author !== '' && newDateTime !== undefined){
            console.log({url:linkUrl,image,newDateTime,author,title});
            this.gameVideoList.push({url:linkUrl,image,newDateTime,author,title})
          }
        })
      } catch (error) {
        console.warn(error)
      }
    },

    // 搜索接口
    async searchVideoData(){
      this.gameVideoList = []
      try {
        const result =  await sendRequest(`https://search.bilibili.com/all?keyword=${encodeURIComponent(this.searchData)}`,{},{localCache:true,localTtl:60*12*60})
        const html = result.data
        const dom = cheerio.load(html)
        dom('.bili-video-card').each((i,el)=>{
          const docFirst = dom(el).children().eq(1)
          const linkUrl = docFirst.children().eq(0).attr('href')
          const newDateTime = docFirst.children().eq(1).text().split('·')[1] 
          const title = docFirst.children().eq(1).children().eq(0).children().eq(0).children().eq(0).attr('title')
          const author = docFirst.children().eq(1).children().eq(0).children().eq(1).children().eq(0).children().text().split('·')[0]
          const image  = docFirst.children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(2).attr('src')
          console.log({url:linkUrl,image,newDateTime,author,title});
          if(author !== '' && newDateTime !== undefined){
            this.gameVideoList.push({url:linkUrl,image,newDateTime,author,title})
          }
        })
      } catch (error) {
        console.warn(error);
      }
    },

    // 游戏图文攻略数据获取
    async getGameIllustrated(){
      this.gameIntroductionList = []
      try {
        const illResult = await sendRequest(`https://so.gamersky.com/all/handbook?s=FIFA+23&p=3`,{},{localCache:true,localTtl:60*12*60})
        const html = illResult.data
        const dom = cheerio.load(html)
        dom('.t2').children().each((i,el)=>{
          const href = dom(el).eq(0).attr('href')
          const title = dom(el).eq(0).text()
          // console.log({href,title});
          this.gameIntroductionList.push({href,title})
        })
      } catch (error) {
        console.warn(error)
      }
    },
  
    selectHotType(e){
      // this.defaultSearchType.name = e
      // this.loadIllustratedData()
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
</style>
