<template>
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="!openShare">
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
          <Market :desk="desk" @closeMarket="close" setCard="tip" @getCard="getCard"></Market>
        </dvi>
        <div class="body-box" v-if="selectNav.name !== 'share' && !shareList.length">
          <div class="box">
            <div class="box-block">
              <img src="/img/state/init.png" alt="">
              <span>分享我制作的外部小组件</span>
              <div class="block-btn" @click="shareNow">立即分享</div>
            </div>
          </div>
        </div>
        <div v-if="selectNav.name !== 'share' && shareList.length" class="share-list">
          <Market :desk="desk" @closeMarket="close" listType="my" setCard="my" @shareNow="shareNow" @closeMy="closeMy"></Market>
        </div>
    </div>
  </div>
  <div v-else>
    <RemoteShare :openShare="openShare" @closeShare="closeShare" :desk="desk" :cardId="cardId" :direct="direct"></RemoteShare>
  </div>

  <Modal blurFlag="true" v-model:visible="promptVisible" v-if="promptVisible" style="z-index:99999;">
    <div class="p-5 xt-modal flex flex-col justify-center items-center" style="border-radius:16px">
      <div>
        <Icon icon="tishi-xianxing" style="font-size: 21px;color: orange"></Icon>
        <span class="ml-3" style="font-size: 18px;color: var(--primary-text);font-weight: 500;">提示</span>
      </div>
      <span class="my-5" style="font-size: 16px;color: var(--secondary-text);">选择覆盖当前小组件的数据或在桌面上新建一个组件。</span>
      <div class="modal-btn">
        <div class="mr-3 rounded-lg xt-bg-2 cursor-pointer" @click="promptVisible = false">取消</div>
        <div class="mr-3 rounded-lg xt-bg-2 cursor-pointer" @click="addNewCard(selectCard)">新建小组件</div>
        <div class="mr-3 rounded-lg xt-bg-2 cursor-pointer" @click="subCard(selectCard)">覆盖当前</div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Market from '../../../components/card/remote/Market.vue'
import HorizontalPanel from '../../../components/HorizontalPanel.vue'
import { mapActions, mapWritableState } from "pinia";
import RemoteShare from '../../../components/card/remote/RemoteShare.vue'
import { cardStore } from '../../../store/card';
import {shareList} from '../../../components/card/remote/testData'
import cache from '../../../components/card/hooks/cache';
import Modal from '../../../components/Modal.vue';
import { message } from "ant-design-vue";
  export default{
    components: {
      HorizontalPanel,
      Market,
      RemoteShare,
      Modal
    },
    data() {
      return {
        navType:[
          {title:'社区分享',name:'share'},
          {title:'我的',name:'my'}
        ],
        selectNav:{title:'社区分享',name:'share'},
        desk: {},
        openShare: false,
        //当前卡片
        card: {},
        shareList,
        promptVisible: false,
        //选中社区的卡片
        selectCard: {},
        cardId: 0,
        direct: false
      }
    },
    methods: {
      ...mapActions(cardStore, ["addCard"]),
      close(){
        this.$router.go(-1)
      },
      shareNow(){
        this.openShare = true
      },
      closeShare(val,direct){
        this.openShare = val
        this.selectNav = {title:'我的',name:'my'}
        this.direct = direct
      },
      closeMy(){
        this.$forceUpdate()
      },
      setNavFixed(){
        let nav = document.getElementById('nav');
        let list = document.getElementById('navList');
        nav.classList.add('suspension-r-nav')
        list.classList.add('list-r-nav')
      },
      // 获取要添加的市场小卡片
      getCard(card){
        this.promptVisible = true
        this.selectCard = card
      },
      addNewCard(card) {
        let size = card.sizes[0].split('x')
        this.addCard(
          {
            name: card.option[0].name,
            id: Date.now(),
            customData: {
              url:card.url,
              width: (parseInt(size[0]) / 2),
              height:(parseInt(size[1]) / 2)
            }
          },
          this.desk
        );
        // this.addCard(
        //   { name: card.option[0].name, id: Date.now(), customData: {url:card.url} },
        //   this.desk
        // );
        this.close()
        message.success("添加成功！");
      },
      subCard(card){
        this.card.customData.url = card.url
        this.close()
        message.success("修改成功！");
      }
    },
    computed: {
      ...mapWritableState(cardStore, ['desks']),
    },
    mounted(){
      let params = this.$route.params
      let deskId = params.id
      this.cardId = params.cardId
      this.openShare = params.direct
      this.direct = params.direct
      let size = JSON.parse(params.size)
      cache.set('cardSize',size)
      this.desk = this.desks.find(item => item.id === deskId)
      this.card = this.desk.cards.find(item => item.id === parseInt(this.cardId))
      // console.log('市场', this.card)
      // cache.set('currentCard',this.card)
      this.setNavFixed()
    },
    watch: {
      selectNav(val){
        this.$nextTick(() => {
          if(val.name === 'share'){
            this.setNavFixed()
          }else if(val.name === 'my' && shareList.length){
            this.setNavFixed()
          }
        })
      }
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
.body-box{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .box{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box-block{
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 16px;
      margin: 16px 0;
      color: var(--primary-text);
      img{
        width: 80px;
        height: 80px;
      }
      span{
        margin: 16px 0;
      }
      .block-btn{
        text-align: center;
        padding: 10px 28px;
        border-radius: 12px;
        background: var(--active-bg);
        cursor: pointer;
      }
    }
  }
.share-list{
  height: 100%;
  overflow: auto;
}
.share-list::-webkit-scrollbar{
  display: none;
}
.modal-btn {
    display: flex;
    font-size: 16px;
    color: var(--primary-text);
    > div {
      width: 120px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      margin-top: 24px;
      background: var(--mask-bg);
    }
    >div:nth-child(3){
      background: var(--active-bg) !important;
    }
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
