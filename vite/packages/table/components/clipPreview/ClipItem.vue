<template>
  <!-- 文本列表 -->
  <template v-if="clipItem.type === 'text'">
    <TextItem @previewItem="previewItem" :clip-item="clipItem"></TextItem>
<!--    &lt;!&ndash; 列表主界面 &ndash;&gt;-->
<!--    <div style="width: 338px;height:420px;flex-shrink: 0; " v-if="controlsShow === false && codeLanguageShow === false"-->
<!--         class="flex flex-col rounded-lg justify-between " @contextmenu="textButton">-->
<!--      &lt;!&ndash; 文本卡片顶部标题开始 &ndash;&gt;-->
<!--      <div class="flex s-item h-item flex-col h-16 rounded-t-lg w-full px-4 py-2">-->
<!--        <div class="flex items-center mb-1">-->
<!--          <Icon :icon="getType(clipItem.type).icon" style="font-size: 1.45em;"></Icon>-->
<!--          <span class="ml-2">{{ getType(clipItem.type).title }}</span>-->
<!--        </div>-->
<!--        <div class="flex justify-between content-text">-->
<!--          <span class="time-bg" v-html="timeText"></span>-->
<!--          <span class="time-bg">{{ clipItem.capacity }}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--      &lt;!&ndash; 文本卡片顶部标题结束 &ndash;&gt;-->

<!--      &lt;!&ndash; 纯文本情况下 &ndash;&gt;-->
<!--      <div class="flex  flex-1 text-md" v-if="defaultTextType.name === 'text'">-->
<!--        <textCodeMirror :editorContent="clipItem.content"></textCodeMirror>-->
<!--      </div>-->
<!--      &lt;!&ndash; 代码高亮情况下 &ndash;&gt;-->
<!--      <div v-if="defaultTextType.name === 'code'" class="flex-1 w-full">-->
<!--        <ClipCodemirror :editorContent="clipItem.content" class="w-full"></ClipCodemirror>-->
<!--      </div>-->

<!--      &lt;!&ndash; 文本底部切换 &ndash;&gt;-->
<!--      <div class="flex s-item h-item py-1 px-1 h-12 rounded-b-lg items-center justify-between">-->
<!--        <div v-for="(item) in showArray" :class="defaultTextType.name === item.name ? 's-active':''"-->
<!--             class="flex items-center justify-center py-2.5 px-4  pointer rounded-lg w-1/2"-->
<!--             @click.stop="selectItem(item)" @tabClick="openCode"-->
<!--        >-->
<!--          <Icon :icon="item.icon" style="font-size: 1.45em;"></Icon>-->
<!--          <span class="ml-2 mr-2">{{ item.title }}</span>-->
<!--          <Icon icon="xiangyou" class="pointer" v-if="item.title !== '纯文本' && item.title !=='代码块'"-->
<!--                style="font-size: 1.25em;"></Icon>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->


<!--    &lt;!&ndash; 操作界面 &ndash;&gt;-->
<!--    <div v-else-if="controlsShow === true" style="width: 338px;height:420px;">-->
<!--      <div class="flex s-item flex-col rounded-lg px-4 py-3 h-full default-content">-->
<!--        <div class="flex mb-3">-->
<!--          <div class="w-12 s-item button-active bt-default h-12 rounded-lg pointer flex items-center justify-center"-->
<!--               @click="backClip">-->
<!--            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>-->
<!--          </div>-->
<!--          <div class="flex items-center mx-24 justify-center">-->
<!--            <span>操作</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 快捷键按钮 &ndash;&gt;-->
<!--        <div class="flex flex-col">-->
<!--          <vue-custom-scrollbar :settings="settingsScroller" style="height: 44vh;">-->
<!--            <div v-for="item in textKey" @click="keyOperation(item)"-->
<!--                 class="flex pointer justify-between s-item button-active  btn-list px-4 rounded-lg py-3 mb-2">-->
<!--              <span>{{ item.title }}</span>-->
<!--              <span>{{ item.intr }}</span>-->
<!--            </div>-->
<!--          </vue-custom-scrollbar>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->


