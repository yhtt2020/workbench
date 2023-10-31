<template>
 <div class="xt-bg-2 rounded-xl p-4">
   <div class="flex justify-between">
    <span class="font-16 font-400  xt-text xt-font">消息提示音</span>
    <a-switch v-model:checked="settings.enablePlay" />
   </div>
   <div class="">有新消息接收时，触发提示音</div>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { appStore } from '../../store'
import { settings } from 'nprogress';
export default {
  data(){
   return{

   }
  },

  computed:{
   ...mapWritableState(appStore,['settings'])
  }
}
</script>

<style lang="scss" scoped>

</style>