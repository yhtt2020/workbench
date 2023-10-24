<template>
  <!-- 游戏攻略组件 -->
  <Widget :options="options" :customData="customData" :customIndex="customIndex" :desk="desk">
    <!-- 游戏名称 -->
    <div class="px-3 py-1 rounded-lg game-name pointer" @click="openGuideDrawer">
      游戏攻略- {{ customData.chineseName }}
    </div>
    <!--按钮操作设置 -->
    <div class="w-full flex mt-3.5 mb-3">
      <HorizontalPanel style="width: 376px;height: 44px;" :navList="strategyType" v-model:selectType="defaultStrategy">
      </HorizontalPanel>
      <div @click="openSearch"
        class="flex items-center justify-center mx-3 rounded-lg w-11 h-11 button-active search-button">
        <Icon icon="sousuo" style="font-size: 1.24em;"></Icon>
      </div>
      <div class="flex">
        <a-button type="primary" :disabled="isPrevAble" @click="prevButton" class="mr-3 rounded-lg h-11 w-11"
          :size="size">
          <template #icon>
            <LeftOutlined style="font-size: 1.5em;color: var(--active-text);" />
          </template>
        </a-button>
        <a-button type="primary" :disabled="isNextAble" @click="nextButton" class="rounded-lg h-11 w-11" :size="size">
          <template #icon>
            <RightOutlined style="font-size: 1.5em;color: var(--active-text);" />
          </template>
        </a-button>
      </div>
    </div>

    <!-- 游戏攻略内容显示 -->
    <template v-if="defaultStrategy.name === 'video'">
      <!-- 数据空状态 -->
      <div v-if="videoList.length === 0" class="flex items-center justify-center w-full my-14">
        <a-empty :image="simpleImage" description="从工作台中启动游戏来查看相关攻略" />
      </div>

      <!-- 视频攻略显示列表区域 -->
      <div v-else class="flex flex-wrap justify-center">
        <div v-for="item in videoList" class="video-item mr-2.5 mb-2 flex flex-col pointer" @click="openUrl(item.arcurl)">
          <div style="height:105px;" class="pb-1">
            <img :src="`${getVideoCover(item.pic)}`" class="object-cover w-full h-full rounded-lg" alt="">
          </div>
          <div class="container">
            <p class="text-clamp">
              {{ item.title.replace( /<em[^>]*>/g, '').replace(/<\/em>/g, '')}}
            </p>
          </div>
        </div>
      </div>

    </template>

    <template v-else>
      <!-- 数据空状态 -->
      <div v-if="graphicList.length === 0" class="flex items-center justify-center w-full my-14">
        <a-empty :image="simpleImage" description="从工作台中启动游戏来查看相关攻略" />
      </div>

      <div v-else-if="textList.length === 0" class="flex items-center justify-center w-full my-14">
        <a-empty :image="simpleImage" description="找不到相关游戏攻略" />
      </div>

      <!-- 图文攻略列表区域 -->
      <div v-else class="w-full h-full">
        <div v-for="item in textList" @click="openUrl(item.href)"
          class="flex items-center p-3 mb-4 rounded-lg pointer text-item-bg">
          <div class="flex-shrink-0 mr-4 round-dot"></div>
          <div class="inline-block text-more" style="color: var(--primary-text);">{{ item.title }}</div>
          <div class="flex-shrink-0 ml-auto" style="color: var(--secondary-text);">{{ item.date }}</div>
        </div>
      </div>
    </template>
  </Widget>

  <HorizontalDrawer ref="strategyDrawer" :drawerTitle="strategyTitle" v-model:selectRegion="customData.id"
    :rightSelect="recentGameList" @getArea="getArea"></HorizontalDrawer>

  <a-drawer v-model:visible="searchShow" title="搜索" width="500" placement="right">
    <div class="line">
      <a-input class="w-full h-10 no-drag" placeholder="搜索" spellcheck="false" v-model:value="searchWord"
        style="border-radius: 12px;background: var(--primary-bg); color:var(--primary-text);" @pressEnter="searchEnter">
        <template #prefix>
          <Icon icon="sousuo"></Icon>
        </template>
      </a-input>
    </div>
  </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue';
