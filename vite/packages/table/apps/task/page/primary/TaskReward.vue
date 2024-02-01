<template>
  <div class="flex w-full h-full flex-col">
   <span v-if="showTaskReward.lving !== 0" class="xt-text-2 font-14 font-400 xt-font">完成章节任务累计可获得以下奖励，预计可升 <span class="xt-font font-18" style="font-weight: 900;color: #FA7B14;">{{ showTaskReward.lving }}</span> 级！</span>
   <div class="flex ">
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
     <div class="w-12 h-12 flex items-center justify-center rounded-md relative" style="border: 1px solid rgba(255, 255, 255, 0.1);">
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
   </div>
  </div>

</template>

<script setup>
const props = defineProps({
  showTaskReward: {
    type: Object,
    default: () => {},
  },
});


</script>

<style lang="scss" scoped>
</style>