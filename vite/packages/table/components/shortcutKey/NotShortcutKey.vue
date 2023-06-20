<template>
    <div class="box">
      <!-- 头部快捷软件
      <div class="flex items-center mb-3" v-if="detailJump">
        <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
          <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
        </div>
        <div class="head-item">
          <span>
            <a-avatar shape="square" :src="appMessage.icon" :size="38"></a-avatar>
          </span>
          <span class="ml-2" style="font-size: 16px;color: rgba(255,255,255,0.85);">{{ appMessage.name }}</span>
        </div>
      </div> -->
      <!-- 无内容 -->
      <div class="container rounded-lg flex flex-col items-center"
      :style="detailJump ? 'height: 90%;' : 'height: 100%;'">
        <div class="mt-11">
          <div class="flex items-center justify-center">
            <a-empty image="/img/test/load-ail.png" description="暂无可用快捷键方案" />
          </div>
        </div>
        <div class="btn-item flex justify-center">
          <div class="pointer" @click="market">浏览创意市场</div>
          <div class="pointer" @click="share">我来分享</div>
        </div>
        <div class="item-content" :style="detailJump ? 'margin-top:65px;' : 'margin-top:22px;'">
          <div v-for="item in notAppList" :key="item.id" class="pointer recommend">
            <div class="flex justify-between">
                <div class="flex">
                  <span class="h-14 w-14 flex justify-center items-center">
                    <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
                  </span>
                  <span class="flex flex-col ml-4">
                    <span style="font-size: 18px;color: rgba(255,255,255,0.85);font-weight: 500;">{{ item.name }}</span>
                    <span class="mt-1" style="font-size: 16px;color: rgba(255,255,255,0.60);">{{ item.commonUse }}</span>
                  </span>
                </div>
                <div class="flex flex-col justify-center items-center w-16 h-16 s-bg rounded-lg">
                  <span style="font-family: Oswald-SemiBold;font-size: 24px;color: rgba(255,255,255,0.85);font-weight: 600;">{{ item.number }}</span>
                  <span>快捷键</span>
                </div>
            </div>
            <div class="flex justify-between items-center mt-4" style="font-size: 14px;color: rgba(255,255,255,0.60);">
              <span class="flex items-center">
                <div @click="showCard(item.id)">
                  <a-avatar size="24">
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                </div>
                <span class="ml-3">{{ item.userName }}</span>
              </span>
              <span>
                <span>
                  <Icon icon="dianzan" class="mr-2"></Icon>
                  <span>{{ item.sumLikes }}</span>
                </span>
                <span class="ml-3">
                  <Icon icon="xiazai" class="mr-2"></Icon>
                  <span>{{ item.download }}</span>
                </span>
              </span>
            </div>
          </div>
          <div class="recommend" style="height:1px;opacity:0;"></div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import { appStore } from '../../store';
export default {
  name: "NotShortcutKey",
  components: {
  },
  props: {
    detailJump: {
      type: Boolean,
      default: false
    },
    appMessage: {
      type: Object,
      default: {}
    },
    notDownloadList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      notAppList :[]
    }
  },
  methods: {
    ...mapActions(appStore,['showUserCard']),
    showCard(id){
      this.showUserCard(id)
    },
    //跳转到分享页
    share(){
      this.$router.push({name: 'shareKey'})
    },
    // 跳转到创意市场
    market(){
      this.$router.push({name: 'creativeMarket'})
    },
    // 返回
    onBack(){
      this.$router.go(-1)
    }
  },
  mounted(){
    console.log()
    if(this.detailJump) {
      this.notAppList = this.notDownloadList.slice(0,3)
    }else{
      this.notAppList = this.notDownloadList
    }
  },
}
</script>
<style lang="scss" scoped>
  .box{
    height: 98%;
    width: 98%;
  }
  .head-item{
    margin-right: 12px;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 12px;
    min-width: 80px;
    white-space: nowrap;
  }
  .container{
    margin: 0 auto 12px;
    padding: 16px 0;
    // height: 100%;
    width: 100%;
    background: var(--primary-bg);
    overflow: hidden;
  }
  .item-content{
    width: 100%;
    height: 80%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    padding-bottom: 40px;
    justify-content: center;
  }
  .item-content::-webkit-scrollbar{
      display: none;
  }
  .recommend{
    background: rgba(0,0,0,0.30);
    border-radius: 12px;
    width: 356px;
    height: 136px;
    margin: 0 8px 16px;
    padding: 12px;
  }
  .s-bg{
    box-shadow: none !important;
  }
  .btn-item{
    display: flex;
    >div{
      background: var(--primary-bg);
      width: 160px;
      text-align: center;
      height: 48px;
      line-height: 48px;
      margin: 0 7px;
      border-radius: 12px;
    }
    >span{
      background: var(--primary-bg);
      border-radius: 12px;
      width: 48px;
      height: 48px;
      line-height: 54px;
      text-align: center;
    }
  }
  .button-active{
    &:active{
      filter: brightness(0.8);
      background: rgba(42, 42, 42, 0.25);
    }
    &:hover{
      background: rgba(42, 42, 42, 0.25);
    }
  }
</style>
