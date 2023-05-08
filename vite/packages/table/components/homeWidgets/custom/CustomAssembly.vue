<template>
  <HomeComponentSlot :customIndex="customIndex"  :options="options" :formulaBar="formulaBar" ref="customAssembly" :custom-data="customData">
    <div class="absolute inset-0 " style="border-radius: 8px;z-index: -1">
    <div class="h-full w-full pointer "  @click="" >
      <video class="fullscreen-video"   ref="wallpaperVideo" style="border-radius: 8px;object-fit: cover" playsinline="" autoplay="" muted="" loop="" v-if="myData.img.srcProtocol">
        <source :src="myData.img.srcProtocol"  type="video/mp4" id="bgVid">
      </video>
      <img :src="myData.img.middleSrc"   alt="" class="h-full w-full" style="border-radius: 8px;object-fit: cover" v-else-if="myData.img.middleSrc">
      <img :src="myData.img.src"  class="h-full w-full" style="border-radius: 8px;object-fit: cover" v-else-if="myData.img.src">
    </div>
    <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3"  v-if="showName">{{myData.title}}</div>
    </div>
  </HomeComponentSlot>
  <a-drawer v-model:visible="panelVisible">
    <div>小组件尺寸</div>
    <HorizontalPanel :navList="sizeList" v-model:select-type="mySize" class="mt-3" bg-color="drawer-item-select-bg" height="30"></HorizontalPanel>
    <div class="flex flex-row justify-between items-center mt-4">
      <div>显示名称</div>
      <div><a-switch v-model:checked="showName" /></div>
    </div>
    <a-input v-model:value="myData.title" class="rounded-lg mt-4 drawer-item-bg" placeholder="">
    </a-input>
    <div class=" mt-4">快捷方式</div>
    <div class="flex flex-row justify-between items-center mt-4">
      <div class="flex justify-center items-center rounded-lg h-9 drawer-item-bg w-1/2 pointer">自定义</div>
      <div class="flex justify-center items-center rounded-lg h-9 drawer-item-bg w-1/2 ml-3 pointer">应用导航</div>
    </div>
    <div class=" mt-4">小组件封面</div>
    <div class="flex flex-row justify-between items-center mt-4">
      <div class="flex justify-center items-center rounded-lg h-9 drawer-item-bg w-1/2 pointer" @click="importFile">选择图片</div>
      <div class="flex justify-center items-center rounded-lg h-9 drawer-item-bg w-1/2 ml-3 pointer">选自壁纸收藏</div>
    </div>
  </a-drawer>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import HorizontalPanel from "../../HorizontalPanel.vue";
import path from "path";
import {mapWritableState} from "pinia";
import {paperStore} from "../../../store/paper";
export default {
  name: "CustomAssembly",
  components: { HomeComponentSlot ,HorizontalPanel},
  props:{
    customIndex:{
      type:Number,
      default:0
    },
    customData:{
      type:Object,
      default: ()=>{}
    },
  },
  data(){
    return{
      sizeList:[
        {title:'1x1',className:'small'}, {title:'1x2',className:''}, {title:'2x2',className:'double'},
      ],
      showName:false,
      mySize:{title:'1x1',className:'small'},
      myData:{title:'',link:{},img:{}},
      panelVisible:false,
      options: {
        className: 'card small',
        title: '',
        icon: '',
        type: 'remote',
        noTitle: true,
      },
      formulaBar:[
        {
          icon:"shezhi1",
          title:'设置',
          fn:()=>{
            this.panelVisible = true;
            this.$refs.customAssembly.visible = false
          }}
      ],
    }
  },
  computed: {
    ...mapWritableState(paperStore, ['settings','myPapers'])
  },
  methods:{
    async importFile() {
        let openPath = await tsbApi.dialog.showOpenDialog({
          title: '选择导入的代码',
          filters: [{name: '图片', extensions: ['png', 'jpg', 'jpeg', 'bmp', 'gif']}, {
            name: '视频',
            extensions: ['mp4', 'mpeg', 'avi', 'rmvb']
          }, {name: '全部', extensions: ['*']}],
          properties: ['multiSelections']
        })
      if (!openPath) {
        return
      } else {
        const imgReg = /.(jpg|jpeg|gif|bmp|png)$/  // 匹配图片正则
        const videoReg = /.(mp4|mpeg|avi|rmvb)$/ // 匹配视频正则

          if (imgReg.test(openPath[0])) {
          this.myData.img.src = openPath[0]

          } else if (videoReg.test(openPath[0])) {

            this.myData.img.srcProtocol = openPath[0]
          }

      }
      console.log(openPath[0])
    },
  },
  watch:{
    'mySize':{
      handler(){
        this.options.className = 'card' + ' ' + this.mySize.className
        this.$emit('customEvent')
      },
      immediate:true
    }
  }
}
</script>

<style scoped>

</style>
