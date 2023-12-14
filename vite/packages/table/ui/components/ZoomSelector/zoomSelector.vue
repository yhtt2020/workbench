<script lang="ts">
import {defineComponent} from 'vue'
import XtButton from "../../libs/Button/index.vue";
import {message} from "ant-design-vue";

export default defineComponent({
  name: "zoomSelector",
  components: {XtButton},
  props: {
    isSingle: {
      //是否是独立设置
      type: Boolean,
      default: false
    },
    zoomSet: {
      //缩放集合，通过属性来实现键值对形式
      type:Object,
      default:{

      }
    },
    globalZoom: {
      //全局缩放
      type:Number,
      default:1
    },
    step:{
      type:Number,
      default:0.1
    },
    zoomKey:{
      type:String,
      default:''
    }
  },
  methods:{
    setSingleZoom (value) {
      this.isSingle = value
      this.$emit('changeMode',value)
      if (value) {
        message.success('启用方案独立缩放。')
      } else {
        message.success('关闭方案独立缩放。')
      }
    },
    zoomDown(){
      if(this.isSingle){
        this.zoomSet[this.zoomKey]-=this.step
      }else{
        this.$emit('update:globalZoom',this.globalZoom-this.step)
      }
    },
    zoomUp(){
      if(this.isSingle){
        this.zoomSet[this.zoomKey]+=this.step
      }else{
        this.$emit('update:globalZoom',this.globalZoom+this.step)
      }
    },
    resetZoom(){
      if(this.isSingle){
        this.zoomSet[this.zoomKey]+=1
      }else{
        this.$emit('update:globalZoom',1)
      }
    }
  }
})
</script>

<template>
<span class="mr-2 mt-1"> <a-switch @change="setSingleZoom" checked-children="独立" un-checked-children="通用"
                                   v-model:checked="appContent.singleZoom"></a-switch></span>
  <xt-button v-if="settings.zoom!==1" @click="resetZoom" size="mini" :w="40" :h="30">
    <xt-new-icon icon="fluent:arrow-clockwise-48-filled"></xt-new-icon>
  </xt-button>
  <template v-if="!appContent.singleZoom">
    <span class="mr-2 p-1">{{ (settings.zoom * 100).toFixed(0) }}%</span>
    <xt-button @click="zoomUp" size="mini" class="mr-2" :w="40" :h="30">+</xt-button>
    <xt-button class="mr-2" @click="zoomDown" size="mini" :w="40" :h="30">-</xt-button>
  </template>
  <template v-else>
    <span class="mr-2 p-1">{{ (appContent.zoom * 100).toFixed(0) }}%</span>
    <xt-button @click="singleZoomUp" size="mini" class="mr-2" :w="40" :h="30">+</xt-button>
    <xt-button class="mr-2" @click="singleZoomDown" size="mini" :w="40" :h="30">-</xt-button>
  </template>
</template>

<style scoped lang="scss">

</style>
