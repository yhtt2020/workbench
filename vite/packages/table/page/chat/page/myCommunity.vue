<template>
 <div>
   {{ info }}
 </div>
 <!-- <a-row class="w-full h-full">
  <a-col flex=" 0 1 300px" class="find-left h-full flex flex-col px-3"  style=" border-right:1px solid var(--divider);">
   <div class="flex flex-col">
    <div class="flex justify-between w-full mb-2.5">
     <span class="font-500" style="color:var(--primary-text);">{{ info.communityInfo.name }}</span>
    </div>

    <div class="font-14" style="color:var(--secondary-text);"></div>

   </div>

   <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)"/>


  </a-col>

  <a-col flex=" 1 1 200px" class="h-full flex flex-col">

  </a-col>
 </a-row> -->
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
 props:['info'],
 setup (props,ctx) {
  

  return {
   info:props.info,

  }
 }
})
</script>

<style lang="scss" scoped>
.font-500 {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.font-14 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.font-16 {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.group-item {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    background: var(--active-secondary-bg);
  }
}

:deep(.ant-row) {
  display: flex !important;
  flex: row nowrap !important;
}

.flip {
  transform: rotateY(180deg)
}
</style>