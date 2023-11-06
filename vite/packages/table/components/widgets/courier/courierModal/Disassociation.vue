<template>
  <teleport to='body'>
   <Modal v-if="modalVisible" v-model:visible="modalVisible" :blurFlag="true" style="z-index: 600;">
     <div class="flex px-5 my-3.5" style="width: 400px;">
      <CourierIcon icon="ant-design:info-circle-filled" style="font-size: 1.5rem;color: var(--warning);"/>
      <div class="flex flex-col ml-4 justify-between" style="width: 316px;">
       <span class="xt-text font-16  xt-font font-400">确定解除关联吗？</span>
       <span class="xt-text-2 my-4 xt-font font-16 font-400">
        解除后将不再同步快递包裹列表，你可以选择将当前已经同步的快递转移到自定义快递进行后续物流跟踪。
       </span>
       <div class="flex items-center justify-between">
        <a-checkbox v-model:checked="settings.customCourier">转到自定义快递</a-checkbox>
        <div class="flex">
         <xt-button w="64" h="40" @click="modalVisible = false">取消</xt-button>
         <xt-button w="64" h="40" class="ml-4" type="theme" @click="ok">确定</xt-button>
        </div>
       </div>
      </div>
     </div>
   </Modal>
  </teleport>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { courierStore } from "../../../../store/courier";
import { message } from "ant-design-vue";
import { Icon as CourierIcon } from '@iconify/vue'
import { appStore } from '../../../../store'

import Modal from '../../../Modal.vue' 

export default {
  props:['type'],
  components:{
   Modal,CourierIcon 
  },
  data(){
   return{
    modalVisible:false,
   }
  },

  computed:{
   ...mapWritableState(courierStore,['storeInfo']),
   ...mapWritableState(appStore,['settings']),
  },

  methods:{
   openDisassociation(){
    this.modalVisible = true
   },
   ok(){
    if(this.type === 'tb'){
      this.storeInfo.tb.nickname=null
      message.success('解除淘宝账号关联成功。')
      this.modalVisible = false
    }else{
      this.storeInfo.jd.nickname=null
      message.success('解除京东账号关联成功。')
      this.modalVisible = false
    }
   },

  }
}
</script>

<style lang="scss" scoped>
:deep(.ant-checkbox + span){
 color: var(--secondary-text) !important;
}
</style>