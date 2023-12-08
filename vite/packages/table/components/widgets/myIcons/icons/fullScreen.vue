<template>
  <teleport to="body">

    <div class='pop-container' @click="closeFullScreen()" :style="show">
    </div>
    <droppable-area @leave="handleLeave">
      <div class="box  xt-modal" @click.stop="" :style="show">
        <div class="title xt-text">
          <input @blur="updateGroupTitle()" type="title" v-model="title" class="input-box" style="" />
          <div class="box-btn xt-bg-2" @click="disbandGroup">
            <Icon class="icon" icon="zhankai"></Icon>
          </div>
        </div>
        <div class="item-box" >
          <div ref="iconRef" v-for="(item, index) in iconLists" @contextmenu.prevent.stop="rightClick(index)">
            <drag-and-follow @drag-start="handleDragStart" @drag-end="handleDragEnd">
              <icon
              :isReSize="true"
               v-bind="item" :index="index" :data-index="index" @onIconClick="closeFullScreen"
               style="margin: 5px 10px;"
              >
              </icon>
            </drag-and-follow>
          </div>
        </div>
      </div>
    </droppable-area>

    <a-drawer :width="500" :height="200" placement="bottom" v-model:visible="visible" style="z-index: 99999999;">
      <BottomEdit :menuList="menuList"></BottomEdit>
    </a-drawer>
  </teleport>
</template>

<script>
import icon from "../components/icon.vue"
import DragAndFollow from '../components/DragAndFollow.vue';
import DroppableArea from "../components/DroppableArea.vue"
import BottomEdit from "../components/bottomEdit.vue";


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
      isShow: true,
      menuList: [

        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.editIcons();
          },
        },
        {
          icon: "guanbi2",
          title: "删除",
          fn: () => {
            this.deleteIcons();
          },
        },
      ]
    }
  },
  inject: ['customIndex'],
  components: {
    icon,
    DragAndFollow,
    DroppableArea,
    BottomEdit
  },
  computed: {
    ...mapWritableState(myIcons, [ 'isDrag', 'isPaste', 'iconList', 'isClose', 'iconState']),
    show() {
      return { display: this.isShow == true ? 'black' : 'none' }
    }
  },
  mounted() {
    this.isDrag = false
  },
  methods: {
    // 全屏拖拽开始
    handleDragStart(event) {
      // 初始化
      this.isDrag = true
      this.isPaste = false
      this.iconState = true
      this.iconList = []
      this.index = event.target.dataset.index; // 获取拖拽的图标下标
      this.iconList.push({ ...this.iconLists[this.index], iconIndex: this.customIndex })
    },
    // 全屏拖拽结束
    handleDragEnd() {
      if (this.isClose) { // 是否离开过全屏
        // 粘贴到多图标组件
        if (this.isPaste && this.iconState) this.deleteIcons()
        // 恢复单图标组件
        else if (this.iconState) {
          this.$emit('dragAddIcon', this.iconList[0])
          this.deleteIcons()
        }
        this.closeFullScreen() // 关闭全屏
        this.isClose = false // 关闭全屏离开状态
      }
      this.isDrag = false
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
.pop-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
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
  width: 638px;
  height: 490px !important;
  z-index: 10000;
  box-shadow: 0px 0px 10.23px 0px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 10px;
  z-index: 19900;

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
      width: 60%;
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
      color: var(--primary-text);
      background: var(--secondary-bg);
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
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 425px;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

  }
  // 修改桌面图标分组样式
  .item-box>div{
    width: 123px !important;
    margin-bottom: 8px;
  }
}
</style>