import HorizontalPanel from '../../HorizontalPanel.vue';
import HorizontalDrawer from '../../HorizontalDrawer.vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { mapActions, mapWritableState } from 'pinia';
import { steamUserStore } from '../../../store/steamUser';
import _, { result } from 'lodash-es'
import axios from 'axios';
import cheerio from 'cheerio';
import { fixHttp } from '../../../util';
import browser from '../../../js/common/browser';

export default {
  name: 'GameStrategy',
  components: { Widget, HorizontalPanel, HorizontalDrawer, LeftOutlined, RightOutlined },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => { }
    },
    confirmCCData: {
      type: Function,
      default: () => { }
    },
    desk: {
      type: Object
    }
  },
  data() {
    return {
      options: {
        className: 'card double',
        title: '',
        icon: 'trophy',
        type: 'strategy',
      },
      strategyType: [
        { title: '视频攻略', name: 'video' },
        { title: '图文攻略', name: 'image-text' }
      ],
      defaultStrategy: { title: '视频攻略', name: 'video' },
      searchShow: false,
      strategyTitle: '游戏名称',
      bilVideoList: [], // 接收B站视频数据
      graphicList: [], // 接收图文攻略数据
      simpleImage: '/public/img/test/not-data.png',// 空状态数据
      searchWord: this.customData.chineseName, // 搜索关键词
      defaultIndex: 0,  //默认第一页数据
      isPrevAble: true,  // 禁用上一个按钮
      isNextAble: false, // 禁用下一个按钮
      videoList: [], // 获取分割后的数据
      textList: [], // 获取分割后的图文攻略
    }
  },
  watch: {
    'defaultStrategy': {
      handler() {
        this.refreshStrategy()
      },
    },
  },
  computed: {
    ...mapWritableState(steamUserStore, ['recentGameList']),
    // 计算小组件视频数据分页最大值
    maxArrIndex() {
      if (this.bilVideoList) {
        const itemIndex = _.chunk(this.bilVideoList, 6)
        return itemIndex
      }
    },
    // 计算图文数据分页最大
    maxImageIndex() {
      if (this.graphicList) {
        const item = _.chunk(this.graphicList, 5)
        return item
      }
    }

  },
  mounted() {
    if (Object.keys(this.customData).length === 0) {
      this.customData.name = this.recentGameList[0]?.chineseName
      this.customData.id = this.recentGameList[0]?.appid
      this.customData.chineseName = this.recentGameList[0]?.chineseName
    } else {
      this.getBiliVideoData()
      this.getGraphicGuideData()
    }
  },
  methods: {
    // 打开右侧抽屉进行游戏名称切换
    openGuideDrawer() {
      this.$refs.strategyDrawer.openDrawer()
    },
    openSearch() {
      this.searchShow = true
    },
    getArea(v) {
      this.customData.name = v.chineseName
      this.customData.id = v.appid
      this.customData.chineseName = v.chineseName
      this.getBiliVideoData()
      this.getGraphicGuideData()
    },
    // 切换刷新
    refreshStrategy() {
      if (this.defaultStrategy.name === 'video') {
        this.getBiliVideoData()
      } else {
        this.getGraphicGuideData()
      }
    },

    /**
     * 对Bilibili的搜索词进行特殊处理
     * @param words
     * @returns {string}
     */
    encodeBiliWords(words) {
      return encodeURIComponent(words)
        .replaceAll('%20', '+')
        .replaceAll("'", '%27')
    },

    // 搜索回调事件
    searchEnter() {
      this.searchShow = false
      if (this.defaultStrategy.name === 'video') {
        this.searchVideoData()
      } else {
        this.getGraphicGuideData()
      }
    },

    // 搜索接口
    async searchVideoData() {
      this.gameVideoList = []
      let handledUrl = this.encodeBiliWords(this.searchWord)
      const url = `https://search.bilibili.com/all?keyword=${handledUrl}`
      this.strategyRequest(url)
    },


    // 获取B站视频攻略数据
    async getBiliVideoData() {
      const words = this.customData.chineseName
      const now = (Date.now() + '').substr(-8)
      const url = `https://search.bilibili.com/all?vt=${now}&keyword=${words}&search_source=1`
      this.strategyRequest(url)
    },

    // 获取图文攻略数据
    async getGraphicGuideData() {
      const words = encodeURIComponent(this.customData.chineseName)
      const url = `https://so.gamersky.com/all/handbook?s=${words}`
      this.imageTextRequest(url)
    },

    // 视频数据请求
    strategyRequest(url, clear = false) {
      if (clear) {
        this.bilVideoList = []
      }
      axios.get(url).then(result => {
        try {
          const htmlText = result.data
          // 使用正则表达式匹配 <script> 标签中的 JavaScript 代码
          const regex = /<script.*?>((.|\n)*?)<\/script>/gi;
          const matches = htmlText.match(regex)[12];
          const startIndex = matches.indexOf('(');
          if (startIndex === -1) {
            this.bilVideoList = []
            return
          }
          const endIndex = matches.lastIndexOf(')');
          const jsonString = matches.substring(startIndex, endIndex + 1);
          const jsonData = window.eval(jsonString).index.searchAllResponse
          if (Object.keys(jsonData).length === 0) {
            this.bilVideoList = []
            return
          }
          const data = jsonData.result[11].data
          this.bilVideoList = data
          this.videoList = this.maxArrIndex[0] // 初始化默认显示数据
        } catch (e) {
          console.error('搜索意外返回', e)
          this.bilVideoList = []
        }
      })
    },

    // 图文攻略数据请求
    imageTextRequest(url, clear = false) {
      axios.get(url).then(res => {
        if (clear) {
          this.graphicList = []
        }
        const html = res.data
        const dom = cheerio.load(html)
        dom('.t2').children().each((i, el) => {
          const href = dom(el).eq(0).attr('href')
          const title = dom(el).eq(0).text()
          this.graphicList.push({ href, title })
        })
        this.textList = this.maxImageIndex[0]
      })
    },

    // 上一个分页按钮回调事件
    prevButton() {
      this.videoList = []
      this.textList = []
      this.defaultIndex--
      this.isNextAble = false   // 将下一个禁用的按钮打开
      if (this.defaultIndex > 0) {
        this.videoList = this.maxArrIndex[this.defaultIndex]
        this.textList = this.maxImageIndex[this.defaultIndex]
      } else {
        this.isPrevAble = true
        this.videoList = this.maxArrIndex[0]
        this.textList = this.maxImageIndex[0]
      }
    },
    // 下一个分页按钮回调事件
    nextButton() {
      this.videoList = []  // 替换新数据
      this.textList = []
      this.isPrevAble = false // 将上一个禁用的按钮打开
      this.defaultIndex++
      if (this.defaultIndex >= this.maxArrIndex.length) { // 判断定义的下标是否大于总数据列表最大值
        this.isNextAble = true
        this.videoList = this.maxArrIndex[this.maxArrIndex.length - 1] // 将数据最后一组进行显示
      } else {
        this.videoList = this.maxArrIndex[this.defaultIndex] // 根据每6条数据分割出来的下标获取数据
      }
      if (this.defaultIndex >= this.maxImageIndex.length) {
        this.isNextAble = true
        this.textList = this.maxImageIndex[this.maxImageIndex.length - 1] // 将数据最后一组进行显示
      } else {
        this.textList = this.maxImageIndex[this.defaultIndex] // 根据每6条数据分割出来的下标获取数据
      }
    },

    getVideoCover(url) {
      return fixHttp(url + '@320w_200h')
    },
    openUrl(url) {
      browser.openInTable(url)
    },
  }

}
</script>

<style lang="scss" scoped>
.container {
  width: 170px;
}

.text-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;

  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}

.game-name {
  position: absolute;
  left: 45px;
  top: 10px;
  background: var(--primary-bg);
}

:deep(.nav-item) {
  width: 50% !important;
}

.search-button {
  color: var(--primary-text);
  background: var(--secondary-bg);
  cursor: pointer;
}

.button-active {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.8;
  }
}

.video-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.video-item {
  width: 170px;
}

.text-item-bg {
  background: var(--primary-bg);
}
</style>
