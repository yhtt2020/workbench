<template>
  <div  @contextmenu.stop="showDrawer" class="gradient gradient--14" :class="options.className"
       :style="{pointerEvents:(editing?'none':'')}" @click="onCPUIndex" @mouseleave="onMouseOut"
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

        <div class="slot-btn bg-gray-700 pointer mb-2 h-8 w-24 flex justify-center items-center rounded-xl"
             @click="onDownAida">
          <span>立即下载</span>
        </div>
        <div v-if="options.type.includes('Four')" class="flex flex-col items-center">
          <span class="mb-2" style="font-size: 0.8em ;line-height: 1.2">监控游戏「FPS」需要安装并运行RTSS</span>
          <div class="slot-btn bg-gray-700 pointer mb-2 h-10 w-24 flex justify-center items-center rounded-xl"
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
      <div class="flex justify-center items-center" v-if="gameRegionShow === false && options.type.includes('games')">
        <span class="rounded-md w-auto text-white text-opacity-60" style="background: rgba(255, 255,255, 0.2); font-size: 12px;text-align: center;line-height: 22px;padding: 0 5px;">{{ gameRegion.name }}</span>
      </div>
      <div class="right-title" v-if="gameRegionShow === true" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
    </div>
    <slot :customIndex="customIndex"></slot>
  </div>
  <a-drawer
    :contentWrapperStyle="{   backgroundColor:'#1F1F1F',height:'11em',}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="visible"
    @close="onClose"
  >
    <div style="display: flex;flex-direction: row;height: 100%">
      <div class="option" @click="onSetup" v-if="options.type.includes('downDay')||options.type.includes('Wallpaper')">
        <Icon class="icon" icon="shezhi1"></Icon>
        设置
      </div>
      <div class="option" @click="onGameSet" v-if="options.type.includes('games')">
        <Icon class="icon" icon="shezhi1"></Icon>设置
      </div>
      <div class="option" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>
        删除
      </div>
      <div class="option" @click="onCopy" v-if="options.type.includes('CPU')||options.type.includes('GPU')">
        <Icon class="icon" icon="fuzhi"></Icon>
        复制数据
      </div>
    </div>
  </a-drawer>
  <textarea id="textArea" style="opacity: 0;height: 0;width: 0;position: absolute" v-if="options.type.includes('CPU')||options.type.includes('GPU')"></textarea>

  <a-drawer :width="500" title="设置" style="text-align: center;" :bodyStyle="{textAlign:'left'}"  placement="right" :visible="gameVisible" @close="onClose">
     <div class="flex flex-col justify-start">
      <span style="margin-bottom: 14px;">默认地区</span>
      <a-select style="width: 452px" @change="getRegion($event)" v-model:value="defaultRegion">
        <a-select-option v-for="item in region" :value="item.id">{{item.name}}</a-select-option>
      </a-select>
     </div>
  </a-drawer>
  <a-drawer :width="500"  v-model:visible="settingVisible" placement="right">
    <template #title>
     <div class="text-center">「{{options.title}}」设置</div>
    </template>
    <div class="text-base">壁纸源</div>
    <a-select style="background: rgba(42, 42, 42, 1);border: 1px solid rgba(255, 255, 255, 0.1);"
     class="w-full h-10 rounded-xl mt-4 text-xs" size="large" :bordered="false" v-model:value="pickFilterValue"
      @change="pickFilterChange($event)"  :options="wallpaperOptions">
    </a-select>
  </a-drawer>
</template>

<script>
import {mapActions, mapWritableState} from "pinia";
import {cardStore} from "../../store/card";
import { steamStore } from "../../store/steam";
import {message} from "ant-design-vue";
import AidaGuide from './supervisory/AidaGuide.vue'

