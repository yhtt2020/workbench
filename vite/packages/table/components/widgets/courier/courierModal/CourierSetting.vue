<template>
 <teleport to='body'>
  <Modal v-if="settingVisible" v-model:visible="settingVisible" :blurFlag="true" style="z-index: 510;">
    <div class="xt-text" style="width: 500px;height: 537px;">
      <div class="w-full flex items-center justify-center py-4" style="position: relative;">
        <span class="xt-text xt-font font-16 font-400">「我的快递」设置</span>
        <div class="flex right-button">
          <xt-button w="32" h="32" style="border-radius: 8px !important;" @click="settingVisible = false">
            <div class="flex items-center justify-center">
              <CourierIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;" />
            </div>
          </xt-button>
        </div>
      </div>

      <vue-custom-scrollbar :settings="settingsScroller" style="height:480px;">
        <SettingDetail />
      </vue-custom-scrollbar>
    </div>
  </Modal>
 </teleport>
</template>

<script>
import { Icon as CourierIcon } from '@iconify/vue'

import Modal from '../../../Modal.vue';
import SettingDetail from './SettingDetail.vue';

export default {
 components:{
  Modal,CourierIcon,
  SettingDetail
 },

 data(){
  return{
   settingVisible:false,
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
  }
 },

 methods:{
  openSettingModal(){
   this.settingVisible = true
  }
 }
};
</script>

<style lang="scss" scoped>
.right-button {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>