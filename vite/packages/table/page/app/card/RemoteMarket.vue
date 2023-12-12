<template>
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="openRemote" >
    <div
         class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col"
         style=";width: 600px;height: 80%;background: var(--modal-bg);">
      <div class="head-nav">
        <span class="ml-2" style="font-size: 16px;color: var(--primary-text);font-weight: 500;">1外部小组件</span>
        <div @click="close" class="h-11 w-11 flex justify-center items-center xt-bg-2 rounded-lg pointer">
          <Icon icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
        </div>
      </div>
      <div class="content" @scroll="scrollBox" id="scroll-box">
        <div class="box xt-bg-2">
          <div class="add no-drag" @click="addNewCard(custom)">
            <div class="icons">
              <Icon icon="tianjia2" style="color: #000"></Icon>
            </div>
          </div>
          <div class="left no-drag" @click="fullScreen(custom)">
            <img :src="getImg(custom.option[0].imgName)" alt="" :style="{ zoom: '6%' }"/>
            <span class="size-bg">{{ custom.option[0].size }}</span>
          </div>
          <div class="right" style="">
            <div class="title" style="color: var(--primary-text)">
              {{ custom.cname }}
            </div>
            <div class="text" style="color: var(--secondary-text)">
              {{ custom.detail }}
            </div>
          </div>
        </div>
          <Market :desk="desk" @closeMarket="close"></Market>
      </div>

    </div>
  </div>
  <NewPreviewCardDetails
    v-if="isCardDetails"
    @addCardAchieve="addCardAchieve"
    @closeCardDetails="closeCardDetails"
    :cardDetails="cardDetails"
  >
  </NewPreviewCardDetails>
</template>

<script>
  import { mapActions, mapWritableState } from "pinia";
  import { cardStore } from "../../../store/card";
  import { message } from "ant-design-vue";
  import NewPreviewCardDetails from "./NewPreviewCardDetails.vue";
  import Market from "../../../components/card/remote/Market.vue";
  export default{
    components: {
      NewPreviewCardDetails,
      Market
    },
    props: {
      openRemote: {
        type: Boolean,
        default: () => false
      },
      custom: {
        type: Object,
        default: () => {}
      },
      desk: {
      type: Object,
      required: true,
      default: () => {},
    },
    },
    data() {
      return {
        carouselIndex: 0,
        isCardDetails: false,
        cardDetails: {},
        remoteContent: {},
        showModal: false,
        fixed: false
      }
    },
    methods: {
      ...mapActions(cardStore, ["addCard"]),
      close(){
        this.$emit('closeMarket',false)
      },
      getImg(url) {
        return "https://a.apps.vip/cards/" + url + ".png";
      },
      addNewCard(item) {
        if (item.option[1] != undefined) {
          this.fullScreen(item);
        } else {
          this.addCardAchieve(item);
        }
      },
      addCardAchieve(item, i) {
        this.add(item, i);
      },
      fullScreen(item) {
        this.cardDetails = item;
        this.isCardDetails = true;
      },
      add(item, index = 0) {
        console.log('item :>> ', item);
        console.log(' item.option[index].name :>> ',  item.option[index].name);
        index = index ?? this.carouselIndex;
        this.addCard(
          { name: item.option[index].name, id: Date.now(), customData: {} },
          this.desk
        );
        this.$emit("closeMarket",false);
        message.success("添加成功！");
      },
      closeCardDetails() {
        this.isCardDetails = false;
      },
      scrollBox(val){
        let scroll = document.getElementById('scroll-box');
        // console.log(scroll.scrollHeight - scroll.scrollTop == scroll.clientHeight)
        let nav = document.getElementById('nav');
        let navList = document.getElementById('navList');
        if (scroll.scrollTop > 120 ) {
          nav.classList.add('suspension-r-nav')
          navList.classList.add('classList-contnet')
        } else {
          nav.classList.remove('suspension-r-nav')
          navList.classList.remove('classList-contnet')
        }
      }
    },
    watch: {
      openRemote(val){
        if(val){

        }
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
  >div{
    position: absolute;
    right: 12px;
  }
}
.box {
  box-shadow: rgb(0 0 0 / 30%) 0px 0px 3px 0px;
  width: 542px;
  height: 120px;
  display: flex;
  border-radius: 12px;
  position: relative;
  border-radius: 12px;
  margin: 16px auto 0;
  .add {
    position: absolute;
    right: 22px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    background: var(--active-bg);
    border-radius: 12px;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .icons {
      background: #fff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 12px !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .text {
      font-size: 20px !important;
      display: flex;
      align-items: center;
    }
  }

  .left {
    height: 120px;
    border-radius: 12px 0px 0px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 120px;
    cursor: pointer;
    background: var(--mask-bg);
    position: relative;
    .size-bg{
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: var(--secondary-bg);
      font-weight: 500;
      color: var(--secondary-text);
      padding: 0 8px;
      border-radius: 4px;
    }
    .top {
      background: var(--secondary-bg);
      width: 100%;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px 0 0 0;
      img {
        zoom: 0.07 !important;
        object-fit: contain;
      }
      .zoom {
        zoom: 0.05 !important;
      }
    }

    .bottom {
      width: 100%;
      height: 62px;
      border-radius: 0px 0px 0px 12px;
      display: flex;
      justify-content: space-around;
      padding: 10px;

      .zoom {
        zoom: 0.02 !important;
      }

      img {
        zoom: 0.04;
        border-radius: 5px;
        object-fit: contain;
      }
    }
  }

  .right {
    box-sizing: border-box;
    padding: 10px;
    width: 358px;

    border-radius: 0 12px 12px 0px;

    .title {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      height: 35px;
      line-height: 35px;
    }

    .text {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      margin: 2px 0;
      width: 95%;
      height: 55px;
    }

    .icon {
      margin-bottom: 10px;
      display: flex;
      width: 100%;
      height: 24px;
      margin-top: 10px;

      .icon-box {
        padding: 0 10px 0 10px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .data {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .icons {
        color: #508bfe 100%;
        height: 16px;
      }

      .data-box {
        margin: 0 4px;
        color: var(--primary-text);
      }
    }
  }
}
.content{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.content::-webkit-scrollbar{
  display: none;
}
</style>
<style lang="scss">
  .suspension-r-nav{
    z-index: 99999;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    padding: 16px 0;
    background: var(--modal-bg);
  }
  .classList-contnet{
    padding-top: 76px;
  }
</style>
