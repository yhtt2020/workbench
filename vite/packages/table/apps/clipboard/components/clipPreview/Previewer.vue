<template>
  <transition name="fade">
    <div v-if="previewShow" class="preview-container">
      <div class="flex justify-between p-3 w-full h-full">
        <!-- 文本预览模块 -->
        <template v-if="previewContent.type === 'text'">
          <!-- 文本预览左侧 -->
          <div class="flex flex-col w-full justify-between h-full">
            <!-- 关闭预览按钮 -->
            <div class="mb-3 no-drag  pointer" @click="closePreview">
              <div class="w-12 h-12  rounded-lg s-item flex items-center justify-center">
                <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
              </div>
            </div>
            <div class="flex items-center justify-center grow pr-5 pl-2 mb-3">
              <template v-if="defaultText.name === 'plainText'">
                <textCodeMirror :editorContent="previewContent.content" class="w-full"></textCodeMirror>
              </template>
              <template v-else>
                <ClipCodemirror ref="myClipCodeMirror" class="w-full"
                                :editorContent="previewContent.content"></ClipCodemirror>
              </template>
            </div>
            <!-- 底部tab切换 -->
            <div class="flex items-center justify-center">
              <HorizontalPanel :navList="textType" v-model:selectType="defaultText"></HorizontalPanel>
              <div class="flex ml-3 py-3 px-4 pointer items-center rounded-lg justify-center"
                   style="background: var(--secondary-bg);" @click="openCodeLanguage" v-if="defaultText.name === 'code'"
              >
                <span class="mr-5 type-right">
                  {{ language.title }}
                </span>
                <Icon icon="xiangxia" style="font-size: 1.25em;"></Icon>
              </div>
            </div>
          </div>

          <!-- 文本预览右侧 -->
          <div class="pl-6 flex flex-col justify-between" style="width: 352px;border-left: 1px solid var(--divider);">
            <div class="flex flex-col">
              <PreviewDetail :preview-content="previewContent"></PreviewDetail>
            </div>
            <div class="flex  flex-col justify-between">
              <ClipMenuList  :hidePreview="true"   :clip-item="previewContent"></ClipMenuList>
            </div>
          </div>
        </template>


        <!-- 图片预览模块 -->
        <template v-else-if="previewContent.type === 'image'">
          <!-- 图片预览左侧 -->
          <div class="flex flex-col w-full">
            <!-- 关闭预览按钮 -->
            <div class="mb-3 no-drag  pointer" @click="closePreview">
              <div class="w-12 h-12  rounded-lg s-item flex items-center justify-center">
                <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
              </div>
            </div>

            <!-- 内容预览区域 -->
            <div class="flex h-full w-full flex-col justify-center items-center" style="flex:1;height: 0">
              <div class="clip-image rounded-lg  h-full mr-2 " style="position: relative;overflow: hidden;width: calc(100% - 20px)">
                <template v-if="editImage">
                  <ImageEditor @abort="editImage=false" :filepath="previewContent.path"></ImageEditor>
                </template>
                <div v-else>
                  <a-image :src="previewContent.path" alt="" class="w-full rounded-lg h-full object-cover"></a-image>
                </div>
              </div>
              <div v-if="!editImage" class="m-2 text-center" style="position:absolute;bottom:10px">
                <xt-button type="theme" @click="doEditImage"><EditOutlined /> 编辑</xt-button>
              </div>
            </div>
          </div>

          <!-- 图片预览右侧 -->
          <div class="pl-6 flex flex-col justify-between" style="width: 352px;border-left: 1px solid var(--divider);">
            <vue-custom-scrollbar :settings="settingsScroller" style="height:100vh;">
              <div class="flex flex-col h-full justify-between">
                <div class="flex flex-col">
                  <PreviewDetail :preview-content="previewContent"></PreviewDetail>
                </div>
                <div class="flex  flex-col justify-between">
                  <ClipMenuList :hidePreview="true"   :clip-item="previewContent"></ClipMenuList>
                </div>
              </div>
            </vue-custom-scrollbar>
          </div>
        </template>


        <!-- 文件预览模块 -->
        <template v-else-if="previewContent.type === 'file'">
          <div class="flex flex-col w-full">
            <!-- 关闭预览按钮 -->
            <div class="mb-3 no-drag  pointer" @click="closePreview">
              <div class="w-12 h-12  rounded-lg s-item flex items-center justify-center">
                <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
              </div>
            </div>

            <!-- 内容预览 -->
            <div class="flex h-full flex-col justify-between">
              <div class="flex items-center h-full justify-center p-10">
                <Icon :icon="previewContent.picIcon" style="font-size: 20em;"></Icon>
              </div>
            </div>
          </div>
          <div class="pl-6 flex flex-col justify-between" style="width: 352px;border-left: 1px solid var(--divider);">
            <vue-custom-scrollbar :settings="settingsScroller" style="height:100vh;">
              <div class="flex flex-col justify-between h-full">
                <div class="flex flex-col">
                  <PreviewDetail :preview-content="previewContent"></PreviewDetail>
                </div>
                <div class="flex  flex-col justify-between">
                  <div class="flex  flex-col justify-between">
                    <ClipMenuList  :hidePreview="true"   :clip-item="previewContent"></ClipMenuList>
                  </div>
                </div>
              </div>
            </vue-custom-scrollbar>
          </div>
        </template>


        <!-- 视频预览模块 -->
        <template v-else-if="previewContent.type === 'video'">
          <div class="flex flex-col w-full">
            <!-- 关闭预览按钮 -->
            <div class="mb-3 no-drag  pointer" @click="closePreview">
              <div class="w-12 h-12  rounded-lg s-item flex items-center justify-center">
                <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
              </div>
            </div>

            <!-- 内容预览 -->
            <div class="flex h-full flex-col items-center justify-center">
              <ClipVideo :playerProps="{ playbackRate: [0.5, 0.75, 1, 1.5, 2],}" :videoUrl="previewContent.filepath" class="middle-clip rounded-lg"></ClipVideo>
            </div>
          </div>
          <div class="pl-6 flex flex-col justify-between" style="width: 352px;border-left: 1px solid var(--divider);">
            <vue-custom-scrollbar :settings="settingsScroller" style="height:100vh;">
              <div class="flex flex-col justify-between h-full">
                <div class="flex flex-col">
                  <PreviewDetail :preview-content="previewContent"></PreviewDetail>
                </div>
                <div class="flex  flex-col justify-between">
                  <div class="flex  flex-col justify-between">
                    <ClipMenuList  :hidePreview="true"   :clip-item="previewContent"></ClipMenuList>
                  </div>
                </div>
              </div>
            </vue-custom-scrollbar>
          </div>
        </template>


        <!-- 音频预览模块 -->
        <template v-else-if="previewContent.type === 'audio'">
          <div class="flex flex-col w-full">
            <!-- 关闭预览按钮 -->
            <div class="mb-3 no-drag  pointer" @click="closePreview">
              <div class="w-12 h-12  rounded-lg s-item flex items-center justify-center">
                <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
              </div>
            </div>

            <!-- 内容预览 -->
            <div class="flex h-full flex-col items-center justify-center">
              <ClipAudio :fileUrl="previewContent.filepath" class="w-1/2"></ClipAudio>
            </div>

          </div>
          <div class="pl-6 flex flex-col justify-between" style="width: 352px;border-left: 1px solid var(--divider);">
            <vue-custom-scrollbar :settings="settingsScroller" style="height:100vh;">
              <div class="flex flex-col h-full justify-between">
                <div class="flex flex-col">
                  <PreviewDetail :preview-content="previewContent"></PreviewDetail>
                </div>
                <div class="flex n-drag flex-col justify-between">
                  <div class="flex  flex-col justify-between">
                    <ClipMenuList  :hidePreview="true"   :clip-item="previewContent"></ClipMenuList>
                  </div>
                </div>
              </div>
            </vue-custom-scrollbar>
          </div>
        </template>


      </div>
    </div>
  </transition>

  <!-- 语言包切换弹窗设置 -->
  <HorizontalDrawer ref="previewRef" :drawerTitle="defaultTitle" :rightSelect="codeLanguage"
                    v-model:selectRegion="language.id" @getArea="getArea"></HorizontalDrawer>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store'