<!--    &lt;!&ndash; 代码语言切换界面 &ndash;&gt;-->
<!--    <div v-else style="width: 338px;height:100%;" class="flex flex-col">-->
<!--      <div class="p-4 ">-->
<!--        <div class="flex justify-between items-center mb-3">-->
<!--          <div class="w-12 h-12 pointer  rounded-lg button-active bt-default  flex items-center justify-center"-->
<!--               @click="backClip">-->
<!--            <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>-->
<!--          </div>-->
<!--          <span class="title-text">语言</span>-->
<!--          <div class="w-12 h-12 pointer rounded-lg button-active bt-default flex items-center justify-center"-->
<!--               @click="openClipSet">-->
<!--            <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 代码块语言包切换列表 &ndash;&gt;-->
<!--        <div class="flex flex-col">-->
<!--          <vue-custom-scrollbar :settings="settingsScroller" style="height: 49vh;">-->
<!--            <div v-for="item in codeLanguage" class="rounded-lg pointer button-active btn-list px-4 py-3 mb-2"-->
<!--                 @click="clickCodeLanguage(item)">-->
<!--              {{ item.title }}-->
<!--            </div>-->
<!--          </vue-custom-scrollbar>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </template>
  <!-- 文本列表 -->


  <!-- 图片列表 -->
  <template v-if="clipItem.type === 'image'">

    <ImageItem  @previewItem="previewItem" :clip-item="clipItem"></ImageItem>

    <!-- 列表主界面 -->
<!--    <div style="width: 338px;height:420px;" v-if="controlsShow === false" class="flex flex-col"-->
<!--         @contextmenu="textButton">-->
<!--      &lt;!&ndash; 图片标题开始 &ndash;&gt;-->
<!--      <div class="flex s-item h-item flex-col rounded-t-lg w-full px-4 py-2">-->
<!--        <div class="flex items-center mb-1">-->
<!--          <Icon :icon="getType(clipItem.type).icon" style="font-size: 1.45em;"></Icon>-->
<!--          <span class="ml-2">{{ getType(clipItem.type).title }}</span>-->
<!--        </div>-->
<!--        <div class="flex justify-between">-->
<!--          <span class="time-bg">{{ timeText }}</span>-->
<!--          <span class="time-bg">{{ clipItem.capacity }}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--      &lt;!&ndash; 图片标题结束 &ndash;&gt;-->

<!--      &lt;!&ndash; 图片内容开始 &ndash;&gt;-->
<!--&lt;!&ndash;      <div class="flex px-5 pt-20 pb-20 items-center ">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="rounded-lg flex flex-col" v-if="img">&ndash;&gt;-->
<!--&lt;!&ndash;          <a-image :src="img" alt="" class="rounded-lg w-full h-full  object-cover"></a-image>&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash; <span class="pt-5 text-center">{{ clip.name }}</span> &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--      &lt;!&ndash; 图片内容结束 &ndash;&gt;-->

<!--    </div>-->

<!--    &lt;!&ndash; 图片操作界面 &ndash;&gt;-->
<!--    <div v-else-if="controlsShow === true" style="width: 338px;height:420px;">-->
<!--      <div class="flex  flex-col px-4 py-3 rounded-lg">-->
<!--        <div class="flex mb-3">-->
<!--          <div class="w-12 bt-default button-active h-12 rounded-lg pointer flex items-center justify-center"-->
<!--               @click="backClip">-->
<!--            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>-->
<!--          </div>-->
<!--          <div class="flex  items-center  justify-center mx-24">-->
<!--            <span>操作</span>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 快捷键按钮 &ndash;&gt;-->
<!--        <div class="flex flex-col">-->
<!--          <vue-custom-scrollbar :settings="settingsScroller" style="height: 48vh;">-->
<!--            <div v-for="item in imageKey" @click="keyOperation(item)"-->
<!--                 class="flex pointer button-active justify-between s-item px-4 rounded-lg btn-list py-3 mb-2">-->
<!--              <span>{{ item.title }}</span>-->
<!--              <span>{{ item.intr }}</span>-->
<!--            </div>-->
<!--          </vue-custom-scrollbar>-->
<!--        </div>-->

