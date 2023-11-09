<template>
<Widget :options="options" :menu-list="menuList" :desk="desk">
  <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:arrow-trending-lines-20-filled" style="font-size: 24px;" />
        </div>
      </template>
  <div @click="go"  class="top-content pointer" style="color:var(--primary-text)">
    <div><span>{{CPUGPUData.useCPU.value}}%</span>
      <span>
      <Icon icon="cpu" class="icon" ></Icon>CPU</span>
    </div>

    <div>
      <span>{{CPUGPUData.useGPU.value}}%</span>
      <span>
      <Icon icon="xianka" class="icon"></Icon>GPU</span></div>

    <div>
      <span>{{CPUGPUData.useMemory.value}}%</span>
      <span>
      <Icon icon="neicun" class="icon"></Icon>内存</span></div>

    <div style="position: relative">
      <span>{{CPUGPUData.FPS.value}}</span>
      <a-tooltip v-if="CPUGPUData.FPS.value==0" :arrowPointAtCenter="true">
      <template #title>需要游戏运行在前台且打开RTSS方可读取到</template>
      <Icon v-zoom icon="tishi-xianxing" style="height: 24px;width: 24px;position: absolute;top: 12px;right: 12px;color: orange;margin: 0"></Icon>
    </a-tooltip>
      <span>
      <Icon icon="game" class="icon"></Icon>
        <span>FPS
      </span>
       </span>
    </div>
    <div class="buttom " style="border-radius: 5px">
      <div>
        <div> <Icon icon="xiazai" class="icon" style="color: #5CBBFF;"></Icon>
          <span>下载</span></div>

        <span>{{lastDown}}</span>
      </div>

     <div>
       <div><Icon icon="shangchuan" class="icon" style="color: #52C41A;"></Icon>
         <span>上传</span></div>

       <span>{{lastUp}}</span>
     </div>
   </div>
  </div>
</Widget>
</template>

<script>
import {mapWritableState,mapActions} from "pinia";
import {filterObjKeys, netWorkDownUp} from "../../../util";
import Widget from "../../card/Widget.vue";
import { inspectorStore } from '../../../store/inspector'
import {message} from 'ant-design-vue'
import {Icon as newIcon} from '@iconify/vue'
const {rpc}=window.$models

export default {
  name: "CPUFourCard",
  props:{
    desk:{
      type:Object
    }
  },
  data(){
    return {
      options:{
        className:'card',
        title:'性能',
        // icon:'dashboard',
        type:'CPUFourCard'
      },
      CPUGPUData:{
        useCPU:{value:0},
        useGPU:{value:0},
        useMemory:{value:0},
        FPS:{value:0},
        down:0,
        up:0
      },
      menuList:[
        {
          title:'复制数据',
          icon:'fuzhi',
          fn:()=>{
            require('electron').clipboard.writeText(JSON.stringify(this.aidaData))
            message.success('复制成功')
          }
        }
      ]

  }
  },

  // directives: {
  //   zoom: {
  //     created: (element) =>{
      //  element.getBoundingClientRectBak = element.getBoundingClientRect;
        // element.getBoundingClientRect = function () {
        //   const rect = element.getBoundingClientRectBak()
        //    var zoom = window.getComputedStyle(document.getElementById('scrollerBar')).zoom
        //   console.log(zoom)
        //   var scrollTop = document.getElementById('scrollerBar').getBoundingClientRect().top;
        //
        //   var scrollLeft = document.getElementById('scrollerBar').getBoundingClientRect().left;
        //   console.log(scrollLeft)
        //   var offsetScrollTop = scrollTop - (scrollTop / zoom);
        //   var offsetScrollLeft = scrollLeft - (scrollLeft / zoom);
        //   return new DOMRect(rect.x - offsetScrollLeft,rect.y - offsetScrollTop)
        // }
      //}
    //}
 // },
  components:{
    Widget,
    newIcon
  }, mounted () {
    this.startInspect()
  },
  unmounted () {
    this.stopInspect()
  },
  computed:{
    ...mapWritableState(inspectorStore, ["displayData",'aidaData']),
    lastDown(){
      return this.CPUGPUData.down < 1000 ? this.CPUGPUData.down +'KB/S' : this.CPUGPUData.down<1024000?(this.CPUGPUData.down/1024).toFixed(2) + 'MB/S':(this.CPUGPUData.down/1024/1024).toFixed(2) + 'GB/S'
    },
    lastUp(){
      return this.CPUGPUData.up < 1000 ? this.CPUGPUData.up +'KB/S' : this.CPUGPUData.up<1024000?(this.CPUGPUData.up/1024).toFixed(2) + 'MB/S':(this.CPUGPUData.up/1024/1024).toFixed(2) + 'GB/S'
    }
  },
  methods:{
    ...mapActions(inspectorStore, ['startInspect', 'stopInspect']),
    go(){
      this.$router.push({name:'inspector'})
    }
  },
  watch: {
    "displayData": {
      handler(newVal, oldVal) {
        let { useGPU, useMemory, useCPU, FPS, down, up} = this.displayData || {}
        this.CPUGPUData = {
          useGPU:useGPU,
          useCPU:useCPU,
          useMemory:useMemory,
          FPS:FPS,
          down:down,
          up:up
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>

.top-content{
  display: flex;
  flex-wrap: wrap;
  height: 95%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 0px;

  >div{
    width: 120px;
    margin-top: 12px;
    height: 120px;
    background: var(--secondary-bg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5%;
    >span{
      display: flex;
      align-items: center;
    }
    >span:first-child{
      font-size: 2.5em;
      font-weight: 700;

    }
  }
  >div:last-child{
    height: 90px;
    width: 100%;



  }
  .icon{
       width: 20px;
       height:20px;
  margin-right: .5em;
   }
}
.buttom{
    display: flex;
    flex-direction: column;
  >div{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    line-height: 100%;
    vertical-align: bottom;
    >div{
      display: flex;
      align-items: center;
    }
    >:nth-child(2){
      font-weight: 700;
    }

  }
}
</style>
