<template>
  <teleport to="body">
    <div class='popContainer' @click="closeFullScreen()">
      <div class="box xt-bg" @click.stop="">
        <div class="title xt-text">
          <input type="text" v-model="text" style="width: 100%;" />
        </div>
        <div class="item-box">
          <icon v-for="item in iconList" v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen"></icon>
          <icon v-for="item in iconList" v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen"></icon>
          <icon v-for="item in iconList" v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen"></icon>
          <icon v-for="item in iconList" v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen"></icon>
          <icon v-for="item in iconList" v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen"></icon>
        </div>
      </div>
    </div>

  </teleport>
</template>

<script>
import icon from "../oneIcon/index.vue"
export default {
  props: {
    iconList: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      text: "分组"
    }
  },
  components: {
    icon
  },
  methods: {
    closeFullScreen() {
      this.$emit("closeFullScreen")
    },
    aaa() {
      console.log('1 :>> ', 1);
    },
    a2() {
      console.log('1 :>> ', 2);
    }
  }
}
</script>

<style lang="scss" scoped>
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // 背景的模糊大小通过下面的属性值大小来调制
  background: var(--mask-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(5px);
  transform: scale(1.2);
}

.box {
  width: 598px;
  height: 520px;
  z-index: 9999999;
  box-shadow: 0px 0px 10.23px 0px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 10px;

  .title {
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  .item-box {
    display: flex;
    border: 1px solid;
    flex-wrap: wrap;
    align-content: flex-start;
  }
}
</style>