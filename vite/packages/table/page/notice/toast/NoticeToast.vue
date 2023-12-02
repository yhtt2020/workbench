<template>
    <div class="flex" style="width: 380px;">
     <div class="flex flex-col w-full">
       <div class="flex items-center justify-between" style="margin-bottom: 13px;">
         <div class="flex items-center">
           <div class="flex items-center justify-center" style="width: 24px;height: 24px;">
             <clockIcon icon="fluent:info-12-filled" style="color: var(--active-bg) !important"  class="object-cover w-full h-full rounded-full xt-text" ></clockIcon>
           </div>
           <div class="ml-3 font-16 xt-text" style="color: var(--primary-text);">提示</div>
         </div>
   
         <div class="flex items-center justify-center active-button pointer" style="width:24px;height:24px;" @click="viewNow">
           <img src="/img/icon/close-circle-fill1.png" class="object-cover w-full h-full rounded-full" alt="">
         </div>
       </div>
   
       <div class="font-16 xt-text" style="margin-bottom: 24px;">将「图标」拖动到「导航栏」外侧可以删除图标。</div>
   
       <div class="flex items-center justify-between">
         <div class="font-16" style="color:var(--secondary-text);"></div>
         <div class="flex items-center justify-center px-5 py-2 rounded-lg pointer active-button" style="background: var(--active-bg);color: var(--active-text);" @click="viewNow" >OK</div>
       </div>
     </div>
   
    </div>
   
    <!-- <audio ref="notice" src="/sound/clock.mp3" v-if="this.soundVisible"></audio> -->
   
   </template>
   
   <script>
   import { defineComponent,ref,toRefs,computed, } from 'vue'
   import { mapWritableState,mapActions} from 'pinia'
   import { formatTime } from '../../../util'
   // import { noticeStore } from '../../store/notice'
   import { appStore } from '../../../store'
   import {useNavigationStore} from '../../../components/desk/navigationBar/navigationStore'
   import { Icon as clockIcon } from '@iconify/vue'
   import { title } from 'process'
   
   export default defineComponent({
    components:{
     clockIcon
    },
    computed:{
     // ...mapWritableState(noticeStore,['noticeSettings']),
     ...mapWritableState(useNavigationStore,['popVisible']),
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
               if(this.soundVisible){
                 this.$refs.notice.play()
               }
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
        const navigationBar=useNavigationStore()
      const talkLater = () =>{  // 点击稍后再说按钮
       ctx.emit('closeToast')
       ctx.emit('nowCheck')
      }
   
      const viewNow = () =>{  // 点击立即查看
        navigationBar.popVisible=false
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
   