<!--      </div>-->
<!--    </div>-->

  </template>
  <!-- 图片列表 -->


  <!-- 文件列表 -->
  <template v-if="clipItem.type === 'file'">
    <!-- 列表主界面 -->
    <div style="width: 338px;height:420px;" v-if="controlsShow === false" class="flex flex-col"
         @contextmenu="textButton">
      <!-- 文件标题开始 -->
      <div class="flex h-item flex-col rounded-t-lg w-full px-4 py-2">
        <div class="flex items-center mb-1">
          <Icon :icon="getType(clipItem.type).icon" style="font-size: 1.45em;"></Icon>
          <span class="ml-2">{{ getType(clipItem.type).title }}</span>
        </div>
        <div class="flex justify-between">
          <span class="time-bg">{{ timeText }}</span>
          <span class="time-bg">{{ clipItem.capacity }}</span>
        </div>
      </div>
      <!-- 文件标题结束 -->

      <!-- 文件内容开始 -->
      <div class="flex px-5 py-20 items-center  justify-center">
        <div class="flex items-center justify-center flex-col">
          <Icon :icon="clipItem.picIcon" style="font-size: 9em;"></Icon>
          <span class="py-3">{{ clipItem.content }}</span>
        </div>
      </div>
      <!-- 文件内容结束 -->

    </div>

    <!-- 文件快捷键操作界面 -->
    <div v-else-if="controlsShow === true" style="width: 338px;height:420px;">
      <div class="flex flex-col rounded-lg px-4 py-3 ">
        <div class="flex  mb-3">
          <div class="w-12 bt-default button-active  h-12 rounded-lg pointer flex items-center justify-center"
               @click="backClip">
            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
          </div>
          <div class="flex items-center  justify-center mx-24">
            <span>操作</span>
          </div>
        </div>

        <!-- 快捷键按钮 -->
        <div class="flex flex-col">
          <vue-custom-scrollbar :settings="settingsScroller" style="height:38vh;">
            <div v-for="item in imageKey" @click="keyOperation(item)"
                 class="flex pointer justify-between btn-list button-active px-4 rounded-lg py-3 mb-2">
              <span>{{ item.title }}</span>
              <span>{{ item.intr }}</span>
            </div>
          </vue-custom-scrollbar>
        </div>
      </div>
    </div>
  </template>
  <!-- 文件列表 -->


  <!-- 视频列表 -->
  <template v-if="clipItem.type === 'video'">
    <!-- 列表主界面 -->
    <div style="width: 338px;height:420px;" class="flex flex-col " v-if="controlsShow === false">
      <!-- 视频标题开始 -->
      <div class="flex h-item flex-col rounded-t-lg w-full px-4 py-2">
        <div class="flex items-center mb-1">
          <Icon :icon="getType(clipItem.type).icon" style="font-size: 1.45em;"></Icon>
          <span class="ml-2">{{ getType(clipItem.type).title }}</span>
        </div>
        <div class="flex justify-between">
          <span class="time-bg">{{ timeText }}</span>
          <span class="time-bg">{{ clipItem.capacity }}</span>
        </div>
      </div>
      <!-- 视频标题结束 -->

      <!-- 视频内容开始 -->
      <div class="flex px-5 py-20 items-center pointer flex-col justify-center" @click="textButton">
        <ClipVideo :videoUrl="clipItem.videoUrl"></ClipVideo>
      </div>
      <!-- 视频内容结束 -->
    </div>

    <!-- 视频快捷键操作界面 -->
    <div v-else-if="controlsShow === true" style="width: 338px;height:100%;">
      <div class="flex flex-col px-4 py-3 rounded-lg">
        <div class="flex  mb-3">
          <div class="w-12 bt-default button-active h-12 rounded-lg pointer flex items-center justify-center"
               @click="backClip">
            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
          </div>
          <div class="flex  items-center  justify-center mx-24">
            <span>操作</span>
          </div>
        </div>

        <!-- 快捷键按钮 -->
        <div class="flex flex-col">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 38vh;">
            <div v-for="item in imageKey" @click="keyOperation(item)"
                 class="flex pointer justify-between button-active btn-list px-4 rounded-lg py-3 mb-2">
              <span>{{ item.title }}</span>
              <span>{{ item.intr }}</span>
            </div>
          </vue-custom-scrollbar>
        </div>

      </div>
    </div>
  </template>
  <!-- 视频列表-->


  <!-- 音频列表 -->
  <template v-if="clipItem.type === 'audio'">
    <!-- 列表主界面 -->
    <div style="width: 338px;height:420px;" class="flex flex-col" v-if="controlsShow === false">
      <!-- 标题内容 -->
      <div class="flex h-item flex-col rounded-t-lg w-full px-4 py-2">
        <div class="flex items-center mb-1">
          <Icon :icon="getType(clipItem.type).icon" style="font-size: 1.45em;"></Icon>
          <span class="ml-2">{{ getType(clipItem.type).title }}</span>
        </div>
        <div class="flex justify-between">
          <span class="time-bg">{{ timeText }}</span>
          <span class="time-bg">{{ clipItem.capacity }}</span>
        </div>
      </div>

      <!-- 内容 -->
      <div class="flex px-5 py-20 " @contextmenu="textButton">
        <ClipAudio :fileUrl="clipItem.audioUrl" class="flex items-center justify-center"
                   style="width:302px;height:148px;"></ClipAudio>
      </div>
    </div>

    <!-- 快捷键操作界面 -->
    <div v-else-if="controlsShow === true" style="width: 338px;height:100%;">
      <div class="flex  flex-col px-4 py-3 rounded-lg">
        <div class="flex  mb-3">
          <div class="w-12 bt-default button-active h-12 rounded-lg pointer flex items-center justify-center"
               @click="backClip">
            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
          </div>
          <div class="flex  items-center  justify-center mx-24">
            <span>操作</span>
          </div>
        </div>

        <!-- 快捷键按钮 -->
        <div class="flex flex-col">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 44vh;">
            <div v-for="item in imageKey" @click="keyOperation(item)"
                 class="flex pointer btn-list button-active justify-between s-item px-4 rounded-lg py-3 mb-2">
              <span>{{ item.title }}</span>
              <span>{{ item.intr }}</span>
            </div>
          </vue-custom-scrollbar>
        </div>

      </div>
    </div>
  </template>
  <!-- 音频列表 -->


  <!-- 设置弹窗 -->
  <ClipSetDrawer ref="setDrawer"></ClipSetDrawer>
