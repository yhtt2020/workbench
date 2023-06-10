<template>
  <div class="flex flex-row" style="height: 100%">
    <!--    <div class="w-40 mr-6">-->
    <!--      <div v-for="(item,index) in navList" class="pointer h-14  flex justify-center items-center mb-2 rounded-xl s-icon" :class="activeIndex===index?'s-bg':''" @click="clickNav(item,index)">-->
    <!--        <Icon v-if="item.icon" :icon="item.icon"></Icon>-->
    <!--        <span style="margin-left: 0.5em;" class="s-text text-base">{{ item.title }}</span>-->
    <!--      </div>-->
    <!--    </div>-->
    <SecondPanel :search="true" :goHome="goHome" :menus="menus" :gallery="gallery"
      style="padding: 1em 0; text-align: left; " @changeTab="changeTab"></SecondPanel>
    <div class="flex-1  content-view" style="padding-top: 1em;height: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SecondPanel from "../../components/SecondPanel.vue";
export default {
  name: "gameAssistant",
  components: {
    SecondPanel
  },
  data() {
    return {
      gallery: false,
      menus: [
        {
          index: 'm',
          title: '游戏桌面',
          icon: 'desktop',
          route:
          {
            name: 'gameIndex'
          }
        },
        {
          index: 'm',
          title: '我的游戏',
          icon: 'wanggeshitu',
          route:
          {
            name: 'myGame'
          }
        },
        {
          index: 'm',
          title: '游戏攻略',
          icon: 'trophy',
          route:
          {
            name: 'gameIntroduction'
          }
        },
        {
          index: 'm',
          title: '折扣推荐',
          icon: 'star',
          route:
          {
            name: 'recommend'
          }
        },
        {
          index:'z',
          title:'捕获',
          icon:'video',
          route:{
            name:'GameCapture'
          },
        },
        {
          index: 'media',
          title: '高光时刻',
          icon: 'record-circle-line',
          route:
          {
              name: 'gameMedia'
          }
        },
        // {
        //   index: 'm',
        //   title: '社区',
        //   icon:'team',
        //   route:
        //     {
        //       name: 'gameCommunity'
        //     }
        // },
        {
          index: 'm',
          title: '设置',
          icon: 'setting',
          route:
          {
            name: 'gameSetting'
          }
        },
      ],
    }
  },
  methods: {
    changeTab(args) {
      this.$router.push(args.menu.route)
      this.tab = args.index
    },
    goHome() {
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>

<style scoped></style>
