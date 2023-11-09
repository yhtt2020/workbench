<template>
  <teleport to='body' >
   <Modal  v-model:visible="editVisible" v-if="editVisible" :blurFlag="true" style="z-index: 750;">
    <div class="flex flex-col" style="width: 500px;height: 250px;">
     <div class="flex items-center justify-center w-full h-16 py-4 px-4" style="position: relative;">
      <span class="xt-text xt-font font-16 font-400">编辑快递</span>
      <div class="right-close">
       <xt-button w="32" h="32" class="category-button" style="border-radius: 8px;" @click="editVisible = false">
         <div class="flex items-center justify-center">
          <EditIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;"/>
         </div>
       </xt-button>
      </div>
     </div>

     <div class="mb-4 px-6 flex flex-col">
       <div class="flex items-center mb-4">
        <div class="flex items-center mr-3 justify-center rounded-lg w-14 h-14 pointer category-button xt-bg-2" @click="onUpdateImg">
          <a-avatar :size="32" :src="editAvatar"></a-avatar>
        </div>
        <GoodIcon v-show="goodIconVisible" :goodVisible="false" :windowHeight="innerHeight" @getAvatar="getAvatar" />
        <a-input class="xt-bg-2 h-10" v-model:value="editName" style="width:383px;border-radius: 8px;"></a-input>
       </div>
       <div class="flex " >
         <a-input class="xt-bg-2"  v-model:value="editNum" placeholder="快递单号" style="width: 188px;border-radius: 8px;"></a-input>
         <a-input class="xt-bg-2" v-model:value="editPhone" placeholder="手机尾号" style="width:120px;border-radius: 8px;margin: 0 12px;"></a-input>
         <a-select class="custom-select xt-text-2" v-model:value="editValue" placeholder="自动识别"  style="width:120px;border-radius: 8px;">
          <a-select-option v-for="item in optionList" :value="item.code" class="xt-text-2">
            {{ item.name }}
          </a-select-option>
         </a-select>
       </div>
     </div>


     <div class="px-4 flex justify-end">
       <xt-button w="64" h="40" class="mr-3" style="border-radius: 8px;" @click="editVisible = false">取消</xt-button>
       <xt-button w="64" h="40"  style="border-radius: 8px;" type="theme" @click="submitEdit">确定</xt-button>
     </div>
    </div>

   </Modal>
  </teleport>
</template>

<script>
import { Icon as EditIcon } from '@iconify/vue'
import { expressList } from './modalMock'
import { getCourierName } from './utils/courierUtils'

import Modal from '../../../Modal.vue';
import GoodIcon from '../../../../../selectIcon/page/index.vue'

export default {
 components:{
  Modal,EditIcon,GoodIcon
 },

 props:['editContent','avatar'],

 data(){
  return{
   editVisible:false,
   editName:'IKEA宜家沙发',
   editNum:'SF00003618100',
   editPhone:'9150',
   optionList:expressList,
   editValue:'',
   goodIconVisible:false,
   innerHeight:100,
   editAvatar:this.avatar
  }
 },

 mounted(){
  this.editValue = getCourierName(this.editNum).code
 },

 methods:{
  openEditModal(){
   this.editVisible = true
  },

  onUpdateImg(){
   this.goodIconVisible = !this.goodIconVisible
  },

  // 获取头像
  getAvatar(avatar){
     if(avatar.indexOf('color=') >= 0){
       let color = avatar.substr(avatar.indexOf('color=') + 7 ,6)
       this.bgColor = color
     }else{
       this.bgColor = ''
     }
     this.editAvatar = avatar
  },


  submitEdit(){
    // todo  编辑后的操作
  }

 }

};
</script>

<style lang="scss" scoped>
.right-close{
 position: absolute;
 top: 16px;
 right: 16px;
}

:deep(.custom-select){
  & .ant-select-selector {
    border-radius: 8px !important;
    display: flex;
    align-items: center;
    height: 40px !important;
  }
}


:deep(.ant-select-single .ant-select-selector .ant-select-selection-item, .ant-select-single .ant-select-selector .ant-select-selection-placeholder){
  color: var(--secondary-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}


:deep(.ant-select-selection-search){
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
}


:deep(.anticon.ant-input-clear-icon){
  color:var(--secondary-text) !important;
}

:deep(.ant-input){
  color: var(--secondary-text) !important;
  font-size: 14px;
  font-weight: 400;
  &::placeholder{
   color: var(--secondary-text) !important;
  }
}

:deep(.float-icon){
 top:125px !important;
}
</style>