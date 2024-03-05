<template>
 <div style="width: 252px; height: 120px;" class="xt-text flex flex-col relative">
  <!-- 移除标记 -->
  <template v-if="status !== null &&  status === 'del'">
    <div class="absolute" style="top: 3px;right:-4px;" >
      <xt-button class="pointer" style="width: auto !important;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:subtract-circle-16-filled" size="20" :color="'var(--error)'"></xt-new-icon>
        </div>
      </xt-button>
    </div>
  </template>

  <!-- 添加标记 -->
  <template v-else-if="status !== null &&  status === 'add'">
    <div class="absolute" style="top: 3px;right:-4px;" >
      <xt-button style="width: auto !important;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
        </div>
      </xt-button>
    </div>
  </template>

  <!-- 音乐播放器 -->
  <div  v-if="!$useEnv()" class="xt-bg-t-2 w-full rounded-lg mb-3 flex items-center justify-between" style="padding: 0 22px; height: 54px;">
    <div v-for="item in list">
      <xt-button style="width: auto;" h="0" @click="item.fn" :class="status !== 'null' ? 'unPointer':''">
        <div class="flex items-center justify-center">
          <xt-new-icon :icon="item.icon" :size="item.size||24" :color="item.color"></xt-new-icon>
        </div>
      </xt-button>
    </div>
  </div>

  <!-- 音量调节区域 -->
  <div v-if="!$useEnv()" @touchstart="setting=true" @touchmove="syncProgressBar" @touchend="setVolume" @click="setVolume" @mousemove="syncProgressBar" @mousedown="setting=true" @mouseup="setVolume"  class="xt-bg-t-2 w-full flex items-center justify-between rounded-lg pointer" style="height: 54px;">
    <div class="rounded-tl-lg rounded-bl-lg " :style="{width:(defaultOutput.volume/100*258).toFixed(0)+'px'}" style="height:52px;background: rgba(255,255,255,0.85);"></div>
    <div class="pr-4">
     <xt-button :class="status !== 'null' ? 'unPointer':''" @mousedown.stop @mousemove.stop @mouseup.stop @click="setMuted(!mute)"   @touchend.stop @touchstart.stop @touchmove.stop style="width: auto;" h="0">
       <div class="flex items-center justify-center">
         <xt-new-icon  v-if="!mute" icon="fluent:speaker-2-16-regular" size="24"></xt-new-icon>
         <xt-new-icon v-else icon="fluent:speaker-mute-16-regular" size="24"></xt-new-icon>
       </div>
     </xt-button>
    </div>
  </div>

 </div>
</template>

<script setup>
import { ref ,onMounted} from 'vue';
import { getDefaultVolume, setDefaultVolume } from '../../../../../../js/ext/audio/audio'
const mute =ref(false)

const defaultOutput=ref({})
onMounted(async () => {
  if (window.$useEnv()) return

  defaultOutput.value = await getDefaultVolume()
  // console.log(defaultOutput)
  mute.value = defaultOutput.value.muted
})
const setting=ref(false)
const props = defineProps({
  event:true,
  /**通过status属性来判断音乐播放器是否可以播放,以及音量是否可以调节**/
  status:{
    type:String,
    default:'null'
  }
})

const lastSong = () =>{
  // 做上一首音乐的播放交互逻辑
  if(props.status === 'null'){
    window.$models.win32.sendKeyboard(0xB1)
  }
}
const setMuted=(muteValue,event)=>{
  setDefaultVolume({
    muted:muteValue
  })
  mute.value=muteValue
  window.event.stopPropagation()
}
const nextSong = ()=>{
  // 做下一首音乐的播放交互逻辑
  if(props.status === 'null'){
    window.$models.win32.sendKeyboard(0xB0)
  }
}

/**
 * 获取声控对应的位置
 * @param event
 * @returns {*}
 */
function getPosVal(event){
  let val=0
  if(event.clientX){
    val=event.clientX-event.target.getBoundingClientRect().x
  }else{
    val=event.changedTouches[0].clientX-event.target.getBoundingClientRect().x
  }
  return val
}
const syncProgressBar=(event)=>{
  if(setting.value){
    console.log(getPosVal(event))
    defaultOutput.value.volume= Number((getPosVal(event)/258*100).toFixed(2))
  }
}
const setVolume=(event)=>{
  let val=getPosVal(event)
  setting.value=false
  setDefaultVolume({
    volume:+(val/258*100).toFixed(2),
    muted:mute.value
  })
  defaultOutput.value.volume= Number((val/258*100).toFixed(2))

}

const play = () =>{
  // 音乐的播放交互逻辑
  if(props.status === 'null'){
    window.$models.win32.sendKeyboard(0xB3)
  }
}

const list = ref([
  {
    icon:'fluent:previous-16-filled',
    color:'var(--disable-text)',
    fn:()=>{ lastSong() }
  },
  {
    icon:'fluent:video-play-pause-20-filled',
    color:'var(--primary-text)',
    fn:()=>{ play() },
    size:32
  },
  {
    icon:'fluent:next-16-filled',
    color:'var(--disable-text)',
    fn:()=>{ nextSong() }
  },
])


</script>

<style lang="scss" scoped>
.unPointer{
  pointer-events: none !important;
}
</style>
