<template>
 <xt-modal v-model="addVisible" full ref="modalRef" title="添加" :mask="false" >
  <div :class="isFull ? 'flex items-center justify-center':'flex px-5'" :style="isFull ? { width:'100%',height:'100%' }:{width:'564px',height:'472px'}">
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;" >
      <div  :class="isFull ? 'flex flex-col items-center justify-center':'flex flex-col'">
        <div class="flex mb-3 justify-between" :style="isFull ? {width:'600px',padding:'0 7px'}:{width:'100%'}">
          <div class="flex flex-col  flex-grow relative">
            <template v-for="item in list[0].list">
              <div class="flex  rounded-lg xt-bg-2  control-item relative" :class="item.id === 'music' ? 'music-h':'volume-h'" :style="isFull ? {maxWidth:'300px',marginRight:'16px'} : {maxWidth:'254px'}">
                 <template v-if="item.id === 'music'">
                  <div class="flex items-center justify-between w-full " style="padding: 0 22px;">
                    <xt-new-icon icon="fluent:previous-16-filled"  size="24" :color="'var(--disable-text)'"></xt-new-icon>
                    <xt-new-icon icon="fluent:play-16-filled" size="24" :color="'var(--primary-text)'"></xt-new-icon>
                    <xt-new-icon icon="fluent:next-16-filled" size="24" :color="'var(--disable-text)'"></xt-new-icon>
                  </div>
                 </template>
                 <template v-else>
                   <div class="w-full flex items-center justify-between pr-4">
                    <div style="width: 129px;background: var(--primary-text);" class="rounded-tl-xl volume-h rounded-bl-xl"></div>
                    <xt-new-icon icon="fluent:speaker-2-16-regular" size="24" :color="'var(--primary-text)'"></xt-new-icon>
                   </div>
                 </template>
              </div>
            </template>
            <div class="absolute" style="top:8px;right: 14px;">
              <xt-button style="width: auto !important;" h="0">
                <div class="flex items-center justify-center">
                  <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
                </div>
              </xt-button>
              <!-- <xt-new-icon icon="fluent:checkmark-circle-16-filled" size="20" :color="'var(--link)'"></xt-new-icon> -->
            </div>
          </div>

          <div class="flex justify-between flex-grow" :style="isFull ? {maxWidth:'285px'} : {maxWidth:'254px'}">
            <template v-for="item in list.slice(2,4)">
              <div class="flex  rounded-lg xt-bg-2 items-center justify-center relative" style="height: 120px;" :style="isFull ? { width:'134px' } :{width:'119px',}">
                <div class="xt-bg-2 rounded-xl flex items-center flex-col justify-center">
                  <div class="w-14 h-14 xt-bg rounded-full flex items-center justify-center mb-3">
                    <xt-new-icon :icon="item.icon" size="24"></xt-new-icon>
                  </div>
                  <span class="xt-font xt-text font-14">{{ item.name }}</span>
                  <div class="absolute" style="top:-2px;right: -2.5px;">
                   <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
                   <!-- <xt-new-icon icon="fluent:checkmark-circle-16-filled" size="20" :color="'var(--link)'"></xt-new-icon> -->
                  </div>
                 </div>
              </div> 
            </template>
          </div>
        </div>

        <div class="flex">
          <a-row :gutter="[16,16]">
            <a-col class="image-wrapper" v-for="item in list.slice(4)" :span="6" :style="{width:'120px'}">
             <div class="xt-bg-2 rounded-xl flex items-center flex-col justify-center relative" style="height: 120px;">
              <div class="w-14 h-14 xt-bg rounded-full flex items-center justify-center mb-3">
                <xt-new-icon :icon="item.icon" size="24"></xt-new-icon>
              </div>
              <span class="xt-font xt-text font-14">{{ item.name }}</span>
              <div class="absolute" style="top:6px;right: -2px;">
                <xt-button style="width: auto !important;" h="0" @click="add(item)">
                  <div class="flex items-center justify-center">
                    <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
                  </div>
                </xt-button>
                <!-- <xt-new-icon icon="fluent:checkmark-circle-16-filled" size="20" :color="'var(--link)'"></xt-new-icon> -->
              </div>
             </div>
            </a-col>
          </a-row>
        </div>
      </div>
     </XtScrollbar>
  </div>
 </xt-modal>
</template>

<script setup>
import { computed, ref } from 'vue';
import control from '../../hook/controlList';


const addVisible = ref(false);
const list = ref(control.list);
const modalRef = ref(null);

const openAddModal = () =>{
 addVisible.value = true;
}

// 添加
const add = (val) =>{
  console.log('添加',val);
}



// 计算判断是否开启全屏
const isFull = computed(()=>{
  return modalRef.value.isFull;
})

defineExpose({
 openAddModal
})

</script>

<style lang="scss" scoped>
.item-add{
 &:nth-of-type(4n){
  margin-right: 0px;
 }
}
.control-item{
  &:first-of-type{
    margin-bottom: 14px;
  }
}
.music-h{
  height: 54px;
}
.volume-h{
  height: 52px;
}
</style>