</template>

<script>
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import ClipSetDrawer from './ClipSetDrawer.vue'
import { toRaw } from 'vue'
import ClipCodemirror from './ClipCodemirror.vue'
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store/clipboard'
import textCodeMirror from './textCodeMirror.vue'
import ClipVideo from './ClipVideo.vue'
import ClipAudio from './ClipAudio.vue'
import { codeLanguage } from '../../js/data/clipTheme'
import ClipItemWidget from '../../apps/clipboard/ClipItemWidget.vue'
import {getDateTime} from '../../util'
import TextItem from '../../apps/clipboard/items/TextItem.vue'
import ImageItem from '../../apps/clipboard/items/ImageItem.vue'
export default {
  components: {
    ImageItem,
    TextItem,
    ClipItemWidget,
    HorzontanlPanelIcon,
    ClipCodemirror,
    textCodeMirror,
    ClipSetDrawer,
    ClipVideo,
    ClipAudio
  },
  props: {
    clipItem: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      type: {},
      img: {},

      // 控制操作界面的显示
      controlsShow: false,
      // 控制代码块界面的显示
      codeLanguageShow: false,

      // 判断文本底部切换是为首次切换
      firstSwitch: true,

      // 文本底部切换
      textType: [
        { title: '纯文本', icon: 'ziyuan', name: 'text', id: 0 },
        {
          title: '代码块', icon: 'daima', name: 'code', id: 1
        }
      ],
      defaultTextType: { title: '纯文本', icon: 'ziyuan', name: 'text' },

      // 文本键盘快捷键操作按钮
      textKey: [
        { title: '复制', intr: 'Ctrl + C', id: 'cc' },
        { title: '打开链接', intr: 'Ctrl + O', id: 'co' },
        { title: '预览', intr: 'Space', id: 's' },
        { title: '添加到收藏', intr: 'Ctrl + S', id: 'cs' },
        { title: '删除', intr: 'Delete', id: 'd' }
      ],

      // 图片快捷键操作按钮
      imageKey: [
        { title: '复制', intr: 'Ctrl + C', id: 'cc' },
        { title: '打开', intr: 'Ctrl + O', id: 'co' },
        { title: '预览', intr: 'Space', id: 's' },
        { title: '复制路径', intr: 'Ctrl + Alt + C', id: 'cac' },
        { title: '在资源管理器中打开', intr: 'Ctrl + Enter', id: 'ce' },
        { title: '添加到收藏', intr: 'Ctrl + S', id: 'cs' },
        { title: '删除', intr: 'Delete', id: 'd' }
      ],

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },

      // 代码块语言包切换
      codeLanguage,

    }
  },

  computed: {
    ...mapWritableState(clipboardStore, ['previewShow', 'clipSetShow', 'settings']),
    showArray () {
      if (!this.clipItem.showType) {
        if (this.clipSetShow) {
          const newTextArr = this.textType.slice()  // 将文本底部tab数组复制一份
          this.clipItem.showType = newTextArr.reverse()  // 将复制的文本底部tab数组进行反转
        } else {
          this.clipItem.showType = this.textType  // 返回文本底部tab没有改变的数组
        }
        this.defaultTextType = this.clipItem.showType[0]
      }
      return this.clipItem.showType
    },
    timeText () {
      const time = getDateTime(new Date(this.clipItem.createTime))
      return `${time.hours}:${time.minutes}:${time.seconds}` + '&nbsp;&nbsp;&nbsp;' + `${time.month}月${time.day}日`
    }
  },

  watch: {
    'clipItem': {
      handler () {
        this.refresh()
      }
    },
    'defaultTextType': {
      handler () {
        this.defaultTextType = this.defaultTextType
      },
      immediate: true,
    },
  },

  mounted () {
    window.addEventListener('keydown', this.clipKeyDown)
  },

  methods: {
    ...mapActions(clipboardStore, ['changeClipMode', 'isOpenPreview']),
    refresh () {

      this.type = this.getType(this.clipItem.type)
      this.capacity = this.clipItem.content.length + '个字符'
      if (this.clipItem.type === 'image') {
        this.img = toRaw(this.clipItem.content).toDataURL()
      }
    },
    getType (type) {
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

    },
    // 鼠标右键触发
    textButton () {
      this.controlsShow = true
    },
    // 返回按钮
    backClip () {
      this.controlsShow = false
      this.codeLanguageShow = false
    },


    // 键盘快捷键触发
    clipKeyDown (e) {
      // 打开预览快捷键功能
      if (e.keyCode === 32) {
        if (this.controlsShow) {
          console.log('按下key',e.keyCode)
          this.$emit('previewItem', this.clipItem)  // 模板搭建测试,后期需要根据剪切板的id来触发预览
          this.isOpenPreview(true)
          this.controlsShow = false
        }
      }
    },

    // 快捷键按钮触发
    keyOperation (item) {
      switch (item.id) {
        case 'cc':
          message.success('复制成功')
          console.log('复制', this.clipItem)
          break
        case 'co':
          console.log('打开链接')
          message.success('打开链接')
          break
        case 's':
          message.success('预览')
          this.$emit('previewItem', this.clipItem)

          // console.log(this.clip);
          this.isOpenPreview(true)
          break
        case 'cs':
          message.success('添加收藏')
          console.log('添加收藏')
          break
        case 'd':
          message.success('删除')
          console.log('删除')
          break
        case 'ce':
          message.success('资源管理器打开')
          console.log('资源管理打开')
          break
        case 'cac':
          message.success('复制路径')
          console.log('复制路径')
          break
      }
    },
    previewItem(item){
      console.log('猫盘',item)
      this.$emit('previewItem',item)
    },
    // 打开代码块语言包切换界面
    openCode () {
      this.codeLanguageShow = true
    },

    // 代码块语言包切换的回调事件
    clickCodeLanguage (item) {
      this.changeClipMode(item.abbr) // 将代码块语言包进行替换的方法
      this.defaultTextType.title = item.title
      this.codeLanguageShow = false
    },

    // 打开设置
    openClipSet () {
      this.$refs.setDrawer.clipOpenShow()
    },
  },
}
</script>

<style lang="scss" scoped>
// 标题
.h-item {
  background: var(--primary-bg);
}



// 隐藏滚动条
:deep(.ps__thumb-y) {
  display: none !important;
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

:deep(.ant-image) {
  width: 100%;
  height: 185px;
}

.time-bg {
  color: var(--secondary-text);
}

:deep(.CodeMirror) {
  height: 310px !important;
}
</style>
