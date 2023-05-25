<template>
  <teleport to="body">
    <div class='popContainer' :style="{ backgroundImage: imgUrl, filter: blurs }">
    </div>
    <div class="box">
      <component :is="clock" v-if="clock !== 'clock3'" :key="clock" :style="{ zoom: zoom }" />
      <clock3 v-if="clock == 'clock3'" key="clock3" :style="{ zoom: zoom }"></clock3>
      <div class="flex  bottom" :style="optAction == true ? 'display: none' : ''">
        <div class="item-icon flex justify-center items-center pointer mr-4" @click="up()">
          <Icon class="icon" icon="caret-left"></Icon>
        </div>
        <div class="item-icon flex justify-center items-center pointer mr-4" @click="down()">
          <Icon class="icon" icon="caret-right"></Icon>
        </div>
        <div class="item-icon flex justify-center items-center pointer mr-4" @click="random()">
          <Icon class="icon" icon="reload"></Icon>
        </div>
        <div class="item-icon flex justify-center items-center pointer mr-4" @click="settingVisible = true">
          <Icon class="icon" icon="setting"></Icon>
        </div>
        <div class="item-icon flex justify-center items-center pointer mr-4" @click="exit()">
          <Icon class="icon" icon="guanbi2"></Icon>
        </div>
      </div>
    </div>
    <a-drawer style="z-index: 99999999999;scrollbar-width: none;" :width="500" v-model:visible="settingVisible"
      placement="right">
      <template #title>
        <div class="text-center">设置</div>
      </template>

      <ClockBackground @img="img" @updateBlur="updateBlur" @updateBgZoom="updateBgZoom" :bgZoom="bgZoom" :blur="blur">
      </ClockBackground>
      <ClockStyle @updateClockStyle="updateClockStyle"></ClockStyle>
    </a-drawer>
  </teleport>
</template>

<script>
import mixin from "../hooks/clockMixin.js"

import ClockStyle from "./ClockStyle.vue";
import ClockBackground from "./ClockBackground.vue";
export default {
  mixins: [mixin],
  components: {
    ClockStyle,
    ClockBackground
  },
  props: {
    clock: {
      type: String,
      default: "block1",
    },
    imgUrl: {
      type: String,
      default: "",
    },
    blur: {
      type: String,
      default: 0,
    },
    bgZoom: {
      type: String,
      default: 0,
    },
  },
  mounted() {
    this.blurs = `blur(${parseInt(this.blur / 2)}px)`
    this.zoom = `${this.bgZoom + 100}%`
    this.touchEvent()
    //鼠标事件
    document.addEventListener('mousemove', this.touchEvent, { capture: true });//鼠标移动
    document.addEventListener('mousedown', this.touchEvent, { capture: true });//鼠标按下
    //触摸事件  
    document.addEventListener('touchstart', this.touchEvent, { capture: true }); //手指放到屏幕上时触发
    document.addEventListener('touchmove', this.touchEvent, { capture: true });//手指在屏幕上滑动式触发
    //键盘事件
    document.addEventListener('keydown', this.touchEvent, { capture: true }); //键盘按下事件
  },
  data() {
    return {
      optAction: false,
      settingVisible: false,
      autoTime: null,
      src: "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
      blurs: "blur(10px}",
      zoom: "100%",
    };
  },
  methods: {
    exit() {
      document.removeEventListener("mousemove", this.touchEvent, { capture: true });
      document.removeEventListener("mousedown", this.touchEvent, { capture: true });
      document.removeEventListener("touchstart", this.touchEvent, { capture: true });
      document.removeEventListener("touchmove", this.touchEvent, { capture: true });
      document.removeEventListener("keydown", this.touchEvent, { capture: true });
      this.$emit('exit')
    },
    updateBlur(e) {
      this.blurs = `blur(${parseInt(e / 2)}px)`
      this.$emit("updateBlur", e)
    },
    updateBgZoom(e) {
      this.zoom = `${e + 100}%`
      this.$emit("updateBgZoom", e)
    },
    touchEvent() {
      const that = this
      // console.log("操作中")
      that.optAction = false //让判断条件为true 
      clearTimeout(this.autoTime) //清除自动刷新页面定时器
      this.autoTime = setTimeout(function () {
        that.optAction = true //页面无操作后3秒，重时开启定时器
        // console.log("无操作")
      }, 3000)
    },

    updateClockStyle(e) {
      this.$emit("updateClockStyle", e);
    },
    img(img) {
      let src = `url(${img})`
      this.$emit("updateImgUrl", src)
    },
    random() {
      let randNum = Math.floor(Math.random() * 5) + 1;
      this.$emit("updateClockStyle", `clock${randNum}`);
    },
    down() {
      if (this.clock == "clock6") {
        this.$emit("updateClockStyle", `clock1`);
        return
      }
      let num = this.clock.slice(-1)
      this.$emit("updateClockStyle", `clock${1 + parseInt(num)}`);
    },
    up() {
      if (this.clock == "clock1") {
        this.$emit("updateClockStyle", `clock6`);
        return
      }
      let num = this.clock.slice(-1)
      this.$emit("updateClockStyle", `clock${parseInt(num) - 1}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 99999;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  // 背景的模糊大小通过下面的属性值大小来调制
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(5px);
  transform: scale(1.2);
}

.box {
  z-index: 99911199;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.item-icon {
  z-index: 9999999999999;
  width: 100px;
  height: 56px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);

  .icon {
    height: 36px;
    width: 36px;
  }
}
</style>
