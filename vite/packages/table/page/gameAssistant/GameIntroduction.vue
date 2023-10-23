<template>
  <div class="flex flex-row items-center pt-3.5" style="margin-left: 1em">
    <div class="flex flex-row mr-3" >
      <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="currentGame.appid"
                class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false">
        <a-select-option v-for="item in selectOptions" :value="item.appid">{{ item.chineseName }}</a-select-option>
      </a-select>
      <HorizontalPanel class="ml-2" :navList="introductionSubList" v-model:selectType="introductionType"></HorizontalPanel>
      <!-- <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="defaultSortType.name"
        @change="selectHotType($event)"
        class="w-60 h-12 ml-3 rounded-lg s-bg text-xs right-nav" size="large" :bordered="false" >
        <a-select-option v-for="item in sortType" :value="item.name">{{item.title}}</a-select-option>
      </a-select> -->
    </div>
    <div class="flex flex-row "  >
      <div @click="openDrawer('search')" style="background: var(--primary-bg); color: var(--primary-text);"
           class="pointer h-12 w-12 rounded-lg flex justify-center items-center">
        <Icon icon="sousuo"></Icon>
      </div>
      <div @click="openDrawer('tip')" style="background: var(--primary-bg);color: var(--primary-text);"
           class="pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3">
        <Icon icon="tishi-xianxing"></Icon>
      </div>
    </div>
  </div>
  <div class="p-5" v-if="currentGame.appid==='0' && !displayResult " style="text-align: center;margin-top: 10%">
    <div style="width: 360px;display: inline-block">

      <div class="flex items-center justify-center">
        <div class="line">
          <a-input allow-clear @keydown.enter="searchEnter" v-model:value="searchData" class="no-drag h-10 w-full" @pressEnter="searchEnter" placeholder="搜索"
                   style="
    border-radius: 12px;background:var(--secondary-bg);">
            <template #prefix>
              <Icon icon="sousuo" style="color: var(--secondary-text);"></Icon>
            </template>
          </a-input>
        </div>
        <div class="line">
          <xt-button :w="100" :h="38" type="theme"  class="rounded-lg"   @click="searchEnter"
                     >搜索
          </xt-button>
        </div>
      </div>
    </div>


  </div>

  <template v-else-if="introductionType.name==='video'">
    <vue-custom-scrollbar :settings="settingsScroller"
                          style="height: calc(100vh - 15.8em);margin-left: 1em;background: var(--primary-bg);"
                          class="mt-3 mr-3  rounded-lg">
      <div class="flex flex-row flex-wrap -ml-3  p-3">
        <div @click="openUrl(item.arcurl)" class="pb-3  pl-3 game-list-item flex-shrink-0"
             v-for="(item,index) in gameVideoList">
          <div class=" rounded-lg w-auto pointer mb-2" style="height: 65.5%;position: relative;">
            <img :src="`${getVideoCover(item.pic)}`" class="w-full h-full rounded-lg object-cover" alt="">
            <div class="bfl px-2 mb-1 flex justify-between">
              <div class="flex">
                <div class="flex items-center justify-center">
                  <Icon icon="play-square" class="text-color" style="font-size: 1.2em;"></Icon>
                  <span
                    class="ml-1 text-color">{{
                      item.play.toString().slice(0, 2) + '.' + item.play.toString().slice(0, 4).slice(3)
                    }}万</span>
                </div>
                <div class="mx-2">
                  <Icon icon="detail" class="text-color" style="font-size: 1.2em;"></Icon>
                  <span class="ml-1 text-color">{{ item.danmaku }}</span>
                </div>
              </div>
              <div class="text-color">{{ item.duration }}</div>
            </div>
          </div>
          <div class="text-white mb-2 px-1 pointer my-primary-title" @click="openUrl(item.arcurl)"
               style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;  ">
            {{ item.title.replace( /<em[^>]*>/g, '').replace(/<\/em>/g, '')}}
          </div>
          <div class="flex flex-row justify-between items-center px-2">
            <div class="my-secondary-title">{{ item.author }}</div>
            <div class="my-secondary-title">{{ changeTime(item.senddate) }}</div>
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
    <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em);margin-left: 1em"
                          class="mt-3 mr-3">
      <div v-for="item in gameIntroductionList" style="width: calc(100vw - 275px)" @click="openUrl(item.href)"
           class="h-14 guide-bg mb-3 rounded-xl nav-top-game flex flex-row items-center px-4 inline-block pointer">
        <div class="round-dot mr-4 flex-shrink-0"></div>
        <div class="text-more inline-block" style="color: var(--primary-text);">{{ item.title }}</div>
        <div class="ml-auto flex-shrink-0" style="color: var(--secondary-text);">{{ item.date }}</div>
      </div>
    </vue-custom-scrollbar>
  </template>


  <a-drawer :width="500" @close="this.searchData=''" v-model:visible="drawerVisible" placement="right">
    <template #title>
      <div class="text-center" v-if="drawerType==='search'">搜索</div>
      <div class="text-center" v-else>说明</div>
    </template>
    <template v-if="drawerType==='search'">
      <template v-if="currentGame.appid!=='0'">
        <div class="line-title">关键词自定义</div>
        <div class="line">当游戏名存在无法被搜索到的情况时，请手动自定义关键词</div>
        <div class="line">视频攻略关键词：</div>
        <div class="line">
          <a-input v-model:value="currentSearchWords.video" class="no-drag h-10 w-full" @pressEnter="searchEnter"
                   placeholder="视频关键词" style="
    border-radius: 12px;background:var(--secondary-bg);" v-if="drawerType==='search'">
          </a-input>
        </div>
        <div class="line">图文攻略关键词：</div>
        <div class="line">
          <a-input v-model:value="currentSearchWords.text" class="no-drag h-10 w-full" @pressEnter="searchEnter"
                   placeholder="图文关键词" style="
    border-radius: 12px;background:var(--secondary-bg);" v-if="drawerType==='search'">
          </a-input>
        </div>
      </template>

      <div class="line-title">
        搜索
      </div>
      <div class="line">
        <a-input v-model:value="searchData" class="no-drag h-10 w-full" @pressEnter="searchEnter" placeholder="搜索"
                 style="
    border-radius: 12px;background:var(--secondary-bg);">
          <template #prefix>
            <Icon icon="sousuo" style="color: var(--secondary-text);"></Icon>
          </template>
        </a-input>
      </div>
      <div class="line">
        <a-button type="primary" class="rounded-lg" style="color: var(--active-text);" @click="searchEnter" size="large"
                  block>搜索
        </a-button>
      </div>
    </template>
    <div v-else class="px-14">
      <div>视频攻略数据均来自「Bilibili」，本应用不提供任何攻略数据</div>
      <div class="h-10  xt-bg-2 rounded-lg w-20 mx-auto flex justify-center items-center mt-3 pointer"
           @click="goBil" style="color:var(--primary-text);">访问官网
      </div>
      <div class="mt-3">图文攻略数据均来自「游民星空」，本应用不提供任何攻略数据</div>
      <div class="h-10 rounded-lg xt-bg-2 w-20 mx-auto flex justify-center items-center mt-3 pointer"
           style="color:var(--primary-text);" @click="goYm">访问官网
      </div>
    </div>
  </a-drawer>
