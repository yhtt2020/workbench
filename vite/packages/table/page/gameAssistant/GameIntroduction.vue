<template>
<div class="flex flex-row items-center justify-between nav-top-game" style="margin-left: 1em">
  <div class="flex flex-row">
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
            class="w-60 h-12 rounded-lg  text-xs s-bg" size="large" :bordered="false" >
  </a-select>
  <HorizontalPanel class="ml-3" :navList="introductionSubList" v-model:selectType="introductionType"></HorizontalPanel>
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
            class="w-60 h-12 mx-3 rounded-lg s-bg text-xs" size="large" :bordered="false" >
  </a-select>
  </div>
  <div class="flex flex-row">
    <div @click="openDrawer('search')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
    <div @click="openDrawer('tip')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="tishi-xianxing"></Icon></div>
  </div>
</div>
  <div v-if="introductionType.name==='video'"></div>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em);margin-left: 1em" class="mt-3"  v-else>
  <div>
    <div v-for="item in gameIntroductionList" class="s-bg w-full h-14 mb-3 rounded-xl nav-top-game flex flex-row items-center px-4">
      <div class="round-dot mr-4"></div>
      <div>{{item.title}}</div>
      <div class="ml-auto">{{item.date}}</div>
    </div>
  </div>
  </vue-custom-scrollbar>
  <a-drawer :width="500"  v-model:visible="drawerVisible" placement="right">
    <template #title>
      <div class="text-center" v-if="drawerType==='search'">搜索</div>
      <div class="text-center" v-else>说明</div>
    </template>
    <a-input v-model:value="searchData" class="no-drag h-10 w-full" placeholder="搜索"  style="
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
      introductionSubList:[{title:'视频攻略',name:'video'},{title:'图文攻略',name:'textImg'}],
      gameIntroductionList:[{title:'视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'}]
    }
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
    }
  }
}
</script>

<style scoped>
.nav-top-game{
  max-width: 1050px;
}
</style>
