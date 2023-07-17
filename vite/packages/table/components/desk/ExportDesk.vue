<template>
  <!-- 导出模态框 -->
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="openModal" >
    <div
         class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col justify-evenly items-center"
         style="padding: 24px 32px;width: 480px;height: 221px;background:  #282828">
      <div>
        <Icon icon="yiwancheng" style="color:#52C41A;font-size:20px"></Icon>
        <span class="ml-2" style="font-size: 18px;color: var(--primary-text);font-weight: 500;">分享成功</span>
      </div>
      <div style="font-size: 16px;margin:24px 0;color: var(--secondary-text);">
        「 {{ shareName }} 」成功分享至创意市场，选择分享到元社区让更多人看到吧～
      </div>
      <div class="flex">
        <div style="width: 160px;height: 48px;"
          @click="openDrawer"
           class="flex justify-center items-center bg-blue-500 rounded-lg pointer">
        同时分享到元社区
        </div>
        <div style="width: 160px;height: 48px;"
            class=" ml-3 flex justify-center items-center xt-text xt-bg-2 rounded-lg pointer" @click="close">
          完成
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExportDesk",
  components: {
  },
  data() {
    return {
      release: false,
    }  
  },
  props: {
    openModal: {
      type: Boolean,
      default: () => false
    },
    shareName: {
      type: String,
      default: () => ''
    },
    back: {
      type: Boolean,
      default: () => false
    }
  },
  
  methods: {
    close(){
      this.$emit('closeShare',false)
      if(this.back){
        this.$router.go(-1)
      }
    },
    openDrawer(){
      this.$emit('closeShare',false)
      this.release = true
    },
  },
}
</script>

<style lang="scss" scoped>
  .add-scheme{
    background: var(--secondary-bg);
    border-radius: 12px;
    width: 80px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .drawer-center{
    .title{
      font-size: 16px;
      color: var(--primary-text);
      font-weight: 500;
    }
    .trend-content{
      background: var(--secondary-bg);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      height:100px;
    }
    .drawer-img{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0;
      .btnCopy{
        background: var(--secondary-bg);
        border-radius: 12px;
        width: 128px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
</style>
