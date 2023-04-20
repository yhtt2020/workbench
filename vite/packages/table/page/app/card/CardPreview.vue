<template>
  <div class="card add-list">
      <div>{{ cardType.cname }}</div>
      <div>{{ cardType.detail }}</div>
      <div>
        <a-carousel arrows v-if="cardType.name === 'countdownDay'||cardType.name === 'supervisory' || cardType.name === 'games'"
                    :after-change="imgChang" style="width: 200px;height: 295.86px;"  effect="fade">


          <template #prevArrow>
            <div class="custom-slick-arrow" style=" z-index: 1;left: -89px">
              <Icon icon="left-circle-fill" class="carousel-icon"></Icon>
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: -66px">
              <Icon icon="right-circle-fill" class="carousel-icon"></Icon>
            </div>
          </template>

          <img :src="'/img/homeComponent/'+i+'.png'" style="" alt="" v-for="i in cardType.images">
        </a-carousel>
        <div class="one-img" v-else>
          <img  :src="'/img/homeComponent/'+cardType.images+'.png'" style="height: 100%;border-radius: 8px" alt="" >
        </div>
      </div>
    <div class="add-button pointer" @click="addCard">
      添加
    </div>
<!--      <div class="btn">-->
<!--        <a-button type="primary" style="background: #2266D1;border: none;"  @click="addCard()">添加</a-button>-->
<!--        <a-button type="primary" style="background: #2266D1;border: none;"  @click="onBack">取消</a-button>-->
<!--      </div>-->

  </div>
</template>

<script>
import { mapActions } from "pinia";
import { cardStore } from "../../../store/card";
import { message } from "ant-design-vue";
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
export default {
  data () {
    return {
      visibility:false,
      carouselIndex:0
    }
  },
  components:{
    LeftCircleOutlined,
    RightCircleOutlined
  },
  name: "CardPreview",
  props: {
    cardType: {
      type: Object,
      default: () => { }
    }
  },


  methods: {
    ...mapActions(cardStore, ["addCustomComponents"]),
    imgChang(i){
     this.carouselIndex = i;
    },
    onBack () {
      this.$emit("onBack")
      this.show = true;
    },
    addCard () {
      console.log(this.cardType.images[this.carouselIndex])
          this.addCustomComponents({ name:this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$emit("addSuccess")
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          });
          message.info("添加成功！");
    }
  }

}
</script>

<style lang="scss" scoped>
.card {
 display: flex;
 flex-direction: column;
  align-items: center;
  position: relative;
  >:nth-child(1){
    font-size: 18px;
    font-weight: 400;
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.85);
  }
  >:nth-child(2){
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 17px;
    font-weight: 400;
  }
  >:nth-child(3){

  }
  >:nth-child(4){


  }
}
.one-img{
  width: 200px;
  height: 300px;
  margin-top: 21px;
  img{
    object-fit:contain;
    width: 100%;
  }
}
.title {
  background: #363739;
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  width: 200px;
  height: 320px;
  line-height: 320px;
  margin-top: 11px;
  background: transparent;
  overflow: hidden;
}
.carousel-icon{
  width: 48px;
  height: 48px;
  opacity: 0.8;
}
.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;

  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.cartoon {

  animation-name: example;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}

@keyframes example {
  0% {
    transform: scale(0.8) rotate3d(1, 1, 0, 0deg)
  }

  25% {
    transform: scale(0.8) rotate3d(1, 1, 0, 20deg)
  }

  50% {
    transform: scale(0.8) rotate3d(1, 1, 0, 0deg)
  }

  75% {
    transform: scale(0.8) rotate3d(-1, -1, 0, 20deg)
  }

  100% {
    transform: scale(0.8) rotate3d(1, 1, 0, 0deg)}
}
.add-button{
  position: absolute;
  bottom: 24px;
  width: 100px;
  height: 48px;
  opacity: 1;
  border-radius: 12px;
  font-size: 18px;
  background: rgba(42, 42, 42, 1);
  text-align: center;
  line-height: 48px;
}
:deep(.ant-carousel .slick-dots li) {
  width: 30px!important;

}
:deep(.ant-carousel .slick-dots li.slick-active button){
  width: 10px;
  height: 10px;
  opacity: 1;
  border-radius: 5px;
  background:  rgba(255, 255, 255, 0.4);
}
:deep(.ant-carousel .slick-dots ul){
  height: 20px;
  top: 10px;
  width: 20px!important;
}
:deep(.ant-carousel .slick-dots li button){
  width: 10px;
  height: 10px;
  opacity: 0.3;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.4);

}
:deep(.ant-carousel .slick-dots-bottom){
  width: 9px;
  left: 64px;
  bottom: -25px;
}
</style>
