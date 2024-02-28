<template>
 <div class="flex flex-col h-full">
  <div class="flex justify-between w-full mb-4">
   <div class="flex items-center justify-center">
     <xt-button w="32" h="32" class="flex items-center justify-center mr-2" style="border-radius: 8px;" @click="backGoodPage">
       <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:chevron-left-16-regular" class="xt-text" size="24"></xt-new-icon>
       </div>
     </xt-button>
     <span class="xt-text xt-font font-16">扫一扫</span>
   </div>
   <Exit />
  </div>
  <div class="flex items-center justify-center flex-col h-4/5 w-full mb-4">
   <div style="width: 200px;height: 200px;">
    <img :src="newCodeUrl" class="w-full h-full rounded-md object-cover" alt="" />
   </div>
   <span class="font-14 xt-text-2 xt-font mt-4">打开微信扫一扫</span>
  </div>
 </div>
</template>

<script setup>
import { ref,onMounted,nextTick } from 'vue';
import QRCode from 'qrcode';

import Exit from '../../components/Exit.vue';

const  props = defineProps({
  getDetail:{
   type:Object,
   default:()=>{}
  }
})

const emits = defineEmits(['back']);

// 商品链接地址
const codeUrl = ref(`https://m.apps.vip/#/packageC/points-goods/detail?id=${props.getDetail.id}`);
// 转换成二维码后的链接地址
const newCodeUrl = ref('');

const backGoodPage = () =>{
  emits('back')
}

// 生成二维码
const newQRCode = () =>{
  try {
   const options = { 
    e: "M", //容错级别
    width: 90, height:90,margin: 1,
    color: {
     dark:'#000000', // 像素点颜色
     light:'#ffffff', // 背景色
    },
   };
   QRCode.toDataURL(codeUrl.value, options).then((url)=>{
     newCodeUrl.value = url;
   });
  } catch (error) {
   console.error("Error generating QR Code:", error);
  }
}

onMounted(()=>{
 nextTick(()=>{
  newQRCode();
 })
})
</script>

<style lang="scss" scoped>

</style>