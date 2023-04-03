<template>
  <div :class="options.className" :style="{pointerEvents:(editing?'none':'')}" @click="onCPUIndex"  @mouseleave="onMouseOut"   @mouseenter="onMouseOver">
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
.title-icon{
  width: 24px;
  height: 24px;
}
.no-title{
  .title-icon{
    color: #818181;
  }
  .right-title{
   position: absolute;
    top: 1em;
    right: 1em;
  }
}

.content-small{
  display: flex;
   flex-direction: column;
  position: absolute;
  font-size: 16px;
  >span:first-child {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 0px;
    color: rgba(255, 255, 255, 0.6);
  }
  >span:nth-child(2) {
    margin-top: 14px;
    font-size: 18px;
    font-weight: 400;
  }
  >span:nth-child(4) {
    margin-top: 30px;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 0px;
    color: rgba(255, 255, 255, 0.6);
  }
  >span:nth-child(5) {
    margin-top: 14px;
    font-size: 18px;
    font-weight: 400;
  }
  >span:nth-child(7) {
    margin-top: 30px;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 0px;
    color: rgba(255, 255, 255, 0.6);
  }
  top:25%;
  left: 50%;
  align-items: center;
  transform: translateX(-50%);
   }
.content-title{
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  .left-title{

    display: flex;
    width: 35%;
    align-items: center;

    :last-child{
      margin-left: .5em;
    }
  }
  .right-title{

    align-items: center;
    display: flex;
    .title-icon{
      color: #818181;
    }
  }

}
.option{
  background: #161616;
  width: 8em;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10%;
  margin-left: 1.8em;
  cursor:pointer;
  .icon{
    width: 3em;
    height: 3em;
    vertical-align: middle;
  }
}
.slot-btn{
  width: 120px;
  height: 48px;
  border-radius: 12px;
  background: rgba(42, 42, 42, 1);
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  line-height: 48px;
  margin-top: 14px;
}
</style>
