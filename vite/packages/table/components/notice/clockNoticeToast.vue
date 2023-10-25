<template>
 <div class="flex" style="width: 380px;">
  <div class="flex flex-col w-full">
    <div class="flex items-center justify-between" style="margin-bottom: 13px;">
      <div class="flex items-center">
        <div class="flex items-center justify-center" style="width: 32px;height: 32px;">
          <!-- -->
          <clockIcon icon="fluent:clock-alarm-16-filled"  class="object-cover w-full h-full rounded-full xt-text" v-show="changeIcon"></clockIcon>
          <clockIcon icon="fluent:clock-12-regular"  class="object-cover w-full h-full rounded-full xt-text" v-show="!changeIcon"></clockIcon>
        </div>
        <div class="ml-3 font-16 xt-text" style="color: var(--primary-text);">{{ title }}</div>
      </div>

      <div class="flex items-center justify-center active-button pointer" v-if="styles" style="width:21px;height:21px;" @click="viewNow">
        <img src="/img/icon/close-circle-fill1.png" class="object-cover w-full h-full rounded-full" alt="">
      </div>
      <div class="flex items-center justify-center pointer active-button" v-else style="width:21px;height:21px;" @click="viewNow">
        <img src="/img/icon/close-circle-fill.png" class="object-cover w-full h-full rounded-full" alt="">
      </div>
    </div>

    <div class="font-16" style="color: var(--secondary-text);margin-bottom: 24px;">{{content}}</div>

    <div class="flex items-center justify-between">
      <div class="font-16" style="color:var(--secondary-text);">现在</div>
      <div class="flex items-center justify-center px-5 py-2 rounded-lg pointer active-button" style="background: var(--active-bg);color: var(--active-text);" @click="viewNow" >OK</div>
    </div>
  </div>
   <!--
     <div class="flex ">
         <div class="flex items-center justify-center px-5 py-2 mr-3 rounded-lg pointer active-button" style="background: var(--secondary-bg);color: var(--primary-text);"  @click="talkLater">稍后再说</div>

       </div>
    -->

 </div>

 <!-- <audio ref="notice" src="/sound/notice.mp3" v-show="!changeIcon"></audio> -->
 <audio ref="notice" src="/sound/clock.mp3" v-if="this.soundVisible"></audio>

</template>

<script>
import { defineComponent,ref,toRefs,computed, } from 'vue'
import { mapWritableState,mapActions} from 'pinia'
import { formatTime } from '../../util'
import { noticeStore } from '../../store/notice'
import { appStore } from '../../store'
import {topClockSettingStore} from '../../store/topClockSetting'
import { Icon as clockIcon } from '@iconify/vue'
import { title } from 'process'
export default defineComponent({
 props:['content','noticeType','isPlay','title','changeIcon'],
 components:{
  clockIcon
 },
 computed:{
  ...mapWritableState(noticeStore,['noticeSettings']),
  ...mapWritableState(topClockSettingStore,['soundVisible']),
  ...mapWritableState(appStore,['settings'])
 },
  methods:{
    ...mapActions(appStore,['setNoticePlay']),
  },
 watch:{
  'noticeType':{
    handler(newVal){
      // if(this.noticeType === 'notice' && this.isPlay){
        this.setNoticePlay()
        if(this.settings.noticePlay){
          this.$nextTick(()=>{
          this.$refs.notice.play()
          })
        }else{
         this.$nextTick(()=>{
          this.$refs.notice.pause()
         })
        }

    },
    immediate:true,
    deep:true,
  }
 },

 setup(props,ctx){

   const talkLater = () =>{  // 点击稍后再说按钮
    ctx.emit('closeToast')
    ctx.emit('nowCheck')
   }

   const viewNow = () =>{  // 点击立即查看
    ctx.emit('closeToast')
   }

   return{
     formatTime,
     talkLater,
     viewNow
   }
 }
})

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


.font-16{

 font-size: 16px;
 font-weight: 400;
}
</style>
