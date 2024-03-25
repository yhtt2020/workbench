<template>
 <xt-modal v-model="themeVisible" :footer="0" title="主题颜色"   ref="themeFullRef">
  <div class="flex flex-col xt-bg-2 mx-2 rounded-lg p-3 " style="width: 500px;">
   <div class="flex flex-col">
    <div class="flex items-center w-full mb-3">
      <span class="xt-font xt-text font-14 mr-3">主题色</span>  
      <div class="flex items-center justify-center" @click="restBgColor">
       <xt-button style="width: auto !important;" h="0">
         <div class="flex justify-center items-center">
           <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20"></xt-new-icon>
         </div>
       </xt-button>
      </div>
     </div>
    <xt-option-color v-model:color="themeColor" class="w-full" style="padding-bottom: 0 !important;" :isLinear="false"></xt-option-color>
   </div>
   <div class="mb-2 mt-4" >
    <div class="xt-bb mx-auto"></div>
   </div>
   <div class="flex flex-col">
    <div class="flex items-center h-10">
     <div class="flex items-center pointer justify-center" @click="restTextColor">
      <xt-button w="120" h="40" style="background: var(--primary-bg) !important;border-radius: 8px;">
        <div class="flex justify-center items-center xt-text">
          重置文字色
        </div>
      </xt-button>
     </div>
    </div>
   </div>

  </div>
 </xt-modal>
</template>

<script>
import { mapWritableState } from 'pinia';
import { getBgColor,getTextColor, } from '../card/hooks/styleSwitch/getStyle';
import { setBgColor,setTextColor,setSecondaryBgColor } from '../card/hooks/styleSwitch/setStyle';
import { delTextColor,delSecondaryBgColor,delBgColor } from '../card/hooks/styleSwitch/delStyle';
import {completeTask} from '../../apps/task/task';
import { appStore } from '../../store';


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

  computed:{
    ...mapWritableState(appStore,["styles"]),
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
   // 重置主题颜色
   restBgColor(){
    delBgColor();
    setBgColor('#508BFE');
    setSecondaryBgColor('#508BFE');
    this.themeColor = getBgColor();
   },
   // 重置文字颜色
   restTextColor(){
    delTextColor();
   },
   
  },

  watch:{
   themeColor(newV){
    if(!newV) return;
    setBgColor(newV);
    setSecondaryBgColor(newV);
    completeTask('M0202',()=>{ 
      this.$bus.emit('closeSystemSet');
    });
   },
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
