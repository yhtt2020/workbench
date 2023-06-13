<template>
  <!-- 文本显示区域开始 -->
   <template v-if="clip.type === 'text'">
    <!-- 列表主界面 -->
    <div style="width: 338px;" v-if="controlsShow === false && codeLanguageShow === false" class="flex flex-col rounded-lg justify-between" @contextmenu="textButton">
      <!-- 文本卡片顶部标题开始 -->
      <div class="flex s-item flex-col h-16 rounded-t-lg w-full px-4 py-2">
        <div class="flex items-center mb-1">
         <Icon :icon="getType(clip.type).icon" style="font-size: 1.45em;"></Icon>
         <span class="ml-2">{{getType(clip.type).title}}</span>
        </div>
        <div class="flex justify-between">
         <span>{{ clip.timeText }}</span>
         <span>{{ clip.capacity }}</span>
        </div>
      </div>
      <!-- 文本卡片顶部标题结束 -->

      <!-- 文本内容开始 -->
        <!-- 纯文本情况下 -->
        <div class="flex px-5 py-10 flex-1 text-md" v-if="defaultTextType.name === 'text'">
          <textCodeMirror :editorContent="clip.content"></textCodeMirror>
        </div>
        <!-- 代码高亮情况下 -->
        <div v-if="defaultTextType.name === 'code'" class="px-5 py-10 flex-1">
          <ClipCodemirror :editorContent="clip.content" class="w-full"></ClipCodemirror>
        </div>
      <!-- 文本内容结束 -->

      <!-- 剪贴板文本底部切换开始 -->
      <div class="flex s-item py-1 px-2 h-12 rounded-b-lg items-center justify-between">
          <div v-for="(item,index) in textType" :class="defaultTextType.name === item.name ? 's-item':''" class="flex items-center pointer rounded-lg pt-3 pb-2 px-8" 
           @click.stop="selectItem(item,index)"  @tabClick="openCode"
          >
            <Icon :icon="item.icon" style="font-size: 1.45em;"></Icon>
            <span class="ml-2 mr-2">{{ item.title }}</span>
            <Icon icon="xiangyou" class="pointer"  v-if="item.title !== '纯文本' && item.title !=='代码块'" style="font-size: 1.25em;"></Icon>
          </div> 
      </div>
      <!-- 剪贴板文本底部切换结束 -->

    </div>

    <!-- 操作界面 -->
    <div v-else-if="controlsShow === true" style="width: 338px;height:100%;">
      <div class="flex s-item flex-col rounded-lg px-4 py-3">
        <div class="flex justify-between mb-3">
          <div class="w-12 s-item h-12 rounded-lg pointer flex items-center justify-center" @click="backClip">
            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
          </div>
          <div class="flex w-4/5 items-center  justify-center">
           <span>操作</span>
          </div>
        </div>
        <!-- 快捷键按钮 -->
        <div class="flex flex-col">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 44vh;">
            <div v-for="item in textKey" @click="keyOperation(item)" class="flex pointer justify-between s-item px-4 rounded-lg py-3 mb-2">
              <span>{{item.title}}</span>
              <span>{{item.intr}}</span>
            </div> 
          </vue-custom-scrollbar>
        </div>
      </div>
    </div>

    <!-- 代码语言切换界面 -->
    <div v-else style="width: 338px;height:100%;" class="flex flex-col">
      <div class="s-item p-4 ">
        <div class="flex justify-between items-center mb-3">
          <div class="w-12 h-12 pointer s-item rounded-lg button-active  flex items-center justify-center" @click="backClip">
            <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
          </div>
          <span class="title-text">语言</span>
          <div class="w-12 h-12 pointer s-item rounded-lg button-active  flex items-center justify-center" @click="openClipSet">
            <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>
          </div>
        </div>
        <!-- 代码块语言包切换列表 -->
        <div class="flex flex-col">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 44vh;">
            <div v-for="item in codeLanguage" class="rounded-lg pointer button-active s-item px-4 py-3 mb-2" @click="clickCodeLanguage(item)">
              {{ item.title }}
            </div>
          </vue-custom-scrollbar>
        </div>
      </div>
    </div>
   </template>   
  <!-- 文本显示区域结束 -->


  <!-- 图片显示区域开始 -->
  <template v-if="clip.type === 'image'">
    <!-- 列表主界面 -->
    <div style="width: 338px;" v-if="controlsShow === false" class="flex flex-col justify-between" @contextmenu="textButton">
      <!-- 图片标题开始 -->
      <div class="flex s-item flex-col rounded-t-lg w-full px-4 py-2">
        <div class="flex items-center mb-1">
         <Icon :icon="getType(clip.type).icon" style="font-size: 1.45em;"></Icon>
         <span class="ml-2">{{getType(clip.type).title}}</span>
        </div>
        <div class="flex justify-between">
         <span>{{ clip.timeText }}</span>
         <span>{{clip.capacity}}</span>
        </div>
      </div>
      <!-- 图片标题结束 -->

      <!-- 图片内容开始 -->
      <div class="flex px-5 py-10">
        <div style="width:100%;height:185px;" class="rounded-lg flex flex-col " v-if="img">
          <a-image :src="img" alt="" class="rounded-lg w-full h-full  object-cover"  ></a-image>
          <span class="pt-5 text-center">{{ clip.name }}</span>
        </div>
      </div>
      <!-- 图片内容结束 -->

    </div>

    <!-- 图片操作界面 -->
    <div v-else-if="controlsShow === true" style="width: 338px;height:100%;">
      <div class="flex s-item flex-col px-4 py-3 rounded-lg">
        <div class="flex justify-between mb-3">
          <div class="w-12 s-item h-12 rounded-lg pointer flex items-center justify-center" @click="backClip">
            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
          </div>
          <div class="flex w-4/5 items-center  justify-center">
           <span>操作</span>
          </div>
        </div>

        <!-- 快捷键按钮 -->
        <div class="flex flex-col">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 44vh;">
            <div v-for="item in imageKey" @click="keyOperation(item)" class="flex pointer justify-between s-item px-4 rounded-lg py-3 mb-2">
              <span>{{item.title}}</span>
              <span>{{item.intr}}</span>
            </div> 
          </vue-custom-scrollbar>
        </div>

      </div>
    </div>
    
  </template>
  <!-- 图片显示区域结束 -->

  
  <!-- 文件显示区域开始 -->
  <template v-if="clip.type === 'file'">
    <!-- 列表主界面 -->
    <div style="width: 338px;" v-if="controlsShow === false" class="flex flex-col justify-between" @contextmenu="textButton">
      <!-- 文件标题开始 -->
      <div class="flex s-item flex-col rounded-t-lg w-full px-4 py-2">
        <div class="flex items-center mb-1">
         <Icon :icon="getType(clip.type).icon" style="font-size: 1.45em;"></Icon>
         <span class="ml-2">{{getType(clip.type).title}}</span>
        </div>
        <div class="flex justify-between"> 
         <span>{{ clip.timeText }}</span>
         <span>{{clip.capacity}}</span>
        </div>
      </div>
      <!-- 文件标题结束 -->

      <!-- 文件内容开始 -->
       <div class="flex px-5 py-10 items-center  justify-center">
        <div class="flex items-center justify-center flex-col">
          <Icon :icon="clip.picIcon" style="font-size: 9em;"></Icon>
          <span class="py-3">{{ clip.content }}</span>
        </div>
       </div>
      <!-- 文件内容结束 -->

    </div>

    <!-- 文件快捷键操作界面 -->
    <div v-else-if="controlsShow === true" style="width: 338px;height:100%;" >
      <div class="flex s-item flex-col rounded-lg px-4 py-3 ">
        <div class="flex justify-between mb-3">
          <div class="w-12 s-item h-12 rounded-lg pointer flex items-center justify-center" @click="backClip">
            <Icon icon="xiangzuo" style="font-size: 1.45em;"></Icon>
          </div>
          <div class="flex w-4/5 items-center  justify-center">
           <span>操作</span>
          </div>
        </div>

        <!-- 快捷键按钮 -->
        <div class="flex flex-col">
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 44vh;">
            <div v-for="item in fileKey" @click="keyOperation(item)" class="flex pointer justify-between s-item px-4 rounded-lg py-3 mb-2">
              <span>{{item.title}}</span>
              <span>{{item.intr}}</span>
            </div> 
          </vue-custom-scrollbar>
        </div>
      </div>
    </div>
  </template>
  <!-- 文件显示区域结束 -->


  <!-- 视频显示区域开始 -->
  <template v-if="clip.type === 'video'">
    <!-- 列表主界面 -->
    <div style="width: 338px;" class="flex flex-col justify-between">
      <!-- 视频标题开始 -->
      <div class="flex s-item flex-col rounded-t-lg w-full px-4 py-2">
        <div class="flex items-center mb-1">
         <Icon :icon="getType(clip.type).icon" style="font-size: 1.45em;"></Icon>
         <span class="ml-2">{{getType(clip.type).title}}</span>
        </div>
        <div class="flex justify-between"> 
         <span>{{ clip.timeText }}</span>
         <span>{{clip.capacity}}</span>
        </div>
      </div>
      <!-- 视频标题结束 -->
      
      <!-- 视频内容开始 -->
       <div  class="flex px-5 py-10 items-center flex-col justify-center">
        <div id="clip-video" ref="clipVideo" class="rounded-lg"></div>
       </div>
      <!-- 视频内容结束 -->
    </div>

    <!-- 视频快捷键操作界面 -->

  </template>
  <!-- 视频显示区域结束 -->


  <!-- 音频显示区域开始 -->
  <template v-if="clip.type === 'audio'">
    <div>音频</div>
  </template>
  <!-- 音频显示区域结束 -->


  <!-- 设置弹窗 -->
  <ClipSetDrawer ref="setDrawer"></ClipSetDrawer>
