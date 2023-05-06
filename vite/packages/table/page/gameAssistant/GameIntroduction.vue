<template>
<div class="flex flex-row items-center justify-between nav-top-game">
  <div class="flex flex-row">
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
            class="w-60 h-12 rounded-lg  text-xs s-bg" size="large" :bordered="false" >
  </a-select>
  <HorizontalPanel class="ml-3" :navList="introductionSubList" v-model:selectType="gameType"></HorizontalPanel>
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
            class="w-60 h-12 mx-3 rounded-lg s-bg text-xs" size="large" :bordered="false" >
  </a-select>
  </div>
  <div class="flex flex-row">
    <div @click="openDrawer" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
    <div @click="openModal" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="tianjia2"></Icon></div>
  </div>
</div>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em)" class="mt-3">
  <div>
    <div v-for="item in gameIntroductionList" class="s-bg w-full h-14 mb-3 rounded-xl nav-top-game"></div>
  </div>
  </vue-custom-scrollbar>
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
      introductionSubList:[{title:'视频攻略',name:'video'},{title:'图文攻略',name:'textImg'}],
      gameIntroductionList:[{title:'视频攻略'},{title:'视频攻略'},{title:'视频攻略'},{title:'视频攻略'},{title:'视频攻略'},{title:'视频攻略'}]
    }
  }
}
</script>

<style scoped>
.nav-top-game{
  max-width: 1050px;
}
</style>
