<template>
  <teleport to="body">
    <div class='popContainer' :style="{ backgroundImage: src }">
      <div class="box" style="background-image: url();">
        <component :is="clock" />
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
            <Icon class="icon" icon="tuichu"></Icon>
          </div>
        </div>
      </div>
      <a-drawer style="z-index: 99999999999;scrollbar-width: none;" :width="500" v-model:visible="settingVisible"
        placement="right">
        <template #title>
          <div class="text-center">设置</div>
        </template>
        <ClockBackground @img="img"></ClockBackground>
        <ClockStyle @updateClockStyle="updateClockStyle"></ClockStyle>
      </a-drawer>
    </div>
  </teleport>
</template>

<script>
import clock1 from "../clock1/clock1.vue";
import clock2 from "../clock2/clock2.vue";
import clock3 from "../clock3/clock3.vue";
import clock4 from "../clock4/clock4.vue";
import clock5 from "../clock5/clock5.vue";
import clock6 from "../clock6/clock6.vue";
import ClockStyle from "./ClockStyle.vue";
import ClockBackground from "./ClockBackground.vue";
export default {
  components: {
    clock1,
    clock2,
    clock3,
    clock4,
    clock5,
    clock6,
    ClockStyle,
    ClockBackground
  },
  props: {
    clock: {
      type: String,
      default: "block1",
    },
  }, mounted() {
    this.touchEvent()
    //鼠标事件
    window.addEventListener('mousemove', this.touchEvent);//鼠标移动
    window.addEventListener('mousedown', this.touchEvent);//鼠标按下
    //触摸事件  
    window.addEventListener('touchstart', this.touchEvent); //手指放到屏幕上时触发
    window.addEventListener('touchmove', this.touchEvent);//手指在屏幕上滑动式触发
    //键盘事件
    window.addEventListener('keydown', this.touchEvent);//键盘按下事件
  },
  data() {
    return {
      optAction: false,
      settingVisible: false,
      src: "url(https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg)"
    };
  },
  methods: {
    exit() {
      window.removeEventListener("mousemove", this.touchEvent, { capture: true });
      window.removeEventListener("mousedown", this.touchEvent, { capture: true });
      window.removeEventListener("touchstart", this.touchEvent, { capture: true });
      window.removeEventListener("touchmove", this.touchEvent, { capture: true });
      window.removeEventListener("keydown", this.touchEvent, { capture: true });
      this.$emit('exit')
    },

    touchEvent() {
      let autoTime = null//定时器
      const that = this
      console.log("操作中")
      that.optAction = false //让判断条件为true
      clearTimeout(autoTime) //清除自动刷新页面定时器
      autoTime = setTimeout(function () {
        that.optAction = true //页面无操作后3秒，重时开启定时器
        console.log("无操作")
      }, 1000 * 3)
    },

    updateClockStyle(e) {
      this.$emit("updateClockStyle", e);
    },
    img(img) {
      this.src = `url(${img})`
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
}

.box {
  z-index: 99911199;
}

.bottom {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  :deep(.clock3) {
    transform: scale(1.2, 1.2);
  }
}

@media (max-width: 768px) {
  :deep(.clock3) {
    transform: scale(0.7, 0.7);
  }
}

@media (min-width: 993px) {
  :deep(.clock3) {
    transform: scale(0.7, 0.7);
  }
}

@media (max-width:768px) {
  .item-icon {
    width: 70px !important;
    height: 36px !important;

    .icon {
      height: 26px !important;
      width: 26px !important;
    }
  }
}

/* （宽度为 375px ~ 宽度为 413px） 之间的屏幕 */
@media (min-width:375px) and (max-width:413px) {
  .bodyItem {
    background-color: blue;
  }
}

/* （宽度为 414px） 或者更大尺寸的屏幕 */
@media only screen and (min-width:414px) {
  .bodyItem {
    background-color: yellow;
  }
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
