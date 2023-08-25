<script lang="ts">
import ClipItemWidget from "../ClipItemWidget.vue";
import ClipCodemirror from "../../../components/clipPreview/ClipCodemirror.vue";
import textCodeMirror from "../../../components/clipPreview/textCodeMirror.vue";
import {codeLanguage} from '../../../js/data/clipTheme.js'
import {mapWritableState} from "pinia";
import {clipboardStore} from "../../../store/clipboard";
import {FileOutlined} from '@ant-design/icons-vue'
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
export default {
  props: ['clipItem'],
  components: {VueCustomScrollbar, textCodeMirror, ClipCodemirror, ClipItemWidget,FileOutlined},
  computed: {
    ...mapWritableState(clipboardStore, ['settings']),
  },
  watch: {
    'settings.codeHighlight': {
      handler() {
        this.textType.reverse()
        this.textDisplayTypes = this.textType[0]
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
    previewItem(item) {
      this.$emit('previewItem', item)
    }

  }
}


</script>

<template>
  <ClipItemWidget @previewItem="previewItem" ref="widget" @tabChanged="tabChanged" :menu-list="menuList"
                  :clipItem="clipItem">
    <template #body>
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;width: 100%" >
        <a-row  class=" m-1 line" v-for="file in clipItem.files">
          <a-col class="text-left pt-1" :span="2">
            <file-outlined style="font-size: 18px" />
          </a-col>
          <a-col :span="21">
            {{file}}
          </a-col>

        </a-row>
      </vue-custom-scrollbar>
<!--      {{clipItem.files}}-->

    </template>
    <template #footer>

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
.line{
  border-bottom: 1px dashed var(--secondary-text);
}
</style>