export default {
  components: { AidaGuide },
  data () {
    return {
      visible:false,
      showTip:false,
      gameVisible:false,
      settingVisible:false,
      pickFilterValue:'我的收藏',
      wallpaperOptions: [
        {value:'我的收藏',name:'my',path:''},
        {value:'必应壁纸',name:'bing',path:'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=1&n=8'},
        {value:'拾光壁纸',path:'https://api.nguaduot.cn/timeline/v2',name:'picking'},
        {value:'贪食鬼',path:'https://api.nguaduot.cn/glutton/journal',name:'picking'},
        {value:'贪吃蛇',path:'https://api.nguaduot.cn/glutton/snake',name:'picking'},
        {value:'wallhaven',path:'https://api.nguaduot.cn/wallhaven/v2',name:'wallhaven'},
        // {value:'动态壁纸',name:'lively',path:'https://api.nguaduot.cn/timeline/v2'}
      ],
      region:[
        {
          id:'us',
          name:'美国'
        },
        {
          id:'ca',
          name:'加拿大'
        },
        {
          id:'gb',
          name:'英国'
        },{
          id:'fr',
          name:'法国'
        },{
          id:'de',
          name:'德国'
        },{
          id:'it',
          name:'意大利'
        },{
          id:'jp',
          name:'日本',
        },{
          id:'cn',
          name:'国区',
        },{
          id:'br',
          name:'巴西',
        },{
          id:'in',
          name:'印度',
        },{
          id:'ru',
          name:'俄罗斯',
        },{
          id:'au',
          name:'澳大利亚',
        },
        {
          id:'hk',
          name:'香港',
        },
        {
          id:'ar',
          name:'阿根廷',
        }

      ],
      defaultRegion:'cn',
      gameRegionShow:false
    }
  },
  name: 'HomeComponentSlot',

  props: {
    options: {
      type: Object,
      default: () => ({})
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
    }
  },
  computed: {
    ...mapWritableState(cardStore, ['aidaData']),
    ...mapWritableState(steamStore,["gameRegion"])
  },
  methods:{
    ...mapActions(cardStore, ["removeCustomComponents"]),
    ...mapActions(steamStore,["saveRegion","fetchData"]),
    showDrawer()  {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.gameVisible = false
      const findIndex =  this.region.find(el=>{
          if(el.id === this.defaultRegion){
            return  el
          }
      })
      this.saveRegion(findIndex)
      this.fetchData()
    },
    removeCard () {
      this.removeCustomComponents(this.customIndex)
      this.visible = false
    },
    onSetup () {

      switch (this.options.title) {
        case '纪念日':
          this.$router.push({
            name: 'addCardSetting',
            params: {
              name: 'countdownDay',
              cname: '纪念日',
            },
          })
          break;
        case '壁纸':
        this.settingVisible=true
          break;
      }
      this.visible = false
    },
    onGameSet(){
      this.gameVisible = true
    },
    onCPUIndex(){
      if(this.options.type.includes('CPU')||this.options.type.includes('GPU')){
       // this.$router.push('CPUIndex')
      }
    },
    onDownAida () {
      ipc.send('addTab', { url: 'https://www.aida64.com/' })
    },
    onDownRTSS () {
      ipc.send('addTab', { url: 'https://www.guru3d.com/files-details/rtss-rivatuner-statistics-server-download.html' })

    },
    onMouseOver () {
      this.showTip = true
      this.gameRegionShow = true
    },
    onMouseOut () {
      this.showTip = false
      this.gameRegionShow = false
    },
    onCopy () {
      if (this.aidaData) {
        let textArea = document.getElementById('textArea')
        textArea.innerText = JSON.stringify(this.aidaData)
        console.log(textArea)
        textArea.select()
        document.execCommand('copy')
        this.visible = false
        message.info('复制成功！')
      } else {
        message.info('复制失败，请检查是否启动过aida64！')
      }
    },
    // 获取steam地区
    getRegion(e){
      this.defaultRegion = e
    },
    pickFilterChange(e){
      this.$emit('pickFilterChange',this.wallpaperOptions.find(i => i.value === e))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
