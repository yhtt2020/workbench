<template>
  <a-dropdown trigger="click" >
   <div class="flex pointer items-center justify-center">
    <EllipsisOutlined style="font-size: 1.25em;color:var(--secondary-text);"/>
   </div>
   <template #overlay>
    <a-menu class="custom-dropdown-menu flex-col flex items-center justify-center" style="background: var(--secondary-bg);">
     <a-menu-item v-for="(item,index) in dropDownList"
      style="color: var(--secondary-text);width:184px;margin-bottom: 8px;" class="rounded-lg flex items-center h-11 drop-item"
      :class="{'select':dropDownIndex === index}"
      @click="selectMenuItem(item,index)"
     >
       <DorpIcon :icon="item.icon" style="font-size: 2em;"/>
       <span class="pl-4 font-16" style="color:var(--primary-text);"> {{ item.title }}</span>
     </a-menu-item>
    </a-menu>
  </template>
  </a-dropdown>
 
 
  <teleport to='body' >
   <Modal v-if="categoryShow" v-model:visible="categoryShow" :blurFlag="true" style="z-index:2000 !important;">
     <MenuCategory v-if="type === 'apply' " :no="no" @close="categoryShow = false"></MenuCategory>
     <CreateNewCategory v-if="type === 'category'" :no="no" @close="categoryShow = false"></CreateNewCategory>
    </Modal>
  </teleport>
 
 </template>
 
 <script>
 import { defineComponent, reactive, toRefs,watchEffect} from 'vue'
 import { EllipsisOutlined } from '@ant-design/icons-vue'
 import { chatStore } from '../../../../store/chat'
 import { Icon as DorpIcon } from '@iconify/vue'
 
 import Modal from '../../../../components/Modal.vue'
 import CreateNewCategory from '../createNewCategory.vue'
 import MenuCategory from '../menuCategory.vue'
 
 export default defineComponent({
  components:{
   EllipsisOutlined,
   DorpIcon,Modal,CreateNewCategory,MenuCategory,

  },
 
  props:['list','no'],
 
  setup (props,ctx) {

   const chat = chatStore()
 
   const data = reactive({
    dropDownList:[],
    dropDownIndex:0,
    type:'',
    categoryShow:false,
   })

   watchEffect(()=>{
     data.dropDownList = props.list
   })
 
   const selectMenuItem = (item,index) =>{
    data.dropDownIndex = index;
    data.type = item.type;
    switch (item.type) {
     case 'change':
       chat.setDouble()
      //  console.log('测试',11)
       ctx.emit('updatePage')
       break;
     case 'show':
       chat.setFloatVisible(false)
       break;
     case 'hidden':
       chat.setFloatVisible(true)
       break;
     case 'apply':
       setTimeout(()=>{
         data.categoryShow = true
       },350)
       break;
     case 'category':
       setTimeout(()=>{
         data.categoryShow = true
       },350)
       break;
    }
  
   }
 
   return {
    ...toRefs(data),selectMenuItem,
   }
  }
 })
 </script>
 
 <style lang="scss" scoped>
 .custom-dropdown-menu{
  border-radius: 10px !important;
  background-color:var(--secondary-bg) !important;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
  width: 200px;
  padding:8px 0;
 }
 
 :deep(.select){
  background: var(--active-bg);
  color: var(--active-text) !important;
 }
 
 :deep(.drop-item){
   &:last-of-type{
    margin-bottom:0 !important;
   }
 }
 
 :deep(.ant-dropdown-menu-title-content){
  display:flex;
  align-items:center;
 
 }
 
 .font-16{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
 }
 
 
 </style>
 