import { codeLanguage } from '../../../../js/data/clipTheme'
import ClipCodemirror from './ClipCodemirror.vue'
import HorizontalPanel from '../../../../components/HorizontalPanel.vue'
import textCodeMirror from './textCodeMirror.vue'
import HorizontalDrawer from '../../../../components/HorizontalDrawer.vue'
import ClipVideo from '../parser/ClipVideo.vue'
import ClipAudio from '../parser/ClipAudio.vue'
import { getDateTime } from '../../../../util'
import { message, Modal } from 'ant-design-vue'
import ImageEditor from './ImageEditor.vue'
import XtButton from '../../../../ui/libs/Button/index.vue'
import {EditOutlined} from '@ant-design/icons-vue'
import ClipMenuList from '../ClipMenuList.vue'
import PreviewDetail from '../previewDetail.vue'
export default {
  components: {
    PreviewDetail,
    ClipMenuList,
    XtButton,
    ImageEditor,
    ClipCodemirror,
    HorizontalPanel,
    textCodeMirror,
    HorizontalDrawer,
    ClipVideo,
    ClipAudio,
    EditOutlined
  },
  props: {
    previewContent: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      editImage:false,
      // 预览代码块类型切换
      textType: [
        { title: '纯文本', name: 'plainText' },
        { title: '代码块', name: 'code' }
      ],
      // 默认的预览代码块类型
      defaultText: { title: '纯文本', name: 'plainText' },
      // 代码块语言包选项
      codeLanguage,
      defaultTitle: '语言',
      // 文本预览快捷键操作
      textClipKey: [
        {
          title: '复制', key: 'Ctrl + C', id: 'cs', fn: (item) => {
            require('electron').clipboard.writeText(item.content)
            message.success('复制成功。')
          }
        },
        { title: '打开链接', key: 'Ctrl + O', id: 'co' },
        {
          title: '添加收藏', key: 'Ctrl + S', id: 'cs', fn: (item) => {
            this.addToCollection(item)
            message.success('添加收藏成功。')
          }
        },
        {
          title: '删除', key: 'Delete', id: 'd', fn: (item) => {
            this.remove(item)
            message.success('删除成功。')
          }
        }
      ],
      // 其他文件预览快捷键
      fileClipKey: [
        { title: '复制', key: 'Ctrl + C', id: 'cs' },
        { title: '打开', key: 'Ctrl + O', id: 'co' },
        { title: '编辑', key: 'Ctrl + e', id: 'ed' ,
          fn:(item)=>{
            this.doEditImage()
          }},
        { title: '复制路径', key: 'Ctrl + Alt + C', id: 'cas' },
        { title: '在资源管理器中打开', key: 'Ctrl + Enter', id: 'ce' },
        { title: '添加收藏', key: 'Ctrl + S', id: 'cs' },
        { title: '删除', key: 'Delete', id: 'd' }
      ],
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
    ...mapWritableState(clipboardStore, ['settings', 'previewShow', 'clipMode']),

    language () {
      const index = this.codeLanguage.find(el => {
        return el.abbr === this.settings.clipMode
      })
      return index
    },
    ext(){
      return require('path').extname(this.previewContent.path)
    }
  },

  mounted () {
  },

  methods: {
    ...mapActions(clipboardStore, ['isOpenPreview', 'changeClipMode', 'addToCollection', 'remove']),

    // 关闭预览全屏窗口
    closePreview () {
      if(this.editImage){
        Modal.confirm({
          content:'退出预览会丢弃未保存的编辑内容，是否确定？',
          centered:true,
          onOk:()=>{
            this.editImage=false
            this.isOpenPreview(false)
          }
        })
      }else{
        this.isOpenPreview(false)
      }

    },
    // 打开语言包选项配置
    openCodeLanguage () {
      this.$refs.previewRef.openDrawer()
    },
    getArea (v) {
      this.changeClipMode(v.abbr)
      // this.$refs.myClipCodeMirror.$forceUpdate()
    },
    doEditImage(){
      this.editImage=true
    }
  },

  watch: {
    'defaultText': {
      handler () {
        this.defaultText = this.defaultText
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
.preview-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--main-mask-bg);
  backdrop-filter: blur(60px);
}

.type-text {

  font-size: 16px;
  color: var(--secondary-text);
  font-weight: 400;
}

.s-item {
  &:hover{
    opacity: 0.7;
  }
  background: var(--secondary-bg);
  color: var(--primary-text);
  cursor: pointer;
}

.type-right {

  font-size: 16px;
  color: var(--primary-text);
  font-weight: 400;
}

:deep(.CodeMirror) {
  height: calc(100% - 20px) !important;
}

.clip-image {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.middle-clip {
  max-width: 800px;

}


@media screen and (max-width: 840px) {
  .clip-image {
    width: calc(100% / 1.2);
  }
  .middle-clip {
    width: calc(100% / 1.2);
  }
  :deep(.CodeMirror) {
    width: 500px !important;
    height: 480px !important;
  }
}

@media screen and (min-width: 841px) and (max-width: 1140px) {
  .clip-image {
    width: calc(100% / 1.25);
  }
  .middle-clip {
    width: calc(100% / 1.25);
  }

  :deep(.CodeMirror) {
    width: 600px !important;
  }
}

@media screen and (min-width: 1141px) and (max-width: 1240px) {
  .clip-image {
    width: calc(100% / 1.35);
  }
  .middle-clip {
    width: calc(100% / 1.35);
  }

  :deep(.CodeMirror) {
    width: 700px !important;
  }
}

@media screen and (min-width: 1241px) {
  .clip-image {
    width: calc(100% / 1);
  }
  .middle-clip {
    width: calc(100% / 1);
  }
}

:deep(.ps__rail-y) {
  display: none !important;
}


@media screen and (max-height: 480px) {
  :deep(.CodeMirror) {
    height: 330px !important;
  }
}

@media screen and (min-height: 481px) and (max-height: 800px) {
  :deep(.CodeMirror) {
    height: 600px !important;
  }
}

@media screen and (min-height: 801px) and (max-height: 1200px) {
  :deep(.CodeMirror) {
    height: 100% !important;
  }
}
:deep(.tui-image-editor-menu){
  text-align: left !important;
  padding-left: 10px !important;
}
</style>
