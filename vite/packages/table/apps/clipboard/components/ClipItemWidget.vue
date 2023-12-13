<script lang="ts">
import ClipCodemirror from "./clipPreview/ClipCodemirror.vue";
import textCodeMirror from "./clipPreview/textCodeMirror.vue";
import {formatFileSize, getDateTime} from '../../../util'
import {clipboardStore} from "../store";
import {mapActions} from "pinia";
import {message} from "ant-design-vue";
import browser from "../../../js/common/browser";
import _ from 'lodash-es'
import ClipMenuList from "./ClipMenuList.vue";

export default {
  name: "ClipItemWidget",
  props: ['clipItem', 'menuList'],
  emits: ['tabChanged'],
  components: {ClipMenuList, textCodeMirror, ClipCodemirror},
  data() {
    return {
      // 控制操作界面的显示
      tab: 'item',//item menu
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  computed: {
    timeText() {
      const time = getDateTime(new Date(this.clipItem.createTime))
      return `${time.hours}:${time.minutes}:${time.seconds}` + '&nbsp;&nbsp;&nbsp;' + `${time.month}月${time.day}日`
    },
    capacity() {
      switch (this.clipItem.type) {
        case 'text':
          return this.clipItem.content.length + '个字符'
        case 'file':
          return this.clipItem.files?.length + '个文件'
        case 'image':
        case 'audio':
        case 'video':
          return formatFileSize(this.clipItem.size)
      }
    },
    itemType() {
      const type = this.clipItem.type
      switch (type) {
        case 'text':
          return {
            icon: 'text-align-left',
            title: '文本'
          }
        case 'image':
          return {
            icon: 'image',
            title: '图片'
          }
        case 'file':
          return {
            icon: 'file',
            title: '文件'
          }
        case 'video':
          return {
            icon: 'video',
            title: '视频'
          }
        case 'audio':
          return {
            title: '音频',
            icon: 'erji1'
          }
      }
    }
  },
  methods: {
    ...mapActions(clipboardStore, ['remove', 'addToCollection', 'setClipboard']),
    backClip() {
      this.tab = 'item'
    },
    showMenu() {
      this.tab = 'menu'
    },
    hideMenu(){
      this.tab='item'
    },
    switchTab(tab) {
      this.tab = tab
      if (tab !== 'other') {
        this.$emit('tabChanged', {tab: tab})
      }
    },
    previewItem(event) {
      this.$emit('previewItem', event)
    }
  }
}
</script>

<template>
  <div style="width: 338px;height:420px;flex-shrink: 0; " v-if="tab === 'item'"
       class="flex flex-col rounded-lg justify-between " @contextmenu="switchTab('menu')">
    <!-- 文本卡片顶部标题开始 -->
    <div class="flex h-item flex-col h-16 rounded-t-lg w-full px-4 py-2">
      <div class="flex items-center mb-1">
        <Icon :icon="itemType.icon" style="font-size: 1.45em;"></Icon>
        <span class="ml-2">{{ itemType.title }}</span>
        <span class="xt-text-2 ml-2"># {{ clipItem.index }}</span>
      </div>
      <div class="pl-2 flex justify-between content-text xt-text-2">
        <span class="time-bg" v-html="timeText"></span>
        <span class="time-bg">
        <slot name="capacity">{{ capacity }}</slot>
        </span>
      </div>
    </div>
    <!-- 文本卡片顶部标题结束 -->
    <div class="flex-center">
      <slot name="body">
      </slot>
    </div>

    <!-- 文本底部切换 -->
    <div class="flex  h-item py-1 px-1 h-12 rounded-b-lg items-center justify-between">
      <slot name="footer">
      </slot>
    </div>
  </div>
  <!-- 操作界面 -->
  <div v-else-if="tab==='menu'" style="width: 338px;height:420px;">
    <div class="flex  flex-col rounded-lg px-4 py-3 h-full default-content">
      <div class="flex mb-3">
        <div class="w-12  button-active bt-default h-12 rounded-lg pointer flex items-center justify-center"
             @click="backClip">
          <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
        </div>
        <div class="flex items-center mx-24 justify-center">
          <span>操作</span>
        </div>
      </div>
      <!-- 快捷键按钮 -->
      <div class="flex flex-col">
        <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
          <template v-if="tab==='menu'">
            <ClipMenuList @clickItem="hideMenu" @previewItem="previewItem" :clip-item="clipItem"></ClipMenuList>
          </template>
          <!-- 代码语言切换界面 -->

        </vue-custom-scrollbar>
      </div>
    </div>

  </div>
  <slot v-else-if="tab==='other'" name="otherTabs">
  </slot>

</template>

<style scoped lang="scss">
.flex-center {
  display: flex;
  flex: 1;
  height: 0;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  flex-direction: column;
}
</style>
