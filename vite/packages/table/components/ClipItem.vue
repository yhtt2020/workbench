<template>
  <div @contextmenu="textButton" class="flex flex-col justify-between">
    <template v-if="clip.type === 'text' && textShow === false" >
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
      <div style="padding: 51px 13px;" class="flex-1">
        <span ref="codeEditor" class="clip-con" v-if="defaultTextType.name === 'text'">{{ clip.content  }}</span>
        <codemirror :value="clip.content" :options="clipOptions"  v-else></codemirror>
      </div>
      <div class="h-12 s-item rounded-b-md flex ">
          <div v-for="(item) in textType"  :class="defaultTextType.name === item.name ? 's-bg':''" 
           class="py-3 rounded-lg pointer w-1/2 flex items-center justify-center" @click.stop="selectItem(item)"
           @dblclick="openCode"
          >
            <Icon :icon="item.icon"></Icon>
            <span class="ml-2">{{item.title}}</span>
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
      <div style="padding: 51px 13px;" class="flex-1">
        <div v-if="clip.picIcon" class="flex flex-col items-center justify-center"> 
          <Icon :icon="clip.picIcon" style="font-size: 9.15em;"></Icon>
          <span class="pt-6">{{clip.name}}</span>
        </div>
      </div>
      <div class="h-12 s-item rounded-b-md"></div>
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
      <div style="padding: 46px 13px;" class="flex-1">
        <div style="width:100%;height:185px;" class="rounded-lg flex flex-col " v-if="clip.imgUrl">
          <img :src="clip.imgUrl" alt="" class="rounded-lg" style="width: 100%;height: 100%;object-fit: cover;">
          <span class="pt-5 text-center">{{ clip.name }}</span>
        </div>
      </div>
      <div class="h-12 s-item rounded-b-md"></div>
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

export default {
  components: { codemirror },
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
        {title:'Python'},
        {title:'JavaScript'},
        {title:'Java'},
        {title:'C++'},
        {title:'C#'},
        {title:'PHP'},
        {title:'Swift'}
      ],
      clipCode:'',
      clipOptions:{
        tabSize: 4, // tabsize默认为4
				styleActiveLine: true,
				lineNumbers: true, // 代码行数字
				line: true,
				mode: 'javascript', // 选择代码语言
			  extraKeys: {"Ctrl": "autocomplete"},   // 自动提示配置 
				lineWrapping: true,    // 自动换行
				theme: 'monokai' // 主题根据需要自行配置
      }
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
      if(item.intr === 'Space'){
        this.$emit('openPreview',{preview:true,item,content:this.clip,copy:this.copyList})
      }
    },
    selectItem(item){
      this.defaultTextType = item
      this.clipOptions.mode = item.title
      // this.clipCode = item.title
    },
    openCode(){
      this.textShow = true
      this.codeShow = true
    },
    clickCodeLanguage(item){
      this.textShow = false
      this.codeShow = false
      this.defaultTextType.title = item.title

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
</style>