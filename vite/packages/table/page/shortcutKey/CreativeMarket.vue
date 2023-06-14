<template>
  <div class="s-bg rounded-lg px-6" style="height: 720px;">
    <!-- 头部导航 -->
    <div class="flex items-center justify-between" style="height: 96px;">
      <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="flex">
        <div class="mr-3">
          <a-input v-model:value="userName" :bordered="false" placeholder="搜索应用名称" style="width:320px;height: 48px;background: rgba(0,0,0,0.30);border-radius: 12px;border: 1px solid rgba(255,255,255,0.1);font-size: 18px;">
            <template #prefix>
              <Icon icon="sousuo" class="mr-2"></Icon>
            </template>
          </a-input>
        </div>
        <div>
          <a-select style="width:134px;height:48px;border: 1px solid rgba(255, 255, 255, 0.1);"
          @change="getSort($event)" class="rounded-lg  text-xs s-item" size="large" :bordered="false"
          v-model:value="sort">
            <a-select-option v-for="item in sortType" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </div>
        <div class="pointer s-bg flex items-center rounded-lg justify-center ml-3" style="width:134px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">我来分享</div>
      </div>
    </div>
    <div class="flex flex-row" style="width:112px;height: 100%">
      <SecondPanel :search="true" :goHome="goHome" :menus="menus" :gallery="gallery"
        style="text-align: center;" @changeTab="changeTab"></SecondPanel>
      <div class="flex-1  content-view" style="padding-top: 1em;height: 100%">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SecondPanel from '../../components/SecondPanel.vue'
export default {
  name: "CreativeMarket",
  components: {
    SecondPanel
  },
  data() {
    return {
      tab: '',
      gallery: false,
      select: 0,
      sort: '综合排序',
      sortType: [
        {
          id: '001',
          name: '111'
        },
        {
          id: '002',
          name: '222'
        },
        {
          id: '003',
          name: '333'
        },
      ],
      menus: [
        {
          index: 'tj',
          title: '推荐',
        },
        {
          index: 'y',
          title: '游戏',
          route:
          {
            name: 'myGame'
          }
        },
        {
          index: 'x',
          title: '效率',
          route:
          {
            name: 'gameIntroduction'
          }
        },
        {
          index: 'bg',
          title: '办公',
          route:
          {
            name: 'recommend'
          }
        },
        {
          index: 'xt',
          title:'系统',
          route:{
            name:'GameCapture'
          },
        },
        {
          index: 'yl',
          title: '娱乐',
          route:
          {
              name: 'gameMedia'
          }
        },
        {
          index: 'qt',
          title: '其他',
          route:
            {
              name: 'gameCommunity'
            }
        },
        {
          index: 'fx',
          title: '我的分享',
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
      console.log(args)
      // this.$router.push(args.menu.route)
      this.tab = args.index
    },
    goHome() {
      // this.$router.push({
      //   name: 'home'
      // })
    },
    getSort(e){
      console.log(e)
    },
    onBack(){
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
  .s-bg{
    box-shadow: none !important;
  }
  .second-panel /deep/ .menu[data-v-b2706808]{
    padding: 0 !important;
    width:112px !important;
  }
</style>
