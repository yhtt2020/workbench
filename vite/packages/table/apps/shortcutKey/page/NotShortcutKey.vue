<template>
 <div class="text-center w-full">
   <xt-button class="m-auto" type="theme" @click="goDownload">去下载</xt-button></div>
<!--    <div class="box h-full m-auto mt-10">-->
<!--      &lt;!&ndash; 无内容 &ndash;&gt;-->
<!--      <div class="container rounded-lg flex flex-col items-center"-->
<!--      :style="detailJump ? 'height: 90%;' : 'height: 100%;'">-->
<!--        <div class="mt-11">-->
<!--          <div class="flex items-center justify-center">-->
<!--            <a-empty image="/img/test/load-ail.png" description="暂无可用快捷键方案" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="btn-item flex justify-center">-->
<!--          <div v-if="false" class="pointer" @click="market">浏览创意市场</div>-->
<!--          <div class="pointer" @click="share">创建方案</div>-->
<!--        </div>-->
<!--        <div v-if="false" class="item-content" :style="detailJump ? 'margin-top:65px;' : 'margin-top:22px;'">-->
<!--          <div v-for="item in notAppList" @click="previewKay(item)" :key="item.id" class="pointer recommend">-->
<!--            <div class="flex justify-between">-->
<!--                <div class="flex">-->
<!--                  <span class="h-14 w-14 flex justify-center items-center">-->
<!--                    <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>-->
<!--                  </span>-->
<!--                  <span class="flex flex-col ml-4">-->
<!--                    <span style="font-size: 18px;color: var(&#45;&#45;primary-text);font-weight: 500;">{{ item.name }}</span>-->
<!--                    <span class="mt-1" style="font-size: 16px;color: var(&#45;&#45;secondary-text);">{{ item.commonUse }}</span>-->
<!--                  </span>-->
<!--                </div>-->
<!--                <div class="flex flex-col justify-center items-center w-16 h-16 xt-mask rounded-lg">-->
<!--                  <span style="font-family: Oswald-SemiBold;font-size: 24px;color: var(&#45;&#45;primary-text);font-weight: 600;">{{ item.number }}</span>-->
<!--                  <span class="xt-text-2" style="font-size: 12px">快捷键</span>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="flex justify-between items-center mt-4" style="font-size: 14px;color: var(&#45;&#45;secondary-text);">-->
<!--              <span class="flex items-center">-->
<!--                <div @click="showCard(item.id)">-->
<!--                  <a-avatar size="24">-->
<!--                    <template #icon><UserOutlined /></template>-->
<!--                  </a-avatar>-->
<!--                </div>-->
<!--                <span class="ml-3">{{ item.nickName }}</span>-->
<!--              </span>-->
<!--              <span>-->
<!--                <span>-->
<!--                  <Icon icon="dianzan" class="mr-2"></Icon>-->
<!--                  <span>{{ item.sumLikes }}</span>-->
<!--                </span>-->
<!--                <span class="ml-3">-->
<!--                  <Icon icon="xiazai" class="mr-2"></Icon>-->
<!--                  <span>{{ item.download }}</span>-->
<!--                </span>-->
<!--              </span>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div v-if="notAppList.length > 2" class="recommend" style="height:1px;opacity:0;"></div>-->
<!--          <div v-if="notAppList.length > 2" class="recommend" style="height:1px;opacity:0;"></div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    &lt;!&ndash; 预览 &ndash;&gt;-->
<!--    <Preview :keyScheme="keyScheme" :showModal="showModal" @closePreview="closePreview"></Preview>-->
</template>

<script>
import { appStore } from '../../../store';
import { mapActions, mapWritableState } from "pinia";
import { keyStore } from '../store'
import Preview from '../components/Preview.vue';
export default {
  name: "NotShortcutKey",
  components: {
    Preview
  },
  emits:['createScheme'],
  props: {
    detailJump: {
      type: Boolean,
      default: false
    },
    appMessage: {
      type: Object,
      default: {}
    },
    // notDownloadList: {
    //   type: Array,
    //   default: []
    // }
  },
  data() {
    return {
      notAppList :[],
      keyScheme: {},
      showModal: false
    }
  },
  computed: {
    ...mapWritableState(keyStore, ['marketList']),
  },
  methods: {
    ...mapActions(appStore,['showUserCard']),
    showCard(id){
      this.showUserCard(id)
    },
    //跳转到分享页
    share(){
      this.$emit('createScheme')
    },
    // 跳转到创意市场
    market(){
      this.$router.push({name: 'creativeMarket'})
    },
    // 返回
    onBack(){
      this.$router.go(-1)
    },
    previewKay(item){
      this.keyScheme = item
      this.showModal = true
    },
    closePreview(val){
      this.showModal = val
    },
    goDownload(){
      if(window.$isOffline){
        this.$message.error('离线模式暂无法使用')
      }else{
        this.$router.push({
          name:"shortcutStore"
        })
      }
    }
  },
  mounted(){
    if(this.detailJump) {
      this.notAppList = this.marketList[0].children.slice(0,3)
    }else{
      this.notAppList = this.marketList[0].children
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
    background: var(--mask-bg);
    border-radius: 12px;
    width: 356px;
    height: 136px;
    margin: 0 8px 16px;
    padding: 12px;
  }
  .btn-item{
    display: flex;
    font-size: 16px;
    >div{
      color: var(--primary-text);
      background: var(--mask-bg);
      width: 160px;
      text-align: center;
      height: 48px;
      line-height: 48px;
      margin: 0 7px;
      border-radius: 12px;
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
