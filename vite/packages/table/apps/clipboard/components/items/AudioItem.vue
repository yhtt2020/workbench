<script lang="ts">
import ClipItemWidget from "../ClipItemWidget.vue";
import ClipCodemirror from "../clipPreview/ClipCodemirror.vue";
import textCodeMirror from "../clipPreview/textCodeMirror.vue";
import {codeLanguage} from '../../../../js/data/clipTheme.js'
import {mapWritableState} from "pinia";
import {clipboardStore} from "../../store";
import ClipVideo from "../parser/ClipVideo.vue";
import ClipAudio from "../parser/ClipAudio.vue";


export default {
  props: ['clipItem'],
  components: {ClipAudio, ClipVideo, textCodeMirror, ClipCodemirror, ClipItemWidget},
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
    previewItem(item){
      this.$emit('previewItem',item)
    }

  }
}


</script>

<template>
  <ClipItemWidget @previewItem="previewItem" ref="widget" @tabChanged="tabChanged" :menu-list="menuList" :clipItem="clipItem">
    <template #body>
      <!-- 纯文本情况下 -->
      <ClipAudio :fileUrl="clipItem.filepath" class="flex items-center justify-center"
                 style="width:302px;height:148px;"></ClipAudio>
    </template>
    <template #footer>

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
