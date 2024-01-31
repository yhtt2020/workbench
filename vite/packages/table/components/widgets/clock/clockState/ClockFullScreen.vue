<template>
  <teleport to="body">
    <img class="popContainer" :src="imgUrl" alt="" />
    <xt-menu :menus="fullMenu" name="name">
      <div class="box pointer" @click.prevent="exit">
        <component
          :is="clock"
          v-if="clock !== 'clock3'"
          :key="clock"
          :style="{ zoom: zoom }"
          :noBg="true"
          :clockFont="customData.font"
          :customData="customData"
          :isSnow="customData.enableSecond"
        />
        <clock3
          v-if="clock === 'clock3'"
          key="clock3"
          :style="{ zoom: zoom }"
          :isSnow="customData.enableSecond"
        ></clock3>
      </div>
    </xt-menu>
  </teleport>

  <ClockSettingModal ref="settingModalRef" :isFull="true" :customData="customData" :zIndex="'100000'" @updateClockStyle="updateClockStyle" >
    <template #modelScale>
      <ClockBackground @img="img" @updateBlur="updateBlur" @updateBgZoom="updateBgZoom" :bgZoom="bgZoom" :blur="blur" />
    </template>
  </ClockSettingModal>
</template>

<script>
import mixin from "../hooks/clockMixin.js";

import ClockStyle from "./ClockStyle.vue";
import ClockBackground from "./ClockBackground.vue";
import ClockSettingModal from "../components/ClockSettingModal.vue";

export default {
  mixins: [mixin],
  components: {
    ClockStyle,
    ClockBackground,
    ClockSettingModal
  },
  emits: ["updateBgZoom", "updateBlur", "updateClockStyle"],
  props: {
    clock: {
      type: String,
      // default: "block1",
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
    customData:{
      type:Object,
      default:()=>{}
    }
  },
  watch: {
    blur(a, b) {
      this.updateBlur(a);
    },
  },
  mounted() {
    window.addEventListener("keyup", this.esc);
    this.blurs = `blur(${parseInt(this.blur / 2)}px)`;
    this.zoom = `${this.bgZoom + 100}%`;
    this.touchEvent();

    //鼠标事件
    document.addEventListener("mousemove", this.touchEvent, { capture: true }); //鼠标移动
    document.addEventListener("mousedown", this.touchEvent, { capture: true }); //鼠标按下
    //触摸事件
    document.addEventListener("touchstart", this.touchEvent, { capture: true }); //手指放到屏幕上时触发
    document.addEventListener("touchmove", this.touchEvent, { capture: true }); //手指在屏幕上滑动式触发
    //键盘事件
    document.addEventListener("keydown", this.touchEvent, { capture: true }); //键盘按下事件
  },
  data() {
    return {
      optAction: false,
      settingVisible: false,
      autoTime: null,
      src: "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
      blurs: "blur(10px}",
      zoom: "100%",
      fullMenu:[
        {
          name:'时钟设置',newIcon:'fluent:settings-16-regular', 
          callBack:()=>{
           this.setting()
          }
        },
      ]
    };
  },
  methods: {
    // esc键退出
    esc(e) {
      if (e.keyCode === 27) this.exit();
    },
    // 触摸事件
    touchEvent() {
      const that = this;
      that.optAction = false; //让判断条件为true
      clearTimeout(this.autoTime); //清除自动刷新页面定时器
      if (that.settingVisible) return;
      this.autoTime = setTimeout(function () {
        that.optAction = true; //页面无操作后3秒，重时开启定时器
      }, 3000);
    },
    // 开启设置
    setting() {
      this.$refs.settingModalRef.openClockModal();
    },
    // 退出
    exit() {
      document.removeEventListener("mousemove", this.touchEvent, {
        capture: true,
      });
      document.removeEventListener("mousedown", this.touchEvent, {
        capture: true,
      });
      document.removeEventListener("touchstart", this.touchEvent, {
        capture: true,
      });
      document.removeEventListener("touchmove", this.touchEvent, {
        capture: true,
      });
      document.removeEventListener("keydown", this.touchEvent, {
        capture: true,
      });
      this.$emit("exit");
    },
    // 更新模糊度
    updateBlur(e) {
      this.blurs = `blur(${parseInt(e / 2)}px)`;
      this.$emit("updateBlur", e);
    },
    // 更新bg缩放
    updateBgZoom(e) {
      this.zoom = `${e + 100}%`;
      this.$emit("updateBgZoom", e);
    },
    // 更新时钟样式
    updateClockStyle(e) {
      this.$emit("updateClockStyle", e);
    },
    // 更新img
    img(img) {
      this.$emit("updateImgUrl", img);
    },
    // 随机更新时钟样式
    random() {
      let randNum = Math.floor(Math.random() * 5) + 1;
      this.$emit("updateClockStyle", `clock${randNum}`);
    },
    // 键盘按下
    down() {
      if (this.clock == "clock6") {
        this.$emit("updateClockStyle", `clock1`);
        return;
      }
      let num = this.clock.slice(-1);
      this.$emit("updateClockStyle", `clock${1 + parseInt(num)}`);
    },
    // 键盘抬起
    up() {
      if (this.clock == "clock1") {
        this.$emit("updateClockStyle", `clock6`);
        return;
      }
      let num = this.clock.slice(-1);
      this.$emit("updateClockStyle", `clock${parseInt(num) - 1}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  // background-size: cover;
  background-repeat: no-repeat;
  // background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // 背景的模糊大小通过下面的属性值大小来调制
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(5px);
  transform: scale(1.2);
}

.box {
  z-index: 99919;
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
  // backdrop-filter: blur(20px);

  .icon {
    height: 36px;
    width: 36px;
  }
}
</style>
