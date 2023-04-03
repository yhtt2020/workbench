<template>
  <div class=" gradient gradient--14" :class="options.className" :style="{pointerEvents:(editing?'none':'')}" @click="onCPUIndex"  @mouseleave="onMouseOut"   @mouseenter="onMouseOver">
    <div style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;border-radius: 12px;z-index: 888;padding: 1em; backdrop-filter: blur(8px)"
         v-show="showTip"   v-if="(options.type.includes('CPU')&&runAida64===false)||(options.type.includes('GPU')&&runAida64===false)"
     >
      <div :class="options.noTitle===true?'no-title':'content-title'" >
        <div class="left-title" v-if="options.noTitle!==true">
          <Icon :icon="options.icon" class="title-icon"></Icon>
          <div>{{options.title}}</div>
        </div>
        <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
          <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
        </div>
      </div>
      <div class="content-small" v-if="!options.type.includes('Four')"  >
        <span>需要安装并运行</span>
        <span>AIDA64</span>
        <div class="slot-btn pointer" @click="onDownAida">
          <span>立即下载</span>
        </div>
        <span>如果已经启动请等待大约30秒</span>
      </div>
      <div class="content-small" v-else   v-show="showTip">
        <span>需要安装并运行</span>
        <span>AIDA64</span>
        <div class="slot-btn pointer" @click="onDownAida">
          <span>立即下载</span>
        </div>
        <span>监控游戏「FPS」需要安装并运行</span>
        <span>RTSS</span>
        <div class="slot-btn pointer" @click="onDownRTSS">
          <span>立即下载</span>
        </div>
        <span>如果已经启动请等待大约30秒</span>
      </div>
  </div>

    <div :class="options.noTitle===true?'no-title':'content-title'" >
      <div class="left-title" v-if="options.noTitle!==true">
        <Icon :icon="options.icon" class="title-icon"></Icon>
        <div>{{options.title}}</div>
      </div>
      <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
    </div>
    <slot :customIndex="customIndex" ></slot>
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
      <div class="option" @click="onSetup" v-if="!options.type">
        <Icon class="icon" icon="shezhi1"></Icon>设置
      </div>
      <div class="option" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>删除
      </div>
    </div>
  </a-drawer>
</template>

<script>
import {mapActions} from "pinia";
import {tableStore} from "../../store";

export default {
  data(){
    return {
      visible:false,
      showTip:false
    }
  },
  name: "HomeComponentSlot",

  props:{
    options: {
      type: Object,
      default: () => ({})
    },
    editing:{
      type:Boolean,
      default:false
    },
    customIndex:{
      type:Number,
      default:0
    },
    runAida64:{
      type:Boolean,
      default:true
    }
  },
  methods:{
    ...mapActions(tableStore, ["removeCustomComponents"]),
    showDrawer()  {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    removeCard(){
      console.log(this.customIndex)
      this.removeCustomComponents(this.customIndex)
      this.visible = false;
    },
    onSetup(){
      switch (this.options.title){
        case "倒数日":
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: 'countdownDay',
              cname: '倒数日',
            },
          });break;
      }

    },
    onCPUIndex(){
      if(this.options.type.includes('CPU')||this.options.type.includes('GPU')){
       // this.$router.push('CPUIndex')
      }
    },
    onDownAida(){
      ipc.send('addTab',{url:'https://www.aida64.com/'})
    },
    onDownRTSS(){
      ipc.send('addTab',{url:'https://www.guru3d.com/files-details/rtss-rivatuner-statistics-server-download.html'})

    },
    onMouseOver(){
      this.showTip = true
    },
    onMouseOut(){
      this.showTip = false
    }
  }
}
</script>

<style lang="scss" scoped>



</style>
