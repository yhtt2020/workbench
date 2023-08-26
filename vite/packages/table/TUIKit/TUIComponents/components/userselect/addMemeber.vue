<template>
 <Modal v-model:visible="memeberVisible" v-if="memeberVisible" :blurFlag="true">
    
 </Modal>
</template>

<script lang="ts">
import { defineComponent,reactive,toRefs } from 'vue'
import Modal from '../../../../components/Modal.vue';
export default defineComponent({
 components:{
  Modal
 },

 setup () {
  const data = reactive({
   memeberVisible:false,
  })
 
  const openMemeberModal = () =>{
    data.memeberVisible = true
  }

  return {
   ...toRefs(data),openMemeberModal
  }
 }
})
</script>

<style lang="scss" scoped>

</style>