<template>
  <div @contextmenu="textButton" class="flex flex-col">
    <template v-if="clip.type === 'text' && textShow === false" >
      <div class="flex flex-col justify-between  ">
        <div class="flex justify-between s-item p-3 rounded-t-md flex-col">
          <div class="flex items-center">
            <Icon :icon="clip.icon" style="font-size: 1.5em;"></Icon>
            <span class="ml-2">{{clip.title}}</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="clip-time">{{clip.time}}</span>
            <span class="clip-time">{{clip.capacity}}</span>
          </div>
        </div>
        <div class="flex items-center clip-text-center justify-center pt-6 pb-10">
          <div style="height: 240px;" class="px-5 flex items-center justify-center"  v-if="defaultTextType.name === 'text'">
            <span class="clip-con">{{ clip.content  }}</span>
          </div>
          <div v-else class="flex px-4" style="height: 240px;">
            <codemirror :value="clip.content" :options="clipOptions" ></codemirror>
          </div>
        </div>
        <div class="h-12 flex p-1 s-item rounded-b-md">
          <div v-for="(item) in textType"  :class="defaultTextType.name === item.name ? 's-item':''" 
          class="py-3 rounded-lg pointer w-1/2 flex items-center justify-center" @click.stop="selectItem(item)"
         >
           <Icon :icon="item.icon" style="font-size: 1.25em;"></Icon>
           <span class="mx-2">{{item.title}}</span>
           <Icon icon="gengduo1" class="pointer" v-if="item.title !== '纯文本' && item.title !=='代码块'" style="font-size: 1.25em;"></Icon>
         </div>
        </div>
      </div>
    </template>

    <template v-else-if="clip.type === 'text' && textShow === true">
      <vue-custom-scrollbar :settings="settingsScroller">
        <div class="px-4 flex flex-col mt-3.5" v-if="codeShow === false">
          <div class="w-full flex items-center justify-between mb-3">
            <div @click="backClip" class="s-item rounded-lg h-12  px-4 py-3 flex items-center button-active pointer justify-center">
              <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
            </div>
            <div class="py-3 flex items-center  rounded-lg ml-3 w-40">
              <span>操作</span>
            </div>
          </div>
          <div v-for="item in copyList" @click.self="defaultClickClip(item)" class="s-item mb-2 pointer button-active flex justify-between items-center rounded-lg px-4 py-3">
            <span>{{item.title}}</span>
            <span>{{item.intr}}</span>
          </div>
        </div>
        <div v-else class="px-4 flex flex-col mt-3.5">
          <div v-for="item in codeLanguage" class="s-item mb-2 pointer button-active flex justify-between items-center rounded-lg px-4 py-3"
            @click="clickCodeLanguage(item)"
          >
            <span>{{item.title}}</span>
          </div>
        </div>
      </vue-custom-scrollbar>
    </template>

    <template v-if="clip.type === 'file' && fileShow === false">
      <div class="flex flex-col  rounded-t-md s-item px-5 py-3">
        <div class="flex items-center">
          <Icon :icon="clip.icon" style="font-size: 1.5em;"></Icon>
          <span class="ml-2">{{clip.title}}</span>
        </div>
        <div class="flex justify-between pt-1">
          <span class="clip-time">{{clip.time}}</span>
          <span class="clip-time">{{clip.capacity}}</span>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center  px-5 py-14">
        <div v-if="clip.picIcon" class="flex flex-col items-center justify-center"> 
          <Icon :icon="clip.picIcon" style="font-size: 9.15em;"></Icon>
          <span class="pt-6">{{clip.name}}</span>
        </div>
      </div>
      <!-- <div class="h-12 s-item rounded-b-md"></div> -->
    </template>

    <template v-else-if="clip.type === 'file' && fileShow === true">
      <div class="px-4 flex flex-col mt-3.5">
        <div class="w-full flex items-center justify-between mb-3">
          <div @click="backClip" class="s-item rounded-lg h-12  px-4 py-3 flex items-center button-active pointer justify-center">
            <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
          </div>
          <div class="py-3 flex items-center  rounded-lg ml-3 w-40">
            <span>操作</span>
          </div>
        </div>
        <div v-for="item in fileCopyList" @click="backClip" class="s-item mb-2 pointer button-active flex justify-between items-center rounded-lg px-4 py-3">
          <span>{{item.title}}</span>
          <span>{{item.intr}}</span>
        </div>
      </div>
    </template>

    <template v-if="clip.type === 'image' && imageShow === false">
      <div class="flex flex-col  rounded-t-md s-item px-5 py-3 mb-3">
        <div class="flex items-center">
          <Icon :icon="clip.icon" style="font-size: 1.5em;"></Icon>
          <span class="ml-2">{{clip.title}}</span>
        </div>
        <div class="flex justify-between pt-1">
          <span class="clip-time">{{clip.time}}</span>
          <span class="clip-time">{{clip.capacity}}</span>
        </div>
      </div>
      <div class="flex-1 px-5 py-14 mb-3">
        <div style="width:100%;height:185px;" class="rounded-lg flex flex-col " v-if="clip.imgUrl">
          <img :src="clip.imgUrl" alt="" class="rounded-lg" style="width: 100%;height: 100%;object-fit: cover;">
          <span class="pt-5 text-center">{{ clip.name }}</span>
        </div>
      </div>
      <!-- <div class="h-12 s-item rounded-b-md"></div> -->
    </template>

    <template v-else-if="clip.type === 'image' && imageShow === true">
      <vue-custom-scrollbar :settings="settingsScroller" style="height:398px;">
        <div class="px-4 flex flex-col mt-2.5">
          <div class="w-full flex items-center  justify-between mb-3">
            <div @click="backClip" class="s-item rounded-lg h-12  px-4 py-3 flex items-center button-active pointer justify-center">
              <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
            </div>
            <div class="py-3 flex items-center  rounded-lg ml-3 w-40">
              <span>操作</span>
            </div>
          </div>
          <div v-for="item in imgCopyList" @click="defaultClickClip(item)" class="s-item mb-2 pointer button-active flex justify-between items-center rounded-lg px-4 py-3">
            <span>{{item.title}}</span>
            <span>{{item.intr}}</span>
          </div>
        </div>
      </vue-custom-scrollbar>
    </template>
  </div>
