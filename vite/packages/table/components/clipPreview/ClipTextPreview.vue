<template>
  <transition name="fade">
    <div class="preview-container" v-if="textShow">
      <div class="flex h-full items-center justify-between p-5">
        <div class="left-preview flex flex-col h-full justify-between">
            <div>
              <div @click="closePreview"  class="w-12 h-12 no-drag button-active  s-item  flex pointer items-center justify-center rounded-lg">
                <Icon icon="guanbi" style="font-size: 1.5em;"></Icon>
              </div> 
            </div>
            <div class="flex items-center justify-center px-3"  v-if="textPreview.type==='text'">
              <div class="w-full flex items-center justify-center"  v-if="textPreview.type==='text' && defaultClipText.name === 'text'">
                <span class="preview-content">{{textPreview.content}}</span>
              </div>
              <div v-else-if="textPreview.type==='text' && defaultClipText.name === 'codeBlock'" class="w-full flex my-auto items-center justify-center">
               <codemirror :value="textPreview.content" :options="clipOptions" ></codemirror>
              </div>
            </div>
            
            <div v-if="textPreview.type === 'image'" class="w-full flex items-center justify-center">
              <div  class="rounded-lg image-content p-3">
                <img :src="textPreview.imgUrl" class="rounded-lg" style="width:100%; height: 100%;object-fit: cover;" alt="">
              </div>
            </div>

            <div class="w-full flex items-center justify-center px-3">
              <div class="h-12 flex items-center justify-center" v-if="textPreview.type === 'text'">
                <HorzontanlPanelIcon :navList="clipText" v-model:selectType="defaultClipText" class="left-panel"></HorzontanlPanelIcon>
                <div class="ml-3 py-3 px-9 flex button-active items-center rounded-lg s-item pointer"
                 v-if="defaultClipText.name === 'codeBlock'"
                 @click="openCateDrawer"
                >
                  <span class="pr-2">{{defaultCate.name}}</span>
                  <Icon icon="xiangxia"></Icon>
                </div>
              </div>
            </div>
        </div>
        <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="py-4" style="height: 100vh;">
          <div class="right-preview h-full flex flex-col justify-between pl-6"  v-if="textPreview.type === 'text'">
          <div class="flex flex-col">
            <div class="flex justify-between mb-6">
              <span class="preview-type">类型</span>
              <span class="preview-text">{{textPreview.title}}</span>
            </div>
            <div class="flex justify-between mb-6">
              <span class="preview-type">时间</span>
              <span class="preview-text">{{textPreview.time }}</span>
            </div>
            <div class="flex justify-between">
              <span class="preview-type">大小</span>
              <span class="preview-text">{{textPreview.capacity}}</span>
            </div>
          </div>
          <div>
            <div v-for="item in copy" style="max-width:352px;" class="s-item mb-2 pointer button-active justify-between flex rounded-lg px-4 py-3">
              <span class="preview-text">{{item.title}}</span>
              <span class="preview-type">{{item.intr}}</span>
            </div>
          </div>
        </div>
          <div class="right-preview h-full flex flex-col justify-between pl-6"  v-if="textPreview.type === 'image'">
            <div class="flex flex-col">
              <div class="flex item-center justify-between mb-3">
                <span class="preview-type">名称</span>
                <span class="preview-type">{{textPreview.name}}</span>
              </div>
              <div class="flex item-center justify-between mb-3">
                <span class="preview-type">类型</span>
                <span class="preview-type">{{textPreview.title}}</span>
              </div>
              <div class="flex item-center justify-between mb-3">
                <span class="preview-type">时间</span>
                <span class="preview-type">{{textPreview.time}}</span>
              </div>
              <div class="flex item-center justify-between mb-3">
                <span class="preview-type">大小</span>
                <span class="preview-type">{{textPreview.capacity}}</span>
              </div>
              <div class="flex item-center justify-between mb-3">
                <span class="preview-type">格式</span>
                <span class="preview-type">{{textPreview.fileType}}</span>
              </div>
              <div class="flex flex-col item-center justify-between mb-3">
                <span class="preview-type mb-2">路径</span>
                <span class="preview-type break-words break-normal" style="max-width: 352px;">{{textPreview.imgUrl}}</span>
              </div>
            </div>
            <div>
              <div v-for="item in imageCopy" class="s-item mb-2 pointer button-active flex justify-between items-center rounded-lg px-4 py-3">
                <span class="preview-text">{{item.title}}</span>
                <span class="preview-type">{{item.intr}}</span>
              </div>
            </div>
          </div>
        </vue-custom-scrollbar>
        
      </div>
     
    </div>
  </transition>
  <HorizontalDrawer :drawerTitle="drawerTitle"  
  v-model:selectRegion="defaultCate.id"
  @getArea="getArea"
  :rightSelect="languageCate" ref="regionDrawer">

  </HorizontalDrawer>
