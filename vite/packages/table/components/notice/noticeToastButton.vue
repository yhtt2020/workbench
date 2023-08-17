<template>
  <div class="flex flex-col" style="width: 348px;">
    <div class="flex items-center mb-2">
      <div class="flex w-8 h-8 rounded-full mr-4">
       <img :src="message.icon" class="w-full rounded-full h-full object-cover" alt="">
      </div>
      <div>{{ message.title }}</div>
    </div>
    <div class="flex items-center justify-center px-4 mb-2">{{ message.body }}</div>
    <div class="flex items-center justify-between">
      <div>{{formatTime(parseInt(message.time))}}</div>
      <div class="flex">
        <div class="mr-3 px-5 py-2 rounded-lg flex items-center justify-center pointer active-button" style="background: var(--secondary-bg);color: var(--primary-text);">稍后再说</div>
        <!--  @click="talkLater" -->
        <div class="px-5 py-2 rounded-lg flex items-center justify-center active-button" style="background: var(--active-bg);color: var(--active-text);" >立即查看</div>
        <!-- @click="viewNow" -->
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref,toRefs,computed, } from 'vue'
import { formatTime } from '../../js/common/date.ts'


export default defineComponent({
  props:['message'],

  setup(){
   
    
    return{
      formatTime,
      
    }
  }
})

// export default {
//   props:['message'],
//   methods:{
//     formatDate,
//     talkLater(){
//       this.$emit('closeToast')
//     },
//     viewNow(){
//       this.$emit('nowCheck')
//     }
//   }
// }
</script>

<style lang="scss" scoped>
.active-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}
</style>