</template>

<script>
import codemirror from 'vue-codemirror/src/codemirror.vue'
import HorzontanlPanelIcon from './HorzontanlPanelIcon.vue'

export default {
  components: { codemirror,HorzontanlPanelIcon },
  props:{
    clip:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      textShow:false,
      fileShow:false,
      imageShow:false,
      previewShow:false,
      codeShow:false,
      copyList:[
        {title:'复制',intr:'Ctrl + C'},
        {title:'打开链接',intr:'Ctrl + O'},
        {title:'预览',intr:'Space'},
        {title:'添加到收藏',intr:'Ctrl + S'},
        {title:'删除',intr:'Delete'}
      ],
      imgCopyList:[
        {title:'复制',intr:'Ctrl + C'},
        {title:'打开',intr:'Ctrl + O'},
        {title:'预览',intr:'Space'},
        {title:'复制路径',intr:'Ctrl + Alt + C'},
        {title:'在资源管理器中打开',intr:'Ctrl + Enter'},
        {title:'添加到收藏',intr:'Ctrl + S'},
        {title:'删除',intr:'Delete'}
      ],
      fileCopyList:[
        {title:'复制',intr:'Ctrl + C'},
        {title:'打开',intr:'Ctrl + O'},
        {title:'复制路径',intr:'Ctrl + Alt + C'},
        {title:'在资源管理器中打开',intr:'Ctrl + Enter'},
        {title:'添加到收藏',intr:'Ctrl + S'},
        {title:'删除',intr:'Delete'}
      ],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      textType:[
        {title:'纯文本',icon:'ziyuan',name:'text'},
        {
          title:'代码块',icon:'daima',name:'dm',
        }
      ],
      defaultTextType:{title:'纯文本',icon:'ziyuan',name:'text'},
      codeLanguage:[
        {title:'Python',name:'python'},
        {title:'JavaScript',name:'javascript'},
        {title:'Java',name:'text/x-java'},
        {title:'C++',name:'text/x-c++src'},
        {title:'C#',name:'text/x-csharp'},
        // {title:'PHP',name:'application/x-httpd-php'},
        {title:'Swift',name:'swift'}
      ],
      clipOptions:{
        tabSize: 4, // 默认为4
				mode: 'swift', // 选择代码语言
				lineWrapping: true,    // 自动换行
        styleActiveLine: true,
        scrollbarStyle: null, // 将滚动条样式设置为 null
        line: true,
				theme: 'monokai' // 主题根据需要自行配置
      },
      item:{}
    }
  },

  watch:{
    'defaultTextType':{
      handler(){
        this.defaultTextType = this.defaultTextType
      },
      immediate:true,
    },
  },
  
  mounted(){
    window.addEventListener('keydown',this.clipKeyDown)
  },

  methods:{
    textButton(){
      this.textShow = true
      this.fileShow = true
      this.imageShow = true
    },
    backClip(){
      this.textShow = false
      this.imageShow = false
      this.fileShow = false
    },
    defaultClickClip(item){
      this.item = item
      if(item.intr === 'Space'){
        this.$emit('openPreview',{preview:true,item,content:this.clip,copy:this.copyList})
      }
    },
    selectItem(item){
      this.defaultTextType = item
      if(item.name === 'dm'){
        this.openCode()
      }
    },
    openCode(){
      this.textShow = true
      this.codeShow = true
    },
    clickCodeLanguage(item){
      this.textShow = false
      this.codeShow = false
      this.defaultTextType.title = item.title
      this.clipOptions.mode = item.name
    },
    clipKeyDown(e){
      if(e.keyCode === 32){
        this.$emit('openPreview',{preview:true,content:this.clip,copy:this.copyList})
      }
      if(e.ctrlKey && e.key === 'c'){
        console.log('复制');
      }
      if(e.ctrlKey && e.key === 's'){
        console.log('收藏');
      }
    }
  }
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
</style>