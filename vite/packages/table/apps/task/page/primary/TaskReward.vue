<template>
  <div class="flex w-full h-full flex-col" :class="isCenter">
    <div class="flex mb-2" v-if="showTip">
      <span  class="xt-text-2 font-14 font-400 xt-font">完成章节任务累计可获得以下奖励</span>
      <span class="xt-text-2 font-14 font-400 xt-font"  v-if="expectedLV !== 0">，预计可升 <span class="xt-font font-18" style="font-weight: 900;color: #FA7B14;">{{ expectedLV }}</span> 级！</span>
    </div>
    <div class="flex ">
      <a-tooltip title="经验可以提升社区等级" placement="bottom">
        <div class="w-12 h-12 flex items-center justify-center rounded-md relative mr-3" style="border: 1px solid rgba(255, 255, 255, 0.1);">
          <div class="absolute top-0 w-6 rounded-tr-md rounded-bl-md flex items-center justify-center" style="height: 15px; font-size: 9px;background: #508bfe;right: -1px;">
            {{ showTaskReward.experience.name }}
          </div>
          <div style="width: 30px; height: 30px;" class="flex items-center justify-center">
            <img :src="showTaskReward.experience.img" class="w-full h-full object-cover"/>
          </div>
          <div class="absolute bottom-0 w-6 rounded-tr-md rounded-bl-md flex items-center justify-center" style="height: 15px; font-size: 9px;right: -2px;">
            {{ showTaskReward.experience.total }}
          </div>
        </div>
      </a-tooltip>

      <a-tooltip title="积分可以兑换礼品" placement="bottom">
       <div class="w-12 h-12 flex items-center justify-center rounded-md relative" style="border: 1px solid rgba(255, 255, 255, 0.1);"
        :class="isExits ? 'mr-3':''"
       >
        <div class="absolute top-0 w-6 rounded-tr-md rounded-bl-md flex items-center justify-center" style="height: 15px; font-size: 9px;background: #508bfe;right: -1px;">
         {{ showTaskReward.points.name }}
        </div>
        <div style="width: 36px; height: 36px;" class="flex items-center justify-center">
         <img :src="showTaskReward.points.img" class="w-full h-full object-cover"/>
        </div>
        <div class="absolute bottom-0 w-6 rounded-tr-md rounded-bl-md flex items-center justify-center" style="height: 15px; font-size: 9px;right: -2px;">
        {{ showTaskReward.points.total }}
        </div>
       </div>
      </a-tooltip>


     <div class="w-12 h-12 flex items-center justify-center rounded-md relative mr-3"
      style="border: 1px solid rgba(255, 255, 255, 0.1);" v-for="item in showTaskReward?.medals?.list"
    >
      <div class="absolute top-0 w-6 rounded-tr-md rounded-bl-md flex items-center justify-center" style="height: 15px; font-size: 9px;background: #508bfe;right: -1px;z-index: 1">
       勋章
      </div>
       <Medal :medal="{medal:item}" :size="36" style="position: relative;" placement="bottom"></Medal>
     </div>

     <div class="w-12 h-12 flex items-center justify-center rounded-md relative mr-3"
      style="border: 1px solid rgba(255, 255, 255, 0.1);" v-for="item in showTaskReward?.items?.list"
    >
      <div class="absolute top-0 w-6 rounded-tr-md rounded-bl-md flex items-center justify-center" style="height: 15px; font-size: 9px;background: #508bfe;right: -1px;z-index: 1">
        头像
      </div>
      <div style="width: 36px; height: 36px;" class="flex items-center justify-center">
       <Item :item="item" :size="36"></Item>
      </div>
     </div>
    </div>
  </div>

</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { appStore } from '../../../../store';

import Medal from '../../../../components/team/Medal.vue';
import Item from '../../../../components/Item.vue';
// import { Tooltip } from 'ant-design-vue';
 
const props = defineProps({
  showTaskReward: {
    type: Object,
    default: () => {},
  },
  showTip:{
    type:Boolean,
    default:true,
  },
  isCenter:{
    type:String,
    default:''
  }
});

const app = appStore();
const { userInfo } = storeToRefs(app);


const isExits = computed(()=>{
  if(props.showTaskReward.items && props.showTaskReward.medals){
    return true;
  }
  else {
    return false;
  }
});

// 计算预计升多少级
const expectedLV = computed(()=>{
  const exp = props.showTaskReward.experience.total;
  const diff = userInfo.value?.grade?.diff;
  if((exp > diff)){
    return 1;
  }
  else {
    return 0;
  }
});

</script>

<style lang="scss" scoped>
</style>