<!--  <Modal v-if="addVisible" v-model:visible="addVisible" :blurFlag="true">-->
<!--    <div class="p-5">-->
<!--      <div class="line-title">搜索</div>-->
<!--      <div class="line">当关键词不同的时候，请对输入框单独输入。</div>-->
<!--      <div class="line">视频攻略关键词：</div>-->
<!--      <div class="line">-->
<!--        <a-input v-if="addSearchWords.video!=='undefined'" @change="ensureAddWords"-->
<!--                 v-model:value.lazy="addSearchWords.video" class="no-drag h-10 w-full"-->
<!--                 placeholder="视频关键词" style="-->
<!--    border-radius: 12px;background:var(&#45;&#45;secondary-bg);">-->
<!--        </a-input>-->
<!--      </div>-->
<!--      <div class="line">图文攻略关键词：</div>-->
<!--      <div class="line">-->
<!--        <a-input v-if="addSearchWords.text!=='undefined'" @change="ensureAddWords"-->
<!--                 v-model:value.lazy="addSearchWords.text" class="no-drag h-10 w-full"-->
<!--                 placeholder="图文关键词" style="-->
<!--    border-radius: 12px;background:var(&#45;&#45;secondary-bg);">-->
<!--        </a-input>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="justify-center items-center flex mb-5">-->
<!--      <xt-button @click="doSearch" class="mr-5" type="theme">添加</xt-button>-->
<!--      <xt-button @click="addVisible=false" type="default">取消</xt-button>-->
<!--    </div>-->

<!--  </Modal>-->
</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue'
// import { sendRequest } from '../../js/axios/api';
import cheerio from 'cheerio'
import browser from '../../js/common/browser'
import axios from 'axios'
import { steamUserStore } from '../../store/steamUser'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { fixHttp } from '../../util'
import Modal from '../../components/Modal.vue'

export default {
  name: 'GameIntroduction',
  components: {
    Modal,
    HorizontalPanel
  },
  data () {

    return {
      displayResult:false,
      addVisible: false,
      customSearchWords: {
        searchWords:'',
        text: '',
        video: ''
      },
      currentGame: {
        name: '副屏',
        appid: '0',
        chineseName: ''
      },
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      drawerVisible: false,
      drawerType: 'search',
      introductionType: { title: '视频攻略', name: 'video' },
      searchData: '',
      gameName: [
        { title: 'FIFA 23' }
      ],
      sortType: [
        { title: '综合排序', name: '' },
        { title: '最多点击', name: 'click' },
        { title: '最新发布', name: 'pubdate' },
        { title: '最多弹幕', name: 'dm' },
        { title: '最多收藏', name: 'stow' }
      ],
      defaultSortType: { title: '综合排序', name: '' },
      introductionSubList: [{ title: '视频攻略', name: 'video' }, { title: '图文攻略', name: 'textImg' }],
      gameVideoList: [],
      gameIntroductionList: [],
      current: 1,
    }
  },
  computed: {
    ...mapWritableState(steamUserStore, ['searchWords']),
    ...mapState(steamUserStore, ['recentGameList', 'runningGame']),
    selectOptions(){
      return [
        {
          appid:'0',
          name:'自由搜索',
          chineseName:'自由搜索'
        },
        ...this.recentGameList

        ]
    },
    currentSearchWords: {
      get () {
        if(this.currentGame.appid==='0'){
          return this.customSearchWords
        }
        return this.searchWords[this.currentGame.appid]
      },
      set (val) {
        if(this.currentGame.appid==='0'){
          return this.customSearchWords
        }
        this.searchWords[this.currentGame.appid] = val
      }
    }
  },
  mounted () {
    //this.searchWords={}
    if (this.recentGameList.length === 0) {
      return
    }
    this.currentGame = {
      appid: this.recentGameList[0].appid,
      name: this.recentGameList[0].name,
      chineseName: this.recentGameList[0].chineseName
    }
    this.ensureSearchWords()
    this.loadArticleData()
    this.loadBiliData()
  },

  watch: {
    'introductionType.name': {
      handler () {
        if(this.currentGame.appid==='0'){
          this.displayResult=false
        }
        this.refreshData()
      }
    },
    'currentSearchWords.video': {
      handler (newVal) {
        this.searchData = newVal + ' '
      }
    },
    'currentSearchWords.text': {
      handler (newVal) {
        this.searchData = newVal
      }
    },
    'currentGame.appid': {
      handler (newVal, oldVal) {
        let game = this.recentGameList.find(game => {
          return game.appid === newVal
        })
        this.currentGame.name = game.name
        this.currentGame.chineseName = game.chineseName
        this.ensureSearchWords()
        this.refreshData()
      }
    }
  },
  methods: {
    // ensureAddWords (e) {
    //   if (this.addSearchWords.video!=='undefined' && this.addSearchWords.video!=='') {
    //     this.addSearchWords.text = 'undefined'
    //   }
    //   if (this.addSearchWords.text !=='undefined' && this.addSearchWords.text!=='') {
    //     this.addSearchWords.video = 'undefined'
    //   }
    // },
    goMyGame () {
      this.$router.push({ name: 'myGame' })
    },
    ensureSearchWords () {
      if(!this.currentGame.appid){
        return this.customSearchWords={
          video:'',
          text:''
        }
      }
      if (!this.searchWords[this.currentGame.appid]) {
        this.searchWords[this.currentGame.appid] = {
          video: this.currentGame.chineseName,
          text: this.currentGame.chineseName
        }
      }
    },
    refreshData () {
      if (this.introductionType.name === 'video') {
        this.loadBiliData(true)
      } else {
        this.loadArticleData(true)
      }
    },
    openDrawer (e) {
      this.drawerType = e
      this.drawerVisible = true
      if(this.currentGame.appid ==='0'){
        //如果当前没有游戏设置了

      }else{
        if (this.searchData === '') {
          if (this.introductionType.name === 'video') {
            if (this.currentSearchWords.video) {
              this.searchData = this.currentSearchWords.video + ' '
            }
          } else {
            if (this.currentSearchWords.text) {
              this.searchData = this.currentSearchWords.text + ' '
            }
          }
        }
      }

    },
    goBil () {
      browser.openInTable('https://www.bilibili.com/')
    },
    goYm () {
      browser.openInTable('https://www.gamersky.com/')
    },
    // 初始化数据
    async loadBiliData (clear = false) {
      let words = this.encodeBiliWords(this.currentSearchWords.video || this.customSearchWords.searchWords)
      // https://api.bilibili.com/x/web-interface/search/all/v2?page=1&keyword=${encodeURIComponent(this.defaultRunGame.title)}
      const synUrl = `https://search.bilibili.com/all?keyword=${words}&search_source=1`
      // const synUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.defaultRunGame.title)}`
      const now = (Date.now() + '').substr(-8)
      // const url = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.defaultRunGame.title)}&search_source=1&order=${this.defaultSortType.name}`
      const url = `https://search.bilibili.com/all?vt=${now}&keyword=${words}&search_source=1&order=${this.defaultSortType.name}`
      if (this.defaultSortType.name === '') {
        this.dataRequest(synUrl, clear)
      } else {
        this.dataRequest(url, clear)
      }
    },

    searchEnter () {
      this.drawerVisible = false
      this.displayResult=true
      if (this.introductionType.name === 'video') {
        this.searchVideoData()
      } else {
        this.searchArticle()
      }
    },
    async searchArticle () {
      this.loadArticleData(true, this.searchData)
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
    /**
     * 对Bilibili的搜索词进行特殊处理
     * @param words
     * @returns {string}
     */
    encodeBiliWords (words) {
      return encodeURIComponent(words)
        .replaceAll('%20', '+')
        .replaceAll('\'', '%27')
    },
    // 搜索接口
    async searchVideoData () {
      this.gameVideoList = []
      let handledUrl = this.encodeBiliWords(this.searchData)
      const url = `https://search.bilibili.com/all?keyword=${handledUrl}`
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
    async loadArticleData (clear = false, name = '') {
      this.gameIntroductionList = []
      let keywords = name ? name : (this.currentSearchWords.text || this.customSearchWords.searchWords)
      const url = `https://so.gamersky.com/all/handbook?s=${keywords}`
      if (clear) {
        this.gameIntroductionList = []
      }
      axios.get(url).then(res => {
        const html = res.data
        const dom = cheerio.load(html)
        dom('.t2').children().each((i, el) => {
          const href = dom(el).eq(0).attr('href')
          const title = dom(el).eq(0).text()
          this.gameIntroductionList.push({ href, title })
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

    openUrl (url) {
      browser.openInTable(url)
    },
    getVideoCover (url) {
      return fixHttp(url + '@320w_200h')
    },
    selectHotType (e) {
      // this.defaultSearchType.name = e
      this.loadIllustratedData()
    },

    //数据请求
    dataRequest (url, clear = false) {
      if (clear) {
        this.gameVideoList = []
      }

      // console.log('地址',url);

      axios.get(url).then(res => {

        // console.log('请求结果',res);

        try {
          const htmlText = res.data
          // 使用正则表达式匹配 <script> 标签中的 JavaScript 代码
          const regex = /<script.*?>((.|\n)*?)<\/script>/gi
          const matches = htmlText.match(regex)

          // console.log('排查问题::>>',matches[13]);

          const startIndex = matches[13].indexOf('(')
          if (startIndex === -1) {
            this.gameVideoList = []
            return
          }
          const endIndex = matches[13].lastIndexOf(')')
          const jsonString = matches[13].substring(startIndex, endIndex + 1)

          // console.log('排查问题::>>',jsonString);

          // console.log(jsonString,window.eval(jsonString))
          const jsonData = window.eval(jsonString).searchResponse.searchAllResponse
          if (Object.keys(jsonData).length === 0) {
            this.gameVideoList = []
            return
          } else {
            // console.log('获得的jsondata',jsonData)
          }
          const data = jsonData.result[11].data
          data.forEach(el => {
            if (el.title !== '') {
              this.gameVideoList.push(el)
            }
          })

        } catch (e) {
          console.error('搜索意外返回', e)
          this.gameVideoList = []
        }

      })
    },
    doSearch () {

    },
    // 日期转换
    changeTime (newDate) {
      const nowTime = new Date(parseInt(newDate) * 1000)
      return nowTime.toLocaleDateString()
    },
    getPage (e) {
      // console.log('页码',e);
      const url = `https://search.bilibili.com/all?keyword=${encodeURIComponent(this.currentGame.name)}&search_source=3&page=${e}&o=36`
      // const url = `https://api.bilibili.com/x/web-interface/search/all/v2?page=${e}&keyword=${encodeURIComponent(this.defaultRunGame.title)}`
      // console.log(url);
      // axios.get(url).then(res=>{
      //   console.log(res);
      // })
      // console.log(url);
      this.dataRequest(url)
    },
    addGame () {
      this.addVisible = true
    }
  },
}
</script>

<style scoped>
.nav-top-game {
  max-width: 1050px;
}

.my-primary-title {
  font-size: 14px;
  font-weight: 400;
  font-family: PingFangSC;
  color: var(--primary-text);
}

.guide-bg {
  background: var(--primary-bg);
}

.my-secondary-title {
  font-size: 12px;
  font-weight: 400;
  font-family: PingFangSC;
  color: var(--secondary-text);
}

.game-list-item {
  aspect-ratio: 231/200;
  max-width: 340px;
}

@media screen and (max-width: 1226px) {
  .right-nav {
    display: none;
  }
}

@media screen and (max-width: 940px) {
  .game-list-item {
    width: calc(100% / 2);
  }
}

@media screen and (min-width: 940px) and (max-width: 1140px) {
  .game-list-item {
    width: calc(100% / 3);
  }
}

@media screen and (min-width: 1140px) and (max-width: 1340px) {
  .game-list-item {
    width: calc(100% / 4);
  }
}

@media screen and (min-width: 1340px)and (max-width: 1540px) {
  .game-list-item {
    width: calc(100% / 5);
  }
}

@media screen and (min-width: 1540px)and (max-width: 1740px) {
  .game-list-item {
    width: calc(100% / 6);
  }
}

@media screen and (min-width: 1740px)and (max-width: 1940px) {
  .game-list-item {
    width: calc(100% / 7);
  }
}

@media screen and (min-width: 1940px)and (max-width: 2140px) {
  .game-list-item {
    width: calc(100% / 8);
  }
}

@media screen and (min-width: 2140px)and (max-width: 2340px) {
  .game-list-item {
    width: calc(100% / 9);
  }
}

@media screen and (min-width: 2340px)and (max-width: 2540px) {
  .game-list-item {
    width: calc(100% / 10);
  }
}

@media screen and (min-width: 2540px)and (max-width: 2740px) {
  .game-list-item {
    width: calc(100% / 11);
  }
}

@media screen and (min-width: 2740px)and (max-width: 2940px) {
  .game-list-item {
    width: calc(100% / 12);
  }
}

.bfl {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.ant-pagination-options) {
  display: none;
}

/*

.page-ination{
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: rgba(255, 255, 255, 0.6);
}
*/
</style>
