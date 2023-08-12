<template>
 <a-breadcrumb separator="" style="padding-left: 4px;">
  <a-breadcrumb-item class="pointer" :style=" {color:'var(--active-bg)'}" @click="go">联系人</a-breadcrumb-item>
  
  <a-breadcrumb-separator style="color: var(--primary-text);margin: 0 5px !important;"/>
  <a-breadcrumb-item class="pointer" :style="show ? {color:'var(--active-bg)'} :{color:'var(--secondary-text)'}" @click="backJunior">{{ title }}</a-breadcrumb-item>
  
  <a-breadcrumb-separator v-show="show" style="color: var(--primary-text);margin: 0 5px !important;"/>
  <a-breadcrumb-item class="pointer" v-show="show" style="color: var(--secondary-text);">{{ threeTitle }}</a-breadcrumb-item>
 </a-breadcrumb>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props:['title','show','threeTitle'],

  setup(props,ctx){

   const go = () =>{  // 点击联系人返回
    ctx.emit('back')
   }

   const backJunior = () =>{
     ctx.emit('superiors')
   }


   return{
    go,backJunior,
   }
  }
})
</script>

<style scoped>

</style>