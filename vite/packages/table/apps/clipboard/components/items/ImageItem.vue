<script lang="ts">
import ClipItemWidget from "../ClipItemWidget.vue";
import ClipCodemirror from "../clipPreview/ClipCodemirror.vue";
import textCodeMirror from "../clipPreview/textCodeMirror.vue";
import {codeLanguage} from '../../../../js/data/clipTheme.js'
import {mapWritableState} from "pinia";
import {clipboardStore} from "../../store";
import XtButton from "../../../../ui/libs/Button/index.vue";
import {EditOutlined} from '@ant-design/icons-vue'

export default {
  props: ['clipItem'],
  components: {XtButton, textCodeMirror, ClipCodemirror, ClipItemWidget,EditOutlined},
  computed: {
    ...mapWritableState(clipboardStore, ['settings']),
    textDisplayTypes() {
      if (this.settings.codeHighlight) {
        const newTextArr = textTypes.slice()  // 将文本底部tab数组复制一份
        this.textType = newTextArr.reverse()  // 将复制的文本底部tab数组进行反转
      } else {
        this.textType = textTypes.slice()
      }
      this.textDisplayType = this.textType[0]
      return this.textType
    },
  },
  watch :{
    'settings.codeHighlight':{
      handler(){
        this.textType.reverse()
        this.textDisplayTypes=this.textType[0]
      }
    }
  },
  data() {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      codeLanguage,
      textDisplayType: {
        name: 'text'
      },
      tab: '',
      menuList: [],
      // 文本底部切换
      textType: [],

    }
  },
  methods: {
    tabChanged(event) {
      if (event.tab === 'lang') {
        this.tab = 'lang'
      } else {
        this.tab = ''
      }
    },
    editImage(){
      this.$emit('previewItem',{
        item:this.clipItem,
        action:'editImage'
      })
    },
    handleImage(){
      const args={
        type:'image',
        args:{
          'filePath':this.clipItem.path
        }
      }
      ipc.send('handleFileAssign',args)
      console.log('发送handle',args)
    },
    // 文本底部tab切换
    selectItem(item) {
      if (this.textDisplayType.name === 'code' && item.name === 'code') {
        this.$refs.widget.switchTab('other')
        this.tab = 'lang'
      }
      this.textDisplayType = item

      // if (this.firstSwitch) {  // 判断是否第一次切换
      //   this.defaultTextType = item
      //   this.firstSwitch = false
      // } else {
      //   if (item.id === 1) {  // 切换以后id是否为1
      //     this.$emit('tabClick', this.openCode())
      //   } else {  // 再次切换为第一项
      //     this.defaultTextType = item
      //     this.firstSwitch = true
      //   }
      // }
    },
    switchTab(tab) {
      this.$refs.widget.switchTab('item')
    },
    previewItem(){
      this.$emit('previewItem', {item:this.clipItem})
    }

  }
}


</script>

<template>
  <ClipItemWidget @previewItem="previewItem" ref="widget" @tabChanged="tabChanged" :menu-list="menuList" :clipItem="clipItem">
    <template #body>
      <!-- 纯文本情况下 -->
      <img  @click="previewItem"   :src="clipItem.path" alt="" class=" w-full h-full pointer  object-scale-down">
    </template>
    <template #footer>
      <div class="p-1 w-full">
        <div class="flex items-center justify-center" style="gap:20px" >
          <a-tooltip title="直接编辑">
            <xt-button type="theme" size="mini" :w="40" :h="32" @click="editImage"> <EditOutlined></EditOutlined></xt-button>
          </a-tooltip>
          <a-tooltip title="图片编辑器轻应用">
            <xt-button size="mini" :w="40" :h="32" @click="handleImage">  <a-avatar  src="https://a.apps.vip/imageEditor/icon.svg"></a-avatar></xt-button>
          </a-tooltip>
        </div>
      </div>
    </template>
    <template #otherTabs>

    </template>
  </ClipItemWidget>
</template>

<style scoped lang="scss">
// 切换状态
.s-active {
  background: var(--active-bg);
  color: var(--active-text);
}

// 按钮默认色
.bt-default {
  background: var(--primary-bg);
  color: var(--primary-text);
}

.default-content {
  background: var(--main-bg);
}

// 按钮触发状态
.button-active {
  &:active {
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.1);
  }

  &:hover {
    background: rgba(42, 42, 42, 0.1);
  }
}

// 列表
.btn-list {
  background: var(--primary-bg);
}

</style>
