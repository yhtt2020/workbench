<template>
  <Widget :options="options" :menu-list="menuList" :desk="desk">
    <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:arrow-trending-lines-20-filled" style="font-size: 20px;" />
        </div>
      </template>
    <div @click="go" class="content pointer" style="color:var(--primary-text)">
      <div><a-progress type="circle"  stroke-color="#FF9C00" :percent="CPUData.useCPU.value" :strokeWidth="10" :width="105" style="margin-top: 28px">
        <template #format="percent">
            <div style="color:var(--primary-text);font-size: 24px;font-weight: 700;">{{CPUData.useCPU.value}}%</div>
            <div style="color:var(--primary-text);font-size: 14px;margin-top: 6px;">负载</div>
        </template>
      </a-progress>
      </div>
      <div>
        <div class="cpu right-content">
        <div class="cpu-number">
          <span>温度</span>
          <span style="font-weight: 700;">{{CPUData.warmCPU?.value}}℃</span></div>
      </div>
        <a-progress :showInfo="false" :status="CPUData.warmCPU?.value==0|| saving?'':'active'"  :percent="CPUData.warmCPU?.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div class="cpu" style="margin-top: 3px">
          <div class="cpu-number">
            <span>内存</span>
            <span style="font-weight: 700;">{{CPUData.useMemory.value}}%</span></div>
        </div>
        <a-progress :showInfo="false" :status="CPUData.useMemory.value==0|| saving?'':'active'" :percent="CPUData.useMemory.value" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div style="margin-top: 1px" class="text-left">CPU</div>
        <canvas id='myCPUCanvas' ref="myCPUCanvas"  style='width:130px;height:40px;margin-top: 5px'> </canvas>

      </div>
    </div>
  </Widget>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import {filterObjKeys,initCanvas} from "../../../util";
import Widget from "../../card/Widget.vue";
import { appStore } from '../../../store'
import { inspectorStore } from '../../../store/inspector'
import { message } from 'ant-design-vue'
import { Icon as newIcon } from '@iconify/vue';
export default {
  name: "SmallCPUCard",
  data(){
    return {
      options:{
        className:'card small',
        title:'CPU',
        // icon:'cpu',
        type:'smallCPUCard'
      },
      CPUData:{
        useCPU:{value:0},
        warmCPU:{value:0},
        useMemory:{value:0},
      },
      CPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
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
  components:{
    Widget,
    newIcon
  },
  props:{
    desk:{
      type:Object
    }
  },
  computed:{
    ...mapWritableState(inspectorStore,['displayData','aidaData']),
    ...mapWritableState(appStore,['saving'])
  }, mounted () {
    this.startInspect()
  },
  unmounted () {
    this.stopInspect()
  },
  watch: {
    "displayData": {
      handler(newVal, oldVal) {
        let {  useMemory, useCPU, warmCPU} = this.displayData || {}
        this.CPUData = {
          useCPU:useCPU,
          useMemory:useMemory,
          warmCPU:warmCPU
        }
        this.CPUData.useCPU.value&&  this.CPUList.push(this.CPUData.useCPU.value)
        this.CPUList.shift();
        if(!document.getElementById('myCPUCanvas')){
          return
        }
        this.initCanvas('myCPUCanvas',this.CPUList,6,12,"#515151","#3B8FFA")
      },
      deep: true,
    },
  },
  methods:{
    ...mapActions(inspectorStore, ['startInspect', 'stopInspect']),
    initCanvas,
    go(){
      this.$router.push({name:'inspector'})
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  .right-content{
    margin-top: 8px;
  }
}

.cpu{
  display: flex;
  .cpu-number{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }
}
</style>
