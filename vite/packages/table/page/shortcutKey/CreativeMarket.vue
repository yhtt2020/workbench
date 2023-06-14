<template>
  <div class="s-bg rounded-lg px-6" style="height: 720px;">
    <!-- 头部导航 -->
    <div class="flex items-center justify-between" style="height: 96px;">
      <div @click="onBack" class="pointer button-active s-bg w-28 h-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="flex">
        <div class="mr-3">
          <a-input v-model:value="userName" placeholder="搜索应用名称" class="no-drag" style="width:320px;height: 48px;background: rgba(0,0,0,0.30);border-radius: 12px;border: 1px solid rgba(255,255,255,0.1);font-size: 18px;">
            <template #prefix>
              <Icon icon="sousuo" class="mr-2"></Icon>
            </template>
          </a-input>
        </div>
        <div>
          <a-select style="width:134px;height:48px;border: 1px solid rgba(255, 255, 255, 0.1);font-size: 16px;"
          @change="getSort($event)" class="rounded-lg  text-xs s-item flex items-center text-center" size="large" :bordered="false"
          v-model:value="sort">
            <a-select-option v-for="item in sortType" :value="item.value">{{ item.name }}</a-select-option>
          </a-select>
        </div>
        <div class="pointer s-bg flex items-center rounded-lg justify-center ml-3" style="width:134px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">我来分享</div>
      </div>
    </div>
    <div class="flex">
      <!-- 侧边导航 -->
      <div class="left" style="width:112px;">
        <div class="nav" style="color:var(--primary-text)" :class="{ 'active': navIndex == index }" @click="updateNavIndex(index)"
            v-for="( item, index ) in  marketList" :key="item.name">{{
            item.cname
          }}
        </div>
      </div>
      <!-- 列表内容 -->
      <div class="ml-5">
        <!-- <router-view></router-view> -->
        <MarketList :search="sort" :navList="marketList[navIndex].children"></MarketList>
      </div>
    </div>
  </div>
</template>

<script>
import MarketList from './MarketList.vue'
export default {
  name: "CreativeMarket",
  components: {
    MarketList
  },
  data() {
    return {
      tab: '',
      gallery: false,
      select: 0,
      navIndex: 0,
      sort: '综合排序',
      sortType: [
        { value: '综合排序', name: '综合排序' },
        { value: '下载次数', name: '下载次数' },
        { value: '更新时间', name: '更新时间' },
      ],
      marketList: [
        {
          cname: '推荐',
          children: [
            {   
              id: 1,
              icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 39,
              key: '快捷键',
              time: 1686462400000
            },
            {   
              id: 2,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26ety个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 232,
              key: '快捷键',
              time: 1685462400012
            },
            {   
              id: 3,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
        {
          cname: '游戏',
          children: [
            {   
              id: 4,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor111 Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 5,
              icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 6,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
        {
          cname: '效率',
          children: [
            {   
              id: 7,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 8,
              icon: '',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 9,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
        {
          cname: '办公',
          children: [
            {   
              id: 10,
              icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 39,
              key: '快捷键',
              time: 1686462400000
            },
            {   
              id: 11,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26ety个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 232,
              key: '快捷键',
              time: 1685462400012
            },
            {   
              id: 12,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
        {
          cname: '系统',
          children: [
            {   
              id: 13,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor111 Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 14,
              icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 15,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
        {
          cname: '娱乐',
          children: [
            {   
              id: 16,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 17,
              icon: '',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 18,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
        {
          cname: '其他',
          children: [
            {   
              id: 19,
              icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 39,
              key: '快捷键',
              time: 1686462400000
            },
            {   
              id: 20,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26ety个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 232,
              key: '快捷键',
              time: 1685462400012
            },
            {   
              id: 21,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
        {
          cname: '我的分享',
          children: [
            {   
              id: 22,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor111 Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 23,
              icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
            {   
              id: 24,
              icon: 'http://a.apps.vip/icons/flappy.jpg',
              name: 'Adobe Lightroom',
              number: 92,
              commonUse: 'Lr常用26个快捷键',
              avatar: '',
              userName: 'Victor Ruiz',
              sumLikes: 12334,
              download: 1232,
              key: '快捷键',
              time: 1685462400000
            },
          ]
        },
      ]
    }
  },
  methods: {
    changeTab(args) {
      // this.$router.push(args.menu.route)
      this.tab = args.index
    },
    goHome() {
      // this.$router.push({
      //   name: 'home'
      // })
    },
    getSort(e){
      // console.log(e)
    },
    onBack(){
      this.$router.go(-1)
    },
    updateNavIndex(index){
      this.navIndex = index
    }
  },
  mounted(){
    // this.$router.push({name: 'marketList'})
  }
}
</script>
<style lang="scss" scoped>
  .s-bg{
    box-shadow: none !important;
  }
  .left {
      height: 100%;
      width: 140px;
      overflow: auto;
      padding-bottom: 40px;

      .nav {
        width: 112px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

      }

      .active {
        background: rgba(0, 0, 0, 0.30);

      }
    }
</style>
