<template>
  <div @contextmenu.stop="showDrawer" :class="classes"
       :style="{pointerEvents:(editing?'none':''),width:customSize.width,height:customSize.height}" @click="onCPUIndex"
       @mouseleave="onMouseOut"
       @mouseenter="onMouseOver">
    <div
      style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;border-radius: 12px;z-index: 888;padding: 1em; backdrop-filter: blur(8px)"
      v-show="showTip"
      v-if="(options.type.includes('CPU')&&runAida64===false)||(options.type.includes('GPU')&&runAida64===false)"
    >
      <div :class="options.noTitle===true?'no-title':'content-title'">
        <div class="left-title" v-if="options.noTitle!==true">
          <Icon :icon="options.icon" class="title-icon"></Icon>
          <div>{{ options.title }}</div>
        </div>
        <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
          <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
        </div>
      </div>
      <div class="content-small text-lg absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span class="mb-2" style="font-size: 0.8em ;line-height: 1.2">需要安装，如图配置AIDA64并运行</span>
        <div class="mb-2">
          <AidaGuide></AidaGuide>
        </div>

        <div class="slot-btn bg-gray-700 pointer mb-2 h-8 w-24 flex justify-center items-center rounded-lg"
             @click="onDownAida">
          <span>立即下载</span>
        </div>
        <div v-if="options.type.includes('Four')" class="flex flex-col items-center">
          <span class="mb-2" style="font-size: 0.8em ;line-height: 1.2">监控游戏「FPS」需要安装并运行RTSS</span>
          <div class="slot-btn bg-gray-700 pointer mb-2 h-10 w-24 flex justify-center items-center rounded-lg"
               @click="onDownRTSS">
            <span>立即下载</span>
          </div>
        </div>
        <span class="text-base text-neutral-300">如果已经启动请等待大约30秒</span>
      </div>
    </div>

    <div :class="options.noTitle===true?'no-title':'content-title'" class="flex justify-between items-center">
      <div class="left-title" v-if="options.noTitle!==true">
        <Icon :icon="options.icon" class="title-icon"></Icon>
        <div class="w-2/3">{{ options.title }}</div>
      </div>
      <div class="right-title" v-if="gameRegionShow === true" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
    </div>
    <slot :customIndex="customIndex"></slot>
  </div>
  <a-drawer
    :contentWrapperStyle="{   backgroundColor:'#1F1F1F',}"
    :width="120"
    height="auto"
    class="drawer"
    :closable="true"
    placement="bottom"
    v-model:visible="visible"
    @close="onClose"
  >
    <div class=" ml-4 mb-3 flex flex-row items-center"  v-if="sizeList&&sizeList.length>0">
      <div class="mr-4">小组件尺寸</div>
      <HorizontalPanel :navList="sizeList" v-model:selectType="sizeType" bgColor="drawer-item-select-bg"></HorizontalPanel>
    </div>
    <hr style=" border: none; border-top: 1px solid rgba(255,255,255,0.10);" class="ml-4 mr-4 my-8"  v-if="sizeList&&sizeList.length>0">
    <div  class="flex flex-row">
      <div class="option h-24 w-24 ml-4" @click="item.fn()" v-for="item in formulaBar">
        <Icon class="icon" :icon="item.icon"></Icon>
        {{ item.title }}
      </div>
      <div class="option h-24 w-24 ml-4" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>
        删除
      </div>
      <div class="option h-24 w-24 ml-4" @click="onCopy" v-if="options.type.includes('CPU')||options.type.includes('GPU')">
        <Icon class="icon" icon="fuzhi"></Icon>
        复制数据
      </div>
    </div>
  </a-drawer>
  <textarea id="textArea" style="opacity: 0;height: 0;width: 0;position: absolute"
            v-if="options.type.includes('CPU')||options.type.includes('GPU')"></textarea>

</template>

<script>
import {mapActions, mapWritableState} from "pinia";
import {cardStore} from "../../store/card";
import {steamStore} from "../../store/steam";
import {message} from "ant-design-vue";
import AidaGuide from './supervisory/AidaGuide.vue'
import HorizontalPanel from "../HorizontalPanel.vue";
import _ from 'lodash-es'

