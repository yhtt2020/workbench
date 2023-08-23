<script lang="ts">
import ClipItemWidget from "../ClipItemWidget.vue";
import ClipCodemirror from "../../../components/clipPreview/ClipCodemirror.vue";
import textCodeMirror from "../../../components/clipPreview/textCodeMirror.vue";
import {codeLanguage} from '../../../js/data/clipTheme.js'
import {mapWritableState} from "pinia";
import {clipboardStore} from "../../../store/clipboard";

const textTypes = [
  {title: '纯文本', icon: 'ziyuan', name: 'text', id: 0},
  {
    title: '代码块', icon: 'daima', name: 'code', id: 1
  }
]
export default {
  props: ['clipItem'],
  components: {textCodeMirror, ClipCodemirror, ClipItemWidget},
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
      <div class="flex  flex-1 text-md" v-if="textDisplayType.name === 'text'">
        <textCodeMirror :editorContent="clipItem.content"></textCodeMirror>
      </div>
      <!-- 代码高亮情况下 -->
      <div v-if="textDisplayType.name === 'code'" class="flex-1 w-full">
        <ClipCodemirror :editorContent="clipItem.content" class="w-full"></ClipCodemirror>
      </div>
    </template>
    <template #footer>
      <div v-for="(item) in textDisplayTypes" :class="textDisplayType.name === item.name ? 's-active':''"
           class="flex items-center justify-center py-2.5 px-4  pointer rounded-lg w-1/2 " style="position: relative"
           @click.stop="selectItem(item)" @tabClick="openCode"
      >
        <Icon :icon="item.icon" style="font-size: 1.45em;"></Icon>
        <span class="ml-2 mr-2">{{ item.title }}</span>
        <Icon icon="xiangyou" class="pointer" v-if="textDisplayType.name==='code' && item.name==='code'"
              style="font-size: 1.25em;position: absolute;right:15px"></Icon>
      </div>
    </template>
    <template #otherTabs>
      <div v-if="tab==='lang'" style="width: 338px;height:420px;" class="flex flex-col">
        <div class="p-4 h-full flex flex-col">
          <div class="flex justify-between items-center mb-3">
            <div class="w-12 h-12 pointer  rounded-lg button-active bt-default  flex items-center justify-center"
                 @click="switchTab('item')">
              <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
            </div>
            <span class="title-text">语言</span>
            <div class="w-12 h-12 pointer rounded-lg button-active bt-default flex items-center justify-center"
                 @click="openClipSet">
              <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>
            </div>

          </div>
          <!-- 代码块语言包切换列表 -->
          <div class="flex flex-col" style="flex:1;height:0">
            <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
              <div v-for="item in codeLanguage" class="rounded-lg pointer button-active btn-list px-4 py-3 mb-2"
                   @click="clickCodeLanguage(item)">
                {{ item.title }}
              </div>
            </vue-custom-scrollbar>
          </div>
        </div>
      </div>
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
