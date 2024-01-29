<template>
 <xt-modal v-model="themeVisible" :footer="0" title="主题颜色"   ref="themeFullRef">
  <div class="flex flex-col xt-bg-2 mx-2 rounded-lg p-3 " style="width: 500px;">
   <div class="flex flex-col">
    <span class="xt-font xt-text font-14 mb-3">主题色</span>
    <xt-option-color v-model:color="themeColor" class="w-full" style="padding-bottom: 0 !important;" :isLinear="false"></xt-option-color>
   </div>
   <div class="mb-2 mt-4" >
    <div class="xt-bb mx-auto"></div>
   </div>
   <div class="flex flex-col">
    <span class="xt-font xt-text font-14 mb-3">文字色</span>
    <xt-option-color v-model:color="textColor" :colorList="colorList" class="w-full" style="padding-bottom: 0 !important;" :isLinear="false"></xt-option-color>
   </div>

  </div>
 </xt-modal>
</template>

<script>
import { getBgColor,getTextColor, } from '../card/hooks/styleSwitch/getStyle';
import { setBgColor,setTextColor,setSecondaryBgColor } from '../card/hooks/styleSwitch/setStyle';
import {completeTask} from '../../apps/task/task'

export default{
  data(){
   return{
    textColor:"#FFFFFF",
    themeColor:"#508BFE",
    themeVisible:false,
    colorList:{
     color1: '#FFFFFF',
     color2: '#000000',
     color3: '#508BFE',
     color4: '#815BD0',
     color5: '#C8BF55',
     color6: '#DE5D5D',
     color7: '#808080',
     color8: '#43CADE',
     color9: '#57BF60',
     color10: '#DE5DB3',
    }
   }
  },

  mounted(){
   this.themeColor = getBgColor();
   this.textColor = getTextColor();
  },

  methods:{
   // 开启主题色设置方法
   openThemeSetting(){
    this.themeVisible = true;
   },

  },

  watch:{
   themeColor(newV){
    if(!newV) return;
    setBgColor(newV);
    setSecondaryBgColor(newV);

    completeTask('M0202')

   },
   textColor(newV){
    if(!newV) return;
    setTextColor(newV);
    completeTask('M0202')

   }

  },
}
</script>

<style lang="scss" scoped>
:deep(.item-box){
 &>div{
  margin-bottom: 0 !important;
 }
}
</style>
