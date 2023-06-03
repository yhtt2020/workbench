<template>
  <div class="flex items-center clip-container justify-between pr-5 mx-4">
    <div class="flex">
      <HorzontanlPanelIcon :navList="clipType" v-model:selectType="defaultClipType" class="mr-3"></HorzontanlPanelIcon>
      <TabSwitching :navList="cutType" v-model:activeType="defaultCutType"></TabSwitching>
      <div class="all-button" style="display: none;">
         <div class="flex items-center s-bg button-active p-3 pointer rounded-md mr-3" @click="openClipType">
           <Icon :icon="defaultCutType.icon" style="font-size:1.5em;"></Icon>
           <span class="ml-1">{{defaultCutType.title}}</span>
         </div>
      </div>
    </div>
    <div class="flex">
      <div class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="sousuo" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center" @click="openSet">
        <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
  </div>

  <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="mx-4 my-2 py-4">
    <router-view></router-view>
  </vue-custom-scrollbar>

  <a-drawer v-model:visible="setShow" title="设置" width="500" placement="right">
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <span class="mb-2 plain-font">剪贴板</span>
        <span class="light-grey-font">关闭后将停止读取剪贴板内容</span>
      </div>
      <a-switch v-model:checked="checkedShow"/>
    </div>
    <span class="plain-font">打开剪贴板应用快捷键</span>
    <div class="flex items-center my-6">
      <span class="mr-3 shortcut-area px-3 py-2.5 rounded-lg">{{ instruct }}</span>
      <span class="px-4 py-3 set-button pointer rounded-lg mr-3">更换按键</span> 
      <span class="px-4 py-3 set-button pointer rounded-lg">重置</span>
    </div>
    <span class="plain-font pb-6">历史记录容量</span>
    <HorizontalPanel class="mt-6 mb-6" :navList="historyCapacity"  bg-color="drawer-item-select-bg" v-model:selectType="defaultCapacity"></HorizontalPanel>
    <div class="w-full flex items-center plain-font s-item pointer justify-center rounded-lg py-3">清除剪贴板记录</div>
  </a-drawer>

  <HorizontalDrawer ref="clipRef" :rightSelect="cutType" @getArea="getClipItem"></HorizontalDrawer>
  
</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue';
import HorzontanlPanelIcon from '../../components/HorzontanlPanelIcon.vue'
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
import TabSwitching from '../../components/TabSwitching.vue';
export default {
  name:'Clipboard',
  components:{
    HorzontanlPanelIcon,
    TabSwitching,
    HorizontalPanel,
    HorizontalDrawer
  },
  data(){
    return{
      clipType:[
         {title:'剪贴板历史',icon:'time-circle',name:'history'},
         {title:'收藏',icon:'star',name:'collect'}
      ],
      defaultClipType:{title:'剪贴板历史',icon:'time-circle',name:'history'},
      cutType:[
        {title:'全部',icon:'appstore',name:'全部', textname:'all',typeName:'allClip'},
        {title:'文本',icon:'text-align-left',name:'文本', textname:'text', typeName:'textClip'},
        {title:'图片',icon:'image',name:'图片',textname:'image', typeName:'imageClip'},
        {title:'文件',icon:'file',name:'文件', textname:'file', typeName:'fileClip'},
        {title:'视频',icon:'video',name:'视频', textname:'video', typeName:'videoClip'},
        {title:'音频',icon:'erji1',name:'音频', textname:'audio', typeName:'audioClip'}
      ],
      defaultCutType: {title:'全部',icon:'appstore',name:'all'},
      setShow:false,
      checkedShow:true,
      instruct:'CTRL + ALT + V',
      historyCapacity:[
        {title:'1天',name:'day'},
        {title:'1周',name:'week'},
        {title:'1月',name:'month'},
        {title:'不限制',name:'unlimited'}
      ],
      defaultCapacity:{title:'1天',name:'day'},
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
    }
  },
  mounted(){
    this.$router.push({name:'allClip'})
  },
  methods:{
    //打开设置操作
    openSet(){
      this.setShow = true
    },
    openClipType(){
      this.$refs.clipRef.openDrawer()
    },
    getClipItem(v){
      this.defaultCutType = v
      this.$router.push({name:v.typeName})
    }
  },
  watch:{
    'defaultCutType':{
      handler(){
        this.defaultCutType = this.defaultCutType
        this.$router.push({name:this.defaultCutType.typeName})
      },
      immediate:true,
    },
  }
}
</script>

<style lang="scss" scoped>
.light-grey-font{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255,255,255,0.60);
  font-weight: 500;
}
.plain-font{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}

.set-button{
  background: #2A2A2A;
}
.shortcut-area{
  background: #2A2A2A;
  border: 1px solid rgba(255,255,255,0.1);
  width: 227px;
}

.button-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }
  &:hover{
    background: rgba(42, 42, 42, 0.25);
  }
}

.s-bg{
  box-shadow: none !important;
}

@media screen and (max-width:1064px ){
  :deep(.tab-item){
    display: none !important;
  }
  .clip-container{
    justify-content: start !important; 
  }
  .all-button{
    display: block !important;
  }
}
</style>