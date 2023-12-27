<template>
 <xt-modal v-model="widgetVisible" full :footer="0" boxClass="px-3 pt-3" ref="modalRef">
    <template #header-center>
      <div class="xt-font xt-text font-16 font-400">壁纸小组件设置</div>
    </template>
    <div :style="isFull ? {width:'100%',height:'100%'}:{width:'452px'}" class="mb-6" :class="isFull ? 'flex items-center justify-center':'flex'">
      <div  class="flex flex-col p-4 xt-bg-2 rounded-lg" style="width: 452px;">
        <span class="xt-font font-16 font-400 xt-text">壁纸源</span>
        <span class="my-2.5 xt-font xt-text-2 font-400 font-14">选择需要在小组件上展示的壁纸源</span>
        <xt-select :list="wallpaperOptions" v-model="modelVal" zIndex="1001" :border="false" :h="40" :borderClass="'rounded-lg'" @change="updateSelectValue($event)" style="background: var(--main-bg);"></xt-select>
      </div>
    </div>
 </xt-modal>
</template>

<script>
import { wallpaperOptions } from '../../page/gallery/data/gallery'

export default {
 name:'WallpaperWidgetModal',

 props:['modelValue'],

 data(){
  return{
   widgetVisible:false,
   wallpaperOptions,
  }
 },

 computed:{
  isFull(){
    return this.$refs.modalRef.isFull
  },
  modelVal(){
    if(this.modelValue !== undefined){
      return this.modelValue;
    }
    else {
      return 'timeline';
    }
  }
 },

 methods:{
  // 触发弹窗事件
  openWidgetModal(){
    this.widgetVisible = true;
  },

  // 下拉选择后回调
  updateSelectValue(evt){
    this.$emit('updateCustomDatas',evt);
    this.widgetVisible = false;
  },
 }
};
</script>

<style lang="scss" scoped>
</style>