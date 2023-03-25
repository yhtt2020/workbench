<template>
  <div class="mask">
    <a-card style="width: 60%" class="card-content">
      <div>{{ cardType.cname }}</div>
      <div>{{ cardType.detail }}</div>
      <div class="card" style="height: auto;margin:0;transform: scale(0.9);">
        <a-carousel arrows v-if="cardType.name === 'countdownDay'||cardType.name === 'supervisory'" :after-change="imgChang" >
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: -80px; z-index: 1">
              <left-circle-outlined />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: -80px">
              <right-circle-outlined />
            </div>
          </template>

          <img :src="'/img/homeComponent/'+i+'.png'" style="width: 100%;height: 100%" alt="" v-for="i in cardType.images">
        </a-carousel>
        <div v-else style="display: table-cell;">
          <img :src="'/img/homeComponent/'+cardType.images+'.png'" style="width: 100%;height: 100%;vertical-align: middle" alt="" >
        </div>
      </div>
      <div class="btn">
        <a-button type="primary" style="background: #2266D1;border: none;"  @click="addCard()">添加</a-button>
        <a-button type="primary" style="background: #2266D1;border: none;"  @click="onBack">取消</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { tableStore } from "../../../store";
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
    ...mapActions(tableStore, ["addCustomComponents"]),
    imgChang(i){
     this.carouselIndex = i;
    },
    onBack () {
      this.$emit("onBack")
      this.show = true;
    },
    addCard () {
      switch (this.cardType.images[this.carouselIndex]) {
        case "CPUFourCard":
          this.addCustomComponents({ name:this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          }); message.info("添加成功！");
          break;
        case "SmallCPUCard":
          this.addCustomComponents({ name:this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          });   message.info("添加成功！"); break;
        case "SmallGPUCard":
          this.addCustomComponents({ name:this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          });  message.info("添加成功！");  break;

        case "CPULineChart":
          this.addCustomComponents({ name:this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          });  message.info("添加成功！");  break;
        case "customTimer":
          this.addCustomComponents({ name:this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          });
          message.info("添加成功！");
          break;
        case "countdownDay":
          this.addCustomComponents({ name: this.cardType.images[this.carouselIndex], id: Date.now() });
          // this.$router.push({
          //   name: "addCardSetting",
          //   params: {
          //     name: this.cardType.images[this.carouselIndex],
          //     cname: this.cardType.cname,
          //   },
          // });
          // break;
          this.$router.push({
          name: "home",
            params: {
          name: this.cardType.images[this.carouselIndex],
            cname: this.cardType.cname,
        },
      });
      message.info("添加成功！");
      break;
        case "smallCountdownDay":
          this.addCustomComponents({ name: this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          });
          message.info("添加成功！");
          break;
        case "clock":
          this.addCustomComponents({ name:this.cardType.images[this.carouselIndex], id: Date.now() });
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.images[this.carouselIndex],
              cname: this.cardType.cname,
            },
          });
          message.info("添加成功！");
          break;

      }
    }
  }

}
</script>

<style lang="scss" scoped>
.mask {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999999999;
  .card-content {
    z-index: 9999999999;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);

    text-align: center;


    .btn {
      background: transparent;
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      padding: 0 200px;
    }
  }
}
.title {
  background: #363739;
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 26em;
  line-height: 26em;
  background: transparent;
  overflow: hidden;
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
}</style>