</template>

<script>
import codemirror from 'vue-codemirror/src/codemirror.vue';
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue';
import HorizontalDrawer from '../HorizontalDrawer.vue';
export default {
  components:{
    codemirror,
    HorzontanlPanelIcon,
    HorizontalDrawer
  },
  props:{
    textShow:{
      type:Boolean,
      default:false
    },
    textPreview:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      copy:[
        {title:'复制',intr:'Ctrl + C'},
        {title:'打开链接',intr:'Ctrl + O'},
        {title:'添加到收藏',intr:'Ctrl + S'},
        {title:'删除',intr:'Delete'}
      ],  
      imageCopy:[
        {title:'复制',intr:'Ctrl + C'},
        {title:'打开',intr:'Ctrl + O'},
        {title:'复制路径',intr:'Ctrl + Alt + C'},
        {title:'在资源管理器中打开',intr:'Ctrl + Enter'},
        {title:'添加到收藏',intr:'Ctrl + S'},
        {title:'删除',intr:'Delete'}
      ],
      clipText:[
        {
          title:'纯文本',name:'text',icon:'ziyuan'
        },
        {
          title:'代码块',name:'codeBlock',icon:'daima'
        }
      ],
      defaultClipText:{title:'纯文本',name:'text'}, 
      clipOptions:{
        tabSize: 4, // 默认为4
				mode: 'swift', // 选择代码语言
				lineWrapping: true,    // 自动换行
        styleActiveLine: true,
        scrollbarStyle: null, // 将滚动条样式设置为 null
        line: true,
				theme: 'monokai' // 主题根据需要自行配置
      },
      languageCate:[
        {name:'Python',id:'python'},
        {name:'Javascript',id:'javascript'},
        {name:'Java',id:'text/x-java'},
        {name:'C++',id:'text/x-c++src'},
        {name:'C#',id:'text/x-csharp'},
        {name:'Swift',id:'swift'}
      ],
      defaultCate:{name:'Swift',id:'swift'},
      drawerTitle:'语言模式',
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX:true,
        wheelPropagation: true
      },
    }
  },
  methods:{
    closePreview(){
      this.$emit('closeText',false)
    },
    openCateDrawer(){
      this.$refs.regionDrawer.openDrawer()
    },
    getArea(v){
      this.defaultCate = v
      this.clipOptions.mode = v.id
    }
  },



  watch:{
    'defaultClipText':{
      handler(){
        this.defaultClipText = this.defaultClipText
      },
      immediate:true,
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
.button-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.6);
  }
  &:hover{
    background: rgba(42, 42, 42, 0.6);
  }
}
.preview-content{
  width:600px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255,255,255,0.60);
  font-weight: 500;
}
.preview-type{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.60);
  font-weight: 400;
}
.preview-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}

:deep(.cm-s-monokai.CodeMirror){
  background: rgba(42, 42, 42, 0.8) !important;
  border-radius: 12px;
  padding: 20px !important;
  font-family: PingFangSC-Medium !important;
  font-size: 14px !important;
  color: rgba(255,255,255,0.4) !important;
  font-weight: 500 !important;
}
.right-preview{
  width: 352px;
}
.left-preview{
  flex: 1;
}

.close-button{
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 100;
}
:deep(.ps__thumb-y){
  display: none !important;
}

.image-content{
  max-width: 800px;
}


@media screen and (max-width:840px) {
  .left-preview{
    width: calc(100% / 2);
  }
  .left-panel{
    width: calc(100% / 1.75);
  }
  .image-content{
    width: calc(100% / 1);
  }
}

@media screen and (min-width:840px)  and (max-width: 1140px) {
  .image-content{
    width: calc(100% / 1);
  }
}

@media screen and (min-width:1140px)  and (max-width: 1240px) {
  .image-content{
    width: calc(100% / 1.36);
  }
}
</style>