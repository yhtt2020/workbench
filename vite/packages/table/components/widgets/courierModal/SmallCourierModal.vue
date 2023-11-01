<template>
  <teleport to='body' >
    <Modal v-if="courierShow" v-model:visible="courierShow" :blurFlag="true">
     <SmallCourierDetail :list="list" @close="courierShow = false"/>
    </Modal>
  </teleport>
 </template>
 
 <script>       
 import { courierDetailList } from './modalMock'
 
 import Modal from '../../Modal.vue';
 import SmallCourierDetail from './content/SmallCourierDetail.vue';
 
 export default {
  components:{
   Modal,SmallCourierDetail
  },
 
  data(){
   return{
    courierShow:false,
    list:courierDetailList,
   }
  },
 
  methods:{
    openSmallCourierDetail(){
     this.courierShow = true
    }
  }
 }
 </script>
 
 <style lang="scss" scoped>
 
 </style>