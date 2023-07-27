<template>
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;">
    <div
         class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col"
         style=";width: 600px;height: 80%;background: var(--modal-bg);">
      <div class="head-nav">
        <div>
          <HorizontalPanel :navList="navType" v-model:selectType="selectNav"></HorizontalPanel>
        </div>
        <!-- <span class="ml-2" style="font-size: 16px;color: var(--primary-text);font-weight: 500;">外部小组件</span> -->
        <div @click="close" class="h-11 w-11 flex justify-center items-center xt-bg-2 rounded-lg pointer">
          <Icon icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HorizontalPanel from '../../../components/HorizontalPanel.vue'
  export default{
    components: {
      HorizontalPanel
    },
    data() {
      return {
        navType:[
          {title:'社区分享',name:'share'},
          {title:'我的',name:'my'}
        ],
        selectNav:{title:'社区分享',name:'share'},
        }
    },
    methods: {
      close(){
        this.$router.go(-1)
      }
    },
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
</style>
