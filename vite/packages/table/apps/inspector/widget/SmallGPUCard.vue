<template>
  <xt-container
    v-model:customSize="customData.customSize"
    :customData="customData"
    :header="header"
    :devLimit="['h5']"
    :options="options"
    :menu-list="menuList"
    :customIndex="customIndex"
    :desk="desk"
    @delete="deleteCard">
    <div @click="go" class="content pointer" style="color:var(--primary-text)">
      <div><a-progress type="circle"  stroke-color="#FF9C00" :percent="GPUData.useGPU" :strokeWidth="10" :width="105" style="margin-top: 28px">
        <template #format="percent">
          <div style="color:var(--primary-text);font-size: 24px;font-weight: 700;">{{GPUData.useGPU.toFixed(1)}}%</div>
          <div style="color:var(--primary-text);font-size: 14px;margin-top: 6px">负载</div>
        </template>
      </a-progress>
      </div>
      <div class="right-content">
        <div class="cpu">
          <div class="cpu-number">
            <span>温度</span>
            <span style="font-weight: 700;">{{GPUData.warmGPU.toFixed(1)}}℃</span></div>
        </div>
        <a-progress :showInfo="false" :status="GPUData.warmGPU===0?'':'active'" :percent="GPUData.warmGPU" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div class="cpu" style="margin-top: 13px">
          <div class="cpu-number">
            <span>显存</span>
            <span style="font-weight: 700;">{{GPUStorage}}GB</span></div>
        </div>


        <div style="margin-top: 13px;" class="text-left">GPU</div>
        <canvas id='myGPUCanvas' ref="myGPUCanvas" style='width:130px;height:40px;margin-top: 5px'> </canvas>
      </div>
    </div>
  </xt-container >
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import {cardStore} from "../../../store/card";
import {filterObjKeys,initCanvas} from "../../../util";
import Widget from "../../../components/card/Widget.vue";
import { inspectorStore } from '../../../store/inspector'
import { message } from 'ant-design-vue'
import { Icon as newIcon } from '@iconify/vue';
export default {
  name: "SmallGPUCard",
  props:['desk','customData','openWay','customIndex'],
  data(){
    return {
      GPUData:{
        useGPU:0,
        warmGPU:0,
        videoStorage:0
      },
      GPUList:[999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
      menuList:[
        {
          title:'复制数据',
          icon:'fuzhi',
          fn:()=>{
            require('electron').clipboard.writeText(JSON.stringify(this.aidaData))
            message.success('复制成功')
          }
        }
      ],
      header:{
        title: 'GPU',
        // ifyIcon:'fluent:arrow-trending-lines-20-filled'
        showIcon:"/logo/performance.svg",

      }
    }
  },
  emit:['delete'],
  components:{
    Widget,
    newIcon
  },
  computed:{
    ...mapWritableState(inspectorStore,['displayData','aidaData']),
    GPUStorage() {
      return this.GPUData.videoStorage>0?(this.GPUData.videoStorage / 1000).toFixed(2):this.GPUData.videoStorage
    },
    options() {
      return {
        customDel:this.openWay === 'nav' ? true : false
      }
    }
  }, mounted () {
    this.startInspect()
    this.customData.customSize = '2x2'
  },
  unmounted () {
    this.stopInspect()
  },
  watch: {
    "displayData": {
      handler(newVal, oldVal) {
        let { useGPU, warmGPU, videoStorage} = this.displayData || {}
        this.GPUData = {
          useGPU:useGPU,
          warmGPU:warmGPU,
          videoStorage:videoStorage
        }
        this.GPUData.useGPU&& this.GPUList.push(this.GPUData.useGPU)
        this.GPUList.shift();
        if(!document.getElementById('myGPUCanvas')){
          return
        }
        this.initCanvas('myGPUCanvas',this.GPUList,6,12,"#515151","#3B8FFA")
      },
      deep: true,
    },
  },
  methods:{
    ...mapActions(inspectorStore, ['startInspect', 'stopInspect']),
    initCanvas,
    go(){
      this.$router.push({name:'inspector'})
    },
    deleteCard(){
      this.$emit('delete')
    }
  }
}
</script>



<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  font-weight: 400;
  // .right-content{
  //   margin-top: 8px;
  // }
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
