<template>
  <div class="flex flex-row">
<!--    <div class="w-40 mr-6">-->
<!--      <div v-for="(item,index) in navList" class="pointer h-14  flex justify-center items-center mb-2 rounded-xl s-icon" :class="activeIndex===index?'s-bg':''" @click="clickNav(item,index)">-->
<!--        <Icon v-if="item.icon" :icon="item.icon"></Icon>-->
<!--        <span style="margin-left: 0.5em;" class="s-text text-base">{{ item.title }}</span>-->
<!--      </div>-->
<!--    </div>-->
    <SecondPanel :search="true" :goHome="goHome" :menus="menus" :gallery="gallery" style="padding: 1em; text-align: left; "  @changeTab="changeTab"></SecondPanel>
    <div class=" mt-3" style="padding-top: 1em">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SecondPanel from "../../components/SecondPanel.vue";
export default {
  name: "gameAssistant",
  components:{
    SecondPanel
  },
  data(){
    return {
      gallery:false,
      menus: [
        {
          index: 'm',
          title: '游戏助手',
          icon:'game',
          route:
            {
              name: 'gameIndex'
            }
        },
        {
          index: 'm',
          title: '我的游戏',
          icon:'game',
          route:
            {
              name: 'myGame'
            }
        },
        {
          index: 'm',
          title: '游戏攻略',
          icon:'game',
          route:
            {
              name: 'gameIntroduction'
            }
        },
        {
          index: 'm',
          title: '折扣推荐',
          icon:'game',
          route:
            {
              name: 'gameDiscount'
            }
        },
        {
          index: 'm',
          title: '社区',
          icon:'game',
          route:
            {
              name: 'gameCommunity'
            }
        },   {
          index: 'm',
          title: '设置',
          icon:'game',
          route:
            {
              name: 'gameSetting'
            }
        },
      ],
    }
  },
  methods:{
    changeTab (args) {
      this.$router.push(args.menu.route)
      this.tab = args.index
    },
    goHome(){
      this.$router.push({
        name:'home'
      })
    }
  }
}
</script>

<style scoped>

</style>
