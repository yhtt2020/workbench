<template>
  <teleport to="body">
    <div class='popContainer' @click="closeFullScreen()">
      <div class="box xt-bg" @click.stop="">
        <div class="title xt-text">
          <input type="text" v-model="text" class="input-box" style="" />
          <div class="box-btn" @click="disbandGroup">
            <div class="text" style="color: #fff;">
              · · ·
            </div>
          </div>
        </div>
        <div class="item-box">
          <div ref="iconRef" v-for="item in iconList">
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
            <!-- <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon> -->
          </div>
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
  mounted() {
    this.$refs.iconRef.forEach((item) => {
      item.addEventListener("contextmenu", this.handleMenu, { capture: true })
    })
  },
  beforeDestroy() {
    this.$refs.iconRef.forEach((item) => {
      item.removeEventListener("contextmenu", this.handleMenu, { capture: true })
    })
  },
  methods: {
    closeFullScreen() {
      this.$emit("closeFullScreen")
    },
    handleMenu(e) {
      e.preventDefault()
      e.stopPropagation()
      console.log('123 :>> ', 123);
    },
    disbandGroup() {
      this.$emit("disbandGroup")
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
  height: 476px !important;
  z-index: 9999999;
  box-shadow: 0px 0px 10.23px 0px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 10px;

  .title {

    height: 48px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .input-box {
      width: 98%;
      text-align: center;
      height: 52px;
      background: none;
      border: 0;

    }

    .box-btn {
      position: absolute;
      width: 48px;
      height: 48px;
      background: var(--active-bg);
      color: var(--active-text);
      right: 6px;
      top: 0px;
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .item-box {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 411px;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

  }
}

input[type=text]:focus {
  outline: none;
  background: var(--main-mask-bg) !important;
  border-radius: 12px;

}
</style>