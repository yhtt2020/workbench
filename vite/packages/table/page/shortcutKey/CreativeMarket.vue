<template>
  <div class="s-bg rounded-lg px-6 box">
    <!-- 头部导航 -->
    <div class="flex items-center justify-between" style="height: 96px;">
      <div @click="onBack" class="pointer flex items-center rounded-lg justify-center" 
        style="background: rgba(0, 0, 0, 0.30);width:112px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">
        <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="flex">
        <!-- 头部搜索和下拉列表 -->
        <Search 
          :searchValue="inputSearchValue"
          :defaultSelect="sort"
          :sortType="sortType"
          :isFiltrate="true"
          @changeSelect="changeSelect"
          @changeInput="changeInput"
        />
        <!-- 分享 -->
        <div class="pointer s-bg flex items-center rounded-lg justify-center ml-3" 
        style="width:134px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);"
        @click="share">我来分享</div>
      </div>
    </div>
    <div class="flex" style="height: 90%;">
      <!-- 侧边导航 -->
      <NavMenu :list="marketList" :currenIndex="navIndex" @changeNav="updateNavIndex" />
      <!-- 列表内容 -->
      <div class="ml-5 right no-drag" style="width:100%;height:90%;overflow: auto;">
        <MarketList :selected="sort" :navList="marketList[navIndex].children"></MarketList>
      </div>
    </div>
  </div>
</template>

<script>
import MarketList from './MarketList.vue'
import Search from '../../components/Search.vue'
import NavMenu from '../../components/NavMenu.vue'
import { mapActions, mapWritableState } from "pinia";
import { keyStore } from '../../store/key'
export default {
  name: "CreativeMarket",
  components: {
    MarketList,
    Search,
    NavMenu
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
      // marketList: [
      //   {
      //     cname: '推荐',
      //     children: [
      //       {   
      //         id: 1,
      //         icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 39,
      //         key: '快捷键',
      //         time: 1686462400000,
      //         keyList: [
      //           {
      //             groupName: '常用',
      //             id: 1,
      //           },
      //           {
      //             id: 2,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '首选项',
      //           },
      //           {
      //             id: 3,
      //             keys: [
      //               {icon: 'linechart'},
      //               {icon: 'linechart'},
      //               {key: 'Q'}
      //             ],
      //             title: '清除浏览器数据',
      //           },
      //           {
      //             id: 4,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '隐藏 Microsoft Edge'
      //           },
      //           {
      //             id: 5,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '隐藏 Microsoft Edge'
      //           },
      //           {
      //             groupName: '文件',
      //             id: 6,
      //           },
      //           {
      //             id: 7,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '首选项',
      //           },
      //           {
      //             id: 8,
      //             keys: [
      //               {icon: 'linechart'},
      //               {icon: 'linechart'},
      //               {key: 'Q'}
      //             ],
      //             title: '清除浏览器数据',
      //           },
      //           {
      //             id: 9,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '隐藏 Microsoft Edge'
      //           },
      //           {
      //             id: 10,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '隐藏 Microsoft Edge'
      //           },
      //           {
      //             id: 11,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '娄山关路'
      //           },
      //           {
      //             id: 12,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '阿里的第三个的'
      //           },
      //           {
      //             groupName: '文件',
      //             id: 13,
      //           },
      //           {
      //             id: 14,
      //             keys: [
      //               {icon: 'linechart'},
      //               {key: 'H'}
      //             ],
      //             title: '首选项',
      //           },
      //           {
      //             id: 15,
      //             keys: [
      //               {icon: 'linechart'},
      //               {icon: 'linechart'},
      //               {key: 'Q'}
      //             ],
      //             title: '清除浏览器数据',
      //           },
      //         ]
      //       },
      //       {   
      //         id: 2,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26ety个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 232,
      //         key: '快捷键',
      //         time: 1685462400012
      //       },
      //       {   
      //         id: 3,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 19,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 20,
      //         icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      //   {
      //     cname: '游戏',
      //     children: [
      //       {   
      //         id: 4,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor111 Ruiz',
      //         sumLikes: 12334,
      //         download: 32,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 5,
      //         icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400050
      //       },
      //       {   
      //         id: 6,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      //   {
      //     cname: '效率',
      //     children: [
      //       {   
      //         id: 7,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 8,
      //         icon: '',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 9,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      //   {
      //     cname: '办公',
      //     children: [
      //       {   
      //         id: 10,
      //         icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 39,
      //         key: '快捷键',
      //         time: 1686462400000
      //       },
      //       {   
      //         id: 11,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26ety个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 232,
      //         key: '快捷键',
      //         time: 1685462400012
      //       },
      //       {   
      //         id: 12,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      //   {
      //     cname: '系统',
      //     children: [
      //       {   
      //         id: 13,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor111 Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 14,
      //         icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 15,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      //   {
      //     cname: '娱乐',
      //     children: [
      //       {   
      //         id: 16,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 17,
      //         icon: '',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 18,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      //   {
      //     cname: '其他',
      //     children: [
      //       {   
      //         id: 19,
      //         icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 39,
      //         key: '快捷键',
      //         time: 1686462400000
      //       },
      //       {   
      //         id: 20,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26ety个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 232,
      //         key: '快捷键',
      //         time: 1685462400012
      //       },
      //       {   
      //         id: 21,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      //   {
      //     cname: '我的分享',
      //     children: [
      //       {   
      //         id: 22,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor111 Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 23,
      //         icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //       {   
      //         id: 24,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //         key: '快捷键',
      //         time: 1685462400000
      //       },
      //     ]
      //   },
      // ],
      inputSearchValue: ''
    }
  },
  computed: {
    ...mapWritableState(keyStore, ['marketList']),
  },
  methods: {
    changeTab(args) {
      this.tab = args.index
    },
    onBack(){
      this.$router.go(-1)
    },
    updateNavIndex({index}){
      this.navIndex = index
    },
    //跳转到分享页
    share(){
      this.$router.push({name: 'shareKey'})
    },
    changeSelect(event){
      // console.log('选择下拉',event)
      this.sort = event
    },
    changeInput(event){
      // console.log('输入框',event)
    },
  },
  mounted(){
    // this.$router.push({name: 'marketList'})
  },
}
</script>
<style lang="scss" scoped>
  .s-bg{
    box-shadow: none !important;
  }
  .box{
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .left {
      height: 95%;
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
        margin-bottom:12px;
        font-size: 16px;
      }

      .active {
        background: rgba(0, 0, 0, 0.30);

      }
    }
    .left::-webkit-scrollbar,
    .right::-webkit-scrollbar {
      display: none;
    }
</style>
