<template>
  <div class="flex flex-row justify-between items-center">
    <div class="flex flex-row">
      <HorizontalPanel :navList="gameNavList"></HorizontalPanel>
      <HorizontalPanel :navList="sortList" class="ml-3"></HorizontalPanel>
    </div>
    <div class="flex flex-row">
      <div class="s-bg pointer h-12 w-12 rounded-xl flex justify-center items-center"><Icon style="" icon="steam"></Icon></div>
      <div class="s-bg pointer h-12 w-12 rounded-xl flex justify-center items-center ml-3"><Icon style="" icon="steam"></Icon></div>
    </div>

  </div>

</template>

<script>
import HorizontalPanel from "../../components/HorizontalPanel.vue";
export default {
  name: "MyGame",
  components:{
    HorizontalPanel
  },
  data(){
    return {
      gameNavList:[{title:'Steam游戏'},{title:'其他游戏'}],
      sortList:[{title:'最近游玩'},{title:'A-Z'}]
    }
  }
}
</script>

<style scoped>

</style>
