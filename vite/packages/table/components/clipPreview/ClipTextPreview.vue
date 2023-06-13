<template>
  <transition name="fade">
    <div v-if="previewShow" class="preview-container">
      <div class="flex justify-between p-3 w-full h-full">
        <!-- 预览左侧内容开始 -->
        <div class="flex flex-col w-full">
          <!-- 关闭预览开始 -->
          <div class="flex mb-3 h-12 w-12 s-item rounded-lg no-drag items-center justify-center pointer" @click="closePreview">
            <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
          </div>
          <!-- 关闭预览结束 -->
          

          <!-- 文本预览开始 -->
          <template v-if="previewContent.type === 'text'">
              <div class="flex h-full flex-col justify-between">
                <div class="flex h-full items-center justify-center">
                  <template v-if="defaultText.name === 'plainText'">
                    <textCodeMirror :editorContent="previewContent.content"></textCodeMirror>
                  </template>
                  <template v-else>
                    <ClipCodemirror :editorContent="previewContent.content"></ClipCodemirror>
                  </template>
                </div>
                <div class="flex items-center justify-center">
                  <HorizontalPanel :navList="textType" v-model:selectType="defaultText"></HorizontalPanel>
                  <div class="flex ml-3 py-3 px-4 pointer items-center rounded-lg justify-center" style="background: var(--secondary-bg);">
                    <span class="mr-5 type-right">{{clipMode}}</span>
                    <Icon icon="xiangxia" style="font-size: 1.25em;"></Icon>
                  </div>
                </div>
              </div>
          </template>
          <!-- 文本预览结束 -->


          <!-- 图片预览开始 -->
            
          <!-- 图片预览结束 -->

          
        </div>
        <!-- 预览左侧内容结束 -->

        <!-- 预览右侧内容开始 -->
        <div class="p-6 flex flex-col justify-between" style="width: 352px;border-left: 1px solid var(--divider);">
          <div class="flex flex-col">
            <div class="flex justify-between mb-6">
              <span class="type-text">类型</span>
              <span class="type-right">
                {{ previewContent.type === 'text' ? '文本' : previewContent.type === 'image' ? '图片'
                  :'' 
                }}
              </span>
            </div>
            <div class="flex justify-between mb-6">
              <span class="type-text">时间</span>
              <span class="type-right">{{ previewContent.timeText}}</span>
            </div>
            <div class="flex justify-between mb-6">
              <span class="type-text">大小</span>
              <span class="type-right">{{ previewContent.content.length}}个字符</span>
            </div>
          </div>
          <div class="flex  flex-col justify-between">
            123
          </div>
        </div>
        <!-- 预览右侧内容结束 -->
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store/clipboard';
import Player from 'xgplayer/dist/simple_player'
import ClipCodemirror from './ClipCodemirror.vue';
import HorizontalPanel from '../HorizontalPanel.vue';
import textCodeMirror from './textCodeMirror.vue';

export default {
  components:{
    ClipCodemirror,
    HorizontalPanel,
    textCodeMirror
  },
  props:{
    previewContent:{
      type:Object,
      default:()=>{}
    }
  },

  data(){
    return{
      // 预览代码块类型切换
      textType:[
        {title:'纯文本',name:'plainText'},
        {title:'代码块',name:'code'}
      ],
      // 默认的预览代码块类型
      defaultText: {title:'纯文本',name:'plainText'},

    }
  },

  computed:{
    ...mapWritableState(clipboardStore,['previewShow','clipMode']),
  },
  methods:{
    ...mapActions(clipboardStore,['isOpenPreview']),
    // 关闭预览全屏窗口
    closePreview(){
      this.isOpenPreview(false)
    },
    
  },

  watch:{
    'defaultText':{
      handler(){
        this.defaultText = this.defaultText
      },
      immediate:true
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(19, 19, 19, 0.35);
  backdrop-filter: blur(60px);
}

.type-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.60);
  font-weight: 400;
}
.type-right{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}
:deep(.CodeMirror){
  height:auto !important;
  width: auto !important;
}
</style>