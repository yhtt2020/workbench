<template>
  <div class="flex flex-row justify-between items-center game-page-nav">
    <div class="flex flex-row">
      <HorizontalPanel :navList="gameNavList" v-model:selectType="gameType"></HorizontalPanel>
      <HorizontalPanel :navList="sortList" class="ml-3 main-nav"></HorizontalPanel>
    </div>
    <div class="flex flex-row">
      <div @click="openDrawer" class="s-bg pointer h-12 w-12 rounded-xl flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
      <div @click="openModal" class="s-bg pointer h-12 w-12 rounded-xl flex justify-center items-center ml-3"><Icon style="" icon="tianjia2"></Icon></div>
    </div>

  </div>
  <vue-custom-scrollbar :settings="settingsScroller"
                        style="height: calc(100vh - 15.8em)" class="mt-3">
  <div class="flex flex-row flex-wrap" v-if="gameType.name==='other'">
    <div class="w-56 h-72 s-bg rounded-xl mr-3 mb-3" v-for="item in gameList"></div>
  </div>
  <div class="flex flex-row flex-wrap" v-else>
    <div class="h-72 s-bg rounded-xl mr-3 mb-3" style="width: 460px"></div>
    <div class="w-56 h-72 s-bg rounded-xl mr-3 mb-3" v-for="item in gameList"></div>
  </div>
  </vue-custom-scrollbar>
  <Modal v-model:visibility="modalVisibility" v-show="modalVisibility">
    <div class="p-6">
        <div class="flex flex-row items-center">
          <Icon style="height: 26px;width: 26px" icon="steam"></Icon>
          <div class="flex flex-col ml-4">
            <span class="text-white">导入Steam游戏库</span>
            <span>选择你本地的Steam本地库</span>
          </div>
        </div>
      <div class="flex flex-row mt-4 mb-4">
        <div class="s-item pointer h-12 w-48 rounded-xl flex justify-center items-center">选择游戏库</div>
        <div @click="openModal" class="s-item pointer h-12 w-12 rounded-xl flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>
      </div>
      <div class="flex flex-row items-center">
        <Icon style="height: 26px;width: 26px" icon="game"></Icon>
        <div class="flex flex-col ml-4">
          <span class="text-white">自定义导入其他游戏</span>
          <span>手动选择游戏安装目录</span>
        </div>
      </div>
      <div class="flex flex-row mt-4">
        <div class="s-item pointer h-12 w-48 rounded-xl flex justify-center items-center">选择游戏库</div>
        <div @click="openModal" class="s-item pointer h-12 w-12 rounded-xl flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>
      </div>
    </div>
  </Modal>
  <a-drawer :width="500"  v-model:visible="drawerVisible" placement="right">
    <template #title>
      <div class="text-center">搜索</div>
    </template>
    <div class="hidden select-main-nav">
      <div>排序</div>
      <HorizontalPanel :navList="sortList" class="w-80 mt-3"></HorizontalPanel>
    </div>
  </a-drawer>
</template>

<script>
import HorizontalPanel from "../../components/HorizontalPanel.vue";
import Modal from '../../components/Modal.vue'
export default {
  name: "MyGame",
  components:{
    HorizontalPanel,
    Modal
  },
  data(){
    return {
      drawerVisible:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      gameNavList:[{title:'Steam游戏',name:'steam'},{title:'其他游戏',name:'other'}],
      gameType:{title:'Steam游戏',name:'steam'},
      sortList:[{title:'最近游玩'},{title:'A-Z'}],
      gameList:[{title:'Steam游戏'},{title:'其他游戏'},{title:'其他游戏'},{title:'其他游戏'},{title:'其他游戏'},{title:'其他游戏'},{title:'其他游戏'},{title:'其他游戏'},{title:'其他游戏'}],
      modalVisibility:false
    }
  },
  methods:{
    openModal(){
      this.modalVisibility = true
    },
    openDrawer(){
      this.drawerVisible = true
    }
  }
}
</script>

<style scoped>
@media screen and (max-width:1064px ){
  .main-nav{
    display: none;
  }
  .select-main-nav{
    display: block;
  }
}

</style>
