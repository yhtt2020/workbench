<template>
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;">
    <div
         class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col"
         style=";width: 600px;height: 80%;background: var(--modal-bg);">
      <div class="head-nav">
        <div>
          <HorizontalPanel :navList="navType" v-model:selectType="selectNav"></HorizontalPanel>
        </div>
        <div @click="close" class="h-11 w-11 flex justify-center items-center xt-bg-2 rounded-lg pointer">
          <Icon icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
        </div>
      </div>
      <dvi v-if="selectNav.name === 'share'" class="share-list">
        <Market :desk="desk" @closeMarket="close"></Market>
      </dvi>
    </div>
  </div>
</template>

<script>
import Market from '../../../components/card/remote/Market.vue'
import HorizontalPanel from '../../../components/HorizontalPanel.vue'
import { mapActions, mapWritableState } from "pinia";
import { cardStore } from '../../../store/card';
  export default{
    components: {
      HorizontalPanel,
      Market
    },
    data() {
      return {
        navType:[
          {title:'社区分享',name:'share'},
          {title:'我的',name:'my'}
        ],
        selectNav:{title:'社区分享',name:'share'},
        desk: {}
      }
    },
    methods: {
      close(){
        this.$router.go(-1)
      }
    },
    computed: {
      ...mapWritableState(cardStore, ['desks']),
    },
    mounted(){
      let deskId = this.$route.params.id
      this.desk = this.desks.find(item => item.id === deskId)

      let nav = document.getElementById('nav');
      let list = document.getElementById('navList');
      nav.classList.add('suspension-r-nav')
      list.classList.add('list-r-nav')
    }
  }
</script>

<style lang="scss" scoped>
.head-nav{
  width: 100%;
  height: 72px;
  padding: 12px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  >div:nth-child(1){
    width: 240px;
  }
  >div:nth-child(2){
    position: absolute;
    right: 12px;
  }
}
.share-list{
  height: 100%;
  overflow: auto;
}
.share-list::-webkit-scrollbar{
  display: none;
}
</style>
<style lang="scss">
  .suspension-r-nav{
    z-index: 99999;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    padding: 16px 0;
    background: var(--modal-bg);
  }
  .list-r-nav{
    margin-top: 72px;
  }
</style>
