<template>
  <teleport to="body">
    <div class='popContainer' @click="closeFullScreen()">
      <div class="box xt-bg" @click.stop="">
        <div class="title xt-text">
          <input @blur="updateGroupTitle()" type="title" v-model="title" class="input-box" style="" />
          <div class="box-btn" @click="disbandGroup">
            <div class="text" style="color: #fff;">
              · · ·
            </div>
          </div>
        </div>
        <div class="item-box">
          <div ref="iconRef" v-for="(item, index) in iconList" @contextmenu.prevent.stop="rightClick(index)">
            <icon v-bind="item" style="margin: 5px;" @onIconClick="closeFullScreen">
            </icon>
          </div>
        </div>
      </div>
    </div>
    <a-drawer :width="500" :height="196" placement="bottom" v-model:visible="visible" style="z-index: 99999999;">
      <div class="flex flex-row">
        <div class="option h-24 w-24 ml-4" @click="editIcons()">
          <Icon class="icon" icon="guanbi2"></Icon>
          编辑
        </div>
        <div class="option h-24 w-24 ml-4" @click="deleteIcons()">
          <Icon class="icon" icon="guanbi2"></Icon>
          删除
        </div>
      </div>
    </a-drawer>
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
    groupTitle: {
      type: String
    }
  },
  data() {
    return {
      title: this.groupTitle,
      index: 0,
      settingVisible: false,
      visible: false
    }
  },
  components: {
    icon
  },
  methods: {
    // 右键点击
    rightClick(index) {
      this.index = index
      this.visible = true
    },
    // 多图标全屏模式关闭
    closeFullScreen() {
      this.$emit("closeFullScreen")
    },
    // 解除多图标分组
    disbandGroup() {
      this.$emit("closeFullScreen")
      this.$emit("disbandGroup")
    },
    // 更新多图标组件标题
    updateGroupTitle() {
      this.$emit("updateGroupTitle", this.title)
    },
    // 编辑多图标组件中的单个图标
    editIcons() {
      this.visible = false
      this.$emit('editIcons', this.index)
    },
    // 删除多图标组件中的单个图标
    deleteIcons() {
      this.visible = false
      this.$emit("deleteIcons", this.index)
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

      &:focus {
        outline: none;
        background: var(--main-mask-bg) !important;
        border-radius: 12px;

      }

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
</style>