<template>
  <teleport to="body">

    <div class='popContainer' @click="closeFullScreen()" :style="show">
    </div>
    <droppable-area @leave="handleLeave" style="border: 1px solid red;">
      <div class="box xt-bg" @click.stop="" :style="show">
        <div class="title xt-text">
          <input @blur="updateGroupTitle()" type="title" v-model="title" class="input-box" style="" />
          <div class="box-btn" @click="disbandGroup">
            <div class="text" style="color: #fff;">
              · · ·
            </div>
          </div>
        </div>
        <div class="item-box">
          <div ref="iconRef" v-for="(item, index) in iconLists" @contextmenu.prevent.stop="rightClick(index)">
            <drag-and-follow @drag-start="handleDragStart" @drag-end="handleDragEnd">
              <icon v-bind="item" :index="index" :data-index="index" style="margin: 5px;" @onIconClick="closeFullScreen">
              </icon>
            </drag-and-follow>
          </div>
        </div>
      </div>
    </droppable-area>

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
import DragAndFollow from '../hooks/DragAndFollow.vue';
import DroppableArea from "../hooks/DroppableArea.vue"


import { mapWritableState } from 'pinia'
import { myIcons } from '../../../../store/myIcons.ts'
export default {
  props: {
    iconLists: {
      type: Object,
      default: () => { },
    },
    groupTitle: {
      type: String
    },

  },
  data() {
    return {
      title: this.groupTitle,
      index: 0,
      settingVisible: false,
      visible: false,
      isShow: true
    }
  },
  inject: ['customIndex'],
  components: {
    icon,
    DragAndFollow,
    DroppableArea
  },
  computed: {
    ...mapWritableState(myIcons, ['iconOption', 'isDrag', 'isPaste', 'iconList', 'isClose', 'iconState']),
    show() {
      return { display: this.isShow == true ? 'black' : 'none' }
    }
  },
  methods: {
    // 全屏拖拽开始
    handleDragStart(event) {
      this.isDrag = true
      this.iconState = true
      const index = event.target.dataset.index;
      this.index = index
      this.iconList = []
      this.iconList.push({ ...this.iconLists[index], iconIndex: this.customIndex })
    },
    // 全屏拖拽结束
    handleDragEnd() {
      if (this.isClose) { // 是否离开过全屏
        this.closeFullScreen() // 关闭全屏
        this.isClose = false // 重置离开全屏状态
        // 是否执行过粘贴图标
        if (this.isPaste && this.iconState) {
          this.deleteIcons()
        }
        else if (this.iconState) {
          this.$emit('dragAddIcon', this.iconList[0])
          this.deleteIcons()
        }
        this.isPaste = false // 重置粘贴状态

      }

    },
    // 全屏离开
    handleLeave() {
      if (this.isDrag) { // 是否为拖拽状态
        this.isShow = false
        this.isClose = true
      }
    },
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
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
  width: 598px;
  height: 476px !important;
  z-index: 9999999;
  box-shadow: 0px 0px 10.23px 0px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 10px;
  z-index: 999999999999999999;

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