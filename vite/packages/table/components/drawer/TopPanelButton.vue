<template>
 <div class="flex items-center justify-center h-12 relative mr-3 no-drag">
  <div v-if="!assistStatus" style="width:auto !important;"  @click="closeAided" class="p-1 btn-hover  rounded-md pointer category-button">
  <div class="flex items-center justify-center">
   <div class="mr-1 flex items-center justify-center">
    <TopButtonIcon icon="fluent:accessibility-16-regular" class="xt-text" style="font-size: 1.25rem;"/>
   </div>
   <span class="xt-text xt-font font-14">辅助模式</span>
  </div>
  </div>
  <div class="absolute xt-bg-2 flex items-center p-3 justify-center h-14 rounded-md no-drag" v-if="showClose" style="width: 200px;top:38px; right: -63px; z-index: 50;">
   <xt-button h="40" class="category-button" style="border-radius: 6px; padding:0 8px !important; width: auto !important;" @click="closeAidedModal">
    <div class="flex items-center justify-center">
     <TopButtonIcon icon="fluent:accessibility-16-regular" class="xt-text mr-4" style="font-size: 1.25rem;"/>
     <span class="xt-text xt-font font-14">关闭辅助模式</span>
    </div>
   </xt-button>
  </div>
 </div>
 
</template>

<script setup>
import { ref,computed,} from 'vue';
import { storeToRefs } from 'pinia';
import { appStore} from '../../store';
import { Icon as TopButtonIcon } from '@iconify/vue';

const app = appStore();
const {  aided } = storeToRefs(app);

const assistStatus = computed(()=>{
 return aided.value
})

const showClose = ref(false);

const closeAided = () =>{
 showClose.value = !showClose.value;
}

const closeAidedModal = () =>{
 aided.value = false;
 showClose.value = false;
}

</script>

<style lang="scss" scoped>
.btn-hover{
 &:hover{
  background: var(--secondary-transp-bg) !important;
 }
}
</style>