</template>

<script>
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import ClipSetDrawer from './ClipSetDrawer.vue';
import {toRaw} from "vue";
import ClipCodemirror from './ClipCodemirror.vue';
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store/clipboard';
import textCodeMirror from './textCodeMirror.vue';
import Player from 'xgplayer/dist/simple_player'

export default {
  components: { HorzontanlPanelIcon,ClipCodemirror,textCodeMirror,ClipSetDrawer},
  props:{
    clip:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      type:{},
      img:{},

      // 控制操作界面的显示
      controlsShow:false,
      // 控制代码块界面的显示
      codeLanguageShow:false,

      // 判断文本底部切换是为首次切换
      firstSwitch:true,

      // 文本底部切换
      textType:[
        {title:'纯文本',icon:'ziyuan',name:'text'},
        {
          title:'代码块',icon:'daima',name:'code',
        }
      ],
      defaultTextType:{title:'纯文本',icon:'ziyuan',name:'text'},

      // 文本键盘快捷键操作按钮
      textKey:[
        {title:'复制',intr:'Ctrl + C',id:'cc'},
        {title:'打开链接',intr:'Ctrl + O',id:'co'},
        {title:'预览',intr:'Space',id:'s'},
        {title:'添加到收藏',intr:'Ctrl + S',id:'cs'},
        {title:'删除',intr:'Delete',id:'d'}
      ],

      // 图片快捷键操作按钮
      imageKey:[
        {title:'复制',intr:'Ctrl + C',id:'cc'},
        {title:'打开',intr:'Ctrl + O',id:'co'},
        {title:'预览',intr:'Space',id:'s'},
        {title:'复制路径',intr:'Ctrl + Alt + C',id:'cac'},
        {title:'在资源管理器中打开',intr:'Ctrl + Enter',id:'ce'},
        {title:'添加到收藏',intr:'Ctrl + S',id:'cs'},
        {title:'删除',intr:'Delete',id:'d'}
      ],

      // 文件快捷键操作按钮
      fileKey:[
        {title:'复制',intr:'Ctrl + C',id:'cc'},
        {title:'打开',intr:'Ctrl + O',id:'co'},
        {title:'复制路径',intr:'Ctrl + Alt + C',id:'cac'},
        {title:'在资源管理器中打开',intr:'Ctrl + Enter',id:'ce'},
        {title:'添加到收藏',intr:'Ctrl + S',id:'cs'},
        {title:'删除',intr:'Delete',id:'d'}
      ],

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      
      // 代码块语言包切换
      codeLanguage:[
        {title:'Python',name:'python'},
        {title:'JavaScript',name:'javascript'},
        {title:'Java',name:'text/x-java'},
        {title:'C++',name:'text/x-c++src'},
        {title:'C#',name:'text/x-csharp'},
        {title:'PHP',name:'application/x-httpd-php'},
        {title:'Swift',name:'swift'}
      ],
      // clipOptions:{
      //   tabSize: 4, // 默认为4
			// 	mode: 'swift', // 选择代码语言
			// 	lineWrapping: true,    // 自动换行
      //   styleActiveLine: true,
      //   scrollbarStyle: null, // 将滚动条样式设置为 null
      //   line: true,
			// 	theme: 'monokai' // 主题根据需要自行配置
      // },
      // item:{}
    }
  },

  computed:{
    ...mapWritableState(clipboardStore,['previewShow'])
  },

  watch:{
    'clip':{
      handler(){
        this.refresh()
      }
    },
    'defaultTextType':{
      handler(){
        this.defaultTextType = this.defaultTextType
      },
      immediate:true,
    },
  },

  mounted(){
    window.addEventListener('keydown',this.clipKeyDown)
    this.loadVideo()
  },


  methods:{
    ...mapActions(clipboardStore,['changeClipMode','isOpenPreview']),
    refresh(){
      this.clip.timeText=tsbApi.util.friendlyDate(this.clip.time)
      this.type=this.getType(this.clip.type)
      this.capacity=this.clip.content.length+'个字符'
      if(this.clip.type === 'image'){
        console.log('是图片，要转换')
        this.img = toRaw(this.clip.content).toDataURL()
        console.log(this.img,'图片地址')
      }
      if(this.clip.type === 'video'){
        this.loadVideo()
      }
    },
    getType(type) {
      switch (type) {
        case 'text':
          return {
            icon: 'text-align-left',
            title: '文本'
          }
        case 'image':
          return {
            icon:'image',
            title:'图片'
          }
        case 'file':
          return {
            icon:'file',
            title:'文件'
          }
        case 'video':
          return{
            icon:'video',
            title:'视频'
          }
      }

    },
    // 鼠标右键触发
    textButton(){
      this.controlsShow = true
    },
    // 返回按钮
    backClip(){
      this.controlsShow = false
      this.codeLanguageShow = false
    },
    // 文本底部tab切换
    selectItem(item,index){
      if(this.firstSwitch){  // 判断是否第一次切换
        this.defaultTextType = item
        this.firstSwitch = false
      }else{
        if(index === 1){  // 切换以后下标是否为1
          this.$emit('tabClick',this.openCode())
        }else{  // 再次切换为第一项
          this.defaultTextType = item
          this.firstSwitch = true
        }
      }
    },

    // 键盘快捷键触发
    clipKeyDown(e){
      // 打开预览快捷键功能
      if(e.keyCode === 32){
        console.log('预览');
        this.$emit('previewItem',this.clip)
        this.isOpenPreview(true)
      }
    },

    // 快捷键按钮触发
    keyOperation(item){
      switch(item.id){
        case 'cc':
          console.log('复制',this.clip);
          break;
        case 'co':
          console.log('打开链接');
          break;
        case 's':
          // this.$emit('previewItem',this.clip)
          this.isOpenPreview(true)
          break;
        case 'cs':
          console.log('添加收藏');
          break;
        case 'd':
          console.log('删除');
          break;
        case 'ce':
          console.log('资源管理打开');
          break;
        case 'cac':
          console.log('复制路径');
          break;
      }
    },

    // 打开代码块语言包切换界面
    openCode(){
      this.codeLanguageShow = true
    },

    // 代码块语言包切换的回调事件
    clickCodeLanguage(item){
      this.changeClipMode(item.name) // 将代码块语言包进行替换的方法
      this.defaultTextType.title = item.title
      this.codeLanguageShow = false
    },
    
    // 打开设置
    openClipSet(){
      this.$refs.setDrawer.clipOpenShow()
    },
    

    // 加载视频
    loadVideo(){
      const url = this.clip.videoUrl
      if(this.clip.type === 'video'){
        this.$nextTick(()=>{
          window.$xgplayer = new Player({
           el:this.$refs.clipVideo,
           url: url,
           fitVideoSize: 'fixWidth',
           width:'302',
           height:'240',
           loop: true,
           videoInit: true,
           controlsList: ['nofullscreen'],
          })
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.button-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.8);
  }
  &:hover{
    background: rgba(42, 42, 42, 0.8);
  }
}
:deep(.ps__thumb-y){
  display: none !important;
}
.clip-time{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255,255,255,0.40);
  text-align: center;
  font-weight: 500;
}
:deep(.CodeMirror){
  height:240px;
}
:deep(.cm-s-monokai.CodeMirror){
  background: none !important;
  padding: 0 4px ;
  font-family: PingFangSC-Medium !important;
  font-size: 14px !important;
  color: rgba(255,255,255,0.4) !important;
  font-weight: 500 !important;
}
.clip-con{
  color: rgba(255,255,255,1);
}
.px-13{
  padding-left:14px;
  padding-right: 14px;
}
.bf-button{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.button-active {
  &:active {
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }

  &:hover {
    background: rgba(42, 42, 42, 0.25);
  }
}
.title-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}

.text-md{
  flex:1;
}
.bo-div{
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>

<style>
.CodeMirror-linenumber{
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.xgplayer-icon-requestfull{
  display: none !important;
}
</style>
