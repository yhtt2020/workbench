<script lang="ts">
import ClipCodemirror from "./clipPreview/ClipCodemirror.vue";
import textCodeMirror from "./clipPreview/textCodeMirror.vue";
import {formatFileSize, getDateTime} from '../../../util'
import {clipboardStore} from "../store";
import {mapActions} from "pinia";
import {message} from "ant-design-vue";
import browser from "../../../js/common/browser";

export default {
  name: "ClipItemWidget",
  props: ['clipItem', 'menuList'],
  emits: ['tabChanged'],
  components: {textCodeMirror, ClipCodemirror},
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

      menuList: [
        {
          title: '复制', shortKeys: 'Ctrl + C', id: 'cc', fn: (item) => {
            require('electron').clipboard.writeText(item.content)
            message.success('复制成功。')
          }
        },
        {
          title: '打开链接', shortKeys: 'Ctrl + O', id: 'co', fn: (item) => {
            const str = item.content
// 提取file协议和http协议的URL

            const regex = /((file|http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;

            const urls = str.match(regex);
            if (!urls) {
              message.error('不存在链接')
            } else {
              browser.openInUserSelect(urls[0])
              message.success('打开链接成功。')
            }
            console.log(urls, '匹配到的url')


// 打印提取到的URL

          }
        },
        {
          title: '预览', shortKeys: 'Space', id: 's', fn: (item) => {
            console.log('预览内容', item)
            this.previewItem(item)
          }
        },
        {
          title: '添加到收藏', shortKeys: 'Ctrl + S', id: 'cs', fn: (item) => {
            this.addToCollection(item)
            message.success('添加收藏成功。')
          }
        },
        {
          title: '删除', shortKeys: 'Delete', id: 'd', fn: (item) => {
            this.remove(item)
            message.success("删除成功。")
          }
        }
      ]
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
          return this.clipItem.files.length +'个文件'
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
    ...mapActions(clipboardStore, ['remove', 'addToCollection']),
    backClip() {
      this.tab = 'item'
    },
    showMenu() {
      this.tab = 'menu'
    },
    switchTab(tab) {
      this.tab = tab
      if (tab !== 'other') {
        this.$emit('tabChanged', {tab: tab})
      }
    },
    previewItem(item) {
      this.$emit('previewItem', item)
    }
  }
}
</script>

<template>
  <div style="width: 338px;height:420px;flex-shrink: 0; " v-if="tab === 'item'"
       class="flex flex-col rounded-lg justify-between " @contextmenu="switchTab('menu')">
    <!-- 文本卡片顶部标题开始 -->
    <div class="flex s-item h-item flex-col h-16 rounded-t-lg w-full px-4 py-2">
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
    <div class="flex-center"   >
      <slot name="body">
      </slot>
    </div>

    <!-- 文本底部切换 -->
    <div class="flex s-item h-item py-1 px-1 h-12 rounded-b-lg items-center justify-between">
      <slot name="footer">
      </slot>
    </div>
  </div>
  <!-- 操作界面 -->
  <div v-else-if="tab==='menu'" style="width: 338px;height:420px;">
    <div class="flex s-item flex-col rounded-lg px-4 py-3 h-full default-content">
      <div class="flex mb-3">
        <div class="w-12 s-item button-active bt-default h-12 rounded-lg pointer flex items-center justify-center"
             @click="backClip">
          <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
        </div>
        <div class="flex items-center mx-24 justify-center">
          <span>操作</span>
        </div>
      </div>
      <!-- 快捷键按钮 -->
      <div class="flex flex-col">
        <vue-custom-scrollbar :settings="settingsScroller" style="height: 44vh;">
          <template v-if="tab==='menu'">
            <div v-for="item in menuList" @click="item.fn(clipItem)"
                 class="flex pointer justify-between s-item button-active  btn-list px-4 rounded-lg py-3 mb-2">
              <span>{{ item.title }}</span>
              <span>{{ item.shortKeys }}</span>
            </div>
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
.flex-center{
  display: flex;
  flex:1;height: 0;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  flex-direction: column;
}
</style>
