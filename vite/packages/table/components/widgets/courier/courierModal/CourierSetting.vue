<template>
 <teleport to='body'>
  <xt-modal v-if="settingVisible" v-model="settingVisible" :index="1001" title="「我的快递」设置"  :blurFlag="true" :footer="false" >
    <div class="xt-text mb-4" style="width: 500px;height:100%;">
      <vue-custom-scrollbar :settings="settingsScroller" style="height:480px;">
        <SettingDetail />
      </vue-custom-scrollbar>
    </div>
  </xt-modal>
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
