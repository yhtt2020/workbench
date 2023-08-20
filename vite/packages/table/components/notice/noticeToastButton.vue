<template>
  <div class="flex" style="width: 380px;">
    <div class="flex items-center justify-center" style="width: 32px;height: 32px;">
      <img :src="message.icon" class="w-full rounded-full h-full object-cover" alt="">
    </div>

    <div class="flex flex-col" style="width: 90%;margin-left: 16px;">
      <div class="font-16" style="color: var(--primary-text);margin-bottom: 18px;">{{ message.title }}</div>
      <div class="font-16" style="color: var(--secondary-text);margin-bottom: 24px;">{{message.body}}</div>
      <div class="flex items-center justify-between">
        <div class="font-16" style="color:var(--secondary-text);">{{formatTime(parseInt(message.time) * 1000)}}</div>

        <div class="flex ">
          <div class="mr-3 px-5 py-2 rounded-lg pointer flex items-center justify-center pointer active-button" style="background: var(--secondary-bg);color: var(--primary-text);"  @click="talkLater">稍后再说</div>
          <div class="px-5 py-2 rounded-lg flex pointer items-center justify-center active-button" style="background: var(--active-bg);color: var(--active-text);" @click="viewNow" >立即查看</div>
        </div>
      </div>
    </div>

  </div>
  <audio ref="message" src="/sound/message.mp3"></audio>
</template>

<script>
import { defineComponent,ref,toRefs,computed, } from 'vue'
import { mapWritableState} from 'pinia'
import { formatTime } from '../../util'
import { noticeStore } from '../../store/notice'

export default defineComponent({
  props:['message','messageType'],

  computed:{
    ...mapWritableState(noticeStore,['noticeSettings'])
  },

  watch:{
    'messageType':{
      handler(newVal){
        if(newVal === 'message' && this.noticeSettings.messagePlay){
          this.$nextTick(()=>{
           this.$refs.message.play()
          })
        }else{
          this.$nextTick(()=>{
           this.$refs.message.pause()
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
    }

    const viewNow = () =>{  // 点击立即查看
      ctx.emit('closeToast')
      ctx.emit('nowCheck')
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
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}
</style>