export default {
  components: {AidaGuide,HorizontalPanel},
  data() {
    return {
      visible: false,
      showTip: false,
      settingVisible: false,
      gameRegionShow: false,
      regionName: '',
      epicShow: true,
      sizeType: {title:'',height:undefined,width:undefined,name:''},
    }
  },
  name: 'HomeComponentSlot',

  props: {
    sizeList:{
      type:Array,
      default:()=>[]
    },
    options: {
      type: Object,
      default: () => ({})
    },
    formulaBar: {
      type: Array,
      default: () => []
    },
    editing: {
      type: Boolean,
      default: false
    },
    customIndex: {
      type: Number,
      default: 0
    },
    runAida64: {
      type: Boolean,
      default: true
    },
    customData: {
      type: Object,
      default: () => {
      }
    },
    size: {
      type: Object,
      default: {
        width: undefined,
        height: undefined
      }
    }
  },

  computed: {
    ...mapWritableState(cardStore, ['aidaData', 'customComponents']),
    ...mapWritableState(steamStore, ["steamCC"]),
    isCustomData() {
      return Object.keys(this.customData).length !== 0
    },
    isCode() {
      return this.customData.hasOwnProperty('Code')
    },
    customSize(){
      return {
        width:this.size.width||((this.sizeType.width)*280+ ((this.sizeType.width)-1)*10+'px')||undefined,
        height:this.size.height||((this.sizeType.height)*205 + ((this.sizeType.height)-1)*10+'px')||undefined
      }
    },
    classes() {
      let defaultClass = {
        "gradient": true,
        "gradient--14": true
      }
      if (this.customData && this.customData.hideFrame) {
        defaultClass = {}
      }

      let classNameObject = {}
      if (Object.keys(defaultClass).length > 0) {
        if (this.options.className) {
          this.options.className.split(' ').map(c => {
            classNameObject[c] = true
          })
        }
      }
      let after=_.cloneDeep(Object.assign(classNameObject, defaultClass))
      if(Object.keys(after).length===0){
        after['no-frame']=true
      }
      return after
    }
  },
mounted() {
    let customData = this.$parent.customData||this.$parent.$attrs.customData||this.$parent.$parent.customData
    if(customData.width&&customData.height){
      this.sizeType={title:customData.width+ 'x' + customData.height,height:customData.height,width:customData.width,name:customData.width+ 'x' + customData.height}
      // this.$parent.$attrs.onCustomEvent()
      // console.log(this.$parent.$attrs.onCustomEvent)
    }
},

  watch:{
    'sizeType':{
      handler(){
        this.increaseCustomComponents(this.$parent.customIndex||this.$parent.$parent.customIndex||this.$parent.$attrs.customIndex,{
          width:this.sizeType.width,
          height:this.sizeType.height,
        })
      },
    }
},

  methods: {
    ...mapActions(cardStore, ["removeCustomComponents","increaseCustomComponents"]),
    showDrawer() {
      this.visible = true;
    },
    removeCard() {
     this.removeCustomComponents(this.$parent.customIndex||this.$parent.$parent.customIndex||this.$parent.$attrs.customIndex)
      this.visible = false
    },
    onSetup() {
      switch (this.options.title) {
        case '壁纸':
          this.settingVisible = true
          break;
      }
      this.visible = false
    },
    onGameSet() {
      this.gameVisible = true
    },
    onCPUIndex() {
      if (this.options.type.includes('CPU') || this.options.type.includes('GPU')) {
        // this.$router.push('CPUIndex')
      }
    },
    onDownAida() {
      ipc.send('addTab', {url: 'https://www.aida64.com/'})
    },
    onDownRTSS() {
      ipc.send('addTab', {url: 'https://www.guru3d.com/files-details/rtss-rivatuner-statistics-server-download.html'})

    },
    onMouseOver() {
      this.showTip = true
      this.gameRegionShow = true
    },
    onMouseOut() {
      this.showTip = false
      this.gameRegionShow = false
    },
    onCopy() {
      if (this.aidaData) {
        let textArea = document.getElementById('textArea')
        textArea.innerText = JSON.stringify(this.aidaData)
        textArea.select()
        document.execCommand('copy')
        this.visible = false
        message.info('复制成功！')
      } else {
        message.info('复制失败，请检查是否启动过aida64！')
      }
    },
    onClose() {
      this.visible = false
    }

  }
}
</script>

<style lang="scss" scoped>
.no-frame{
  position:relative;
}
</style>
