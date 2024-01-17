<template>
 <div style="width: 252px; height: 120px;" class="xt-text flex flex-col relative">
  <!-- 移除标记 -->
  <template v-if="status !== null &&  status === 'del'">
    <div class="absolute" style="top: 7px;right:-4px;" >
      <xt-button style="width: auto !important;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:subtract-circle-16-filled" size="20" :color="'var(--error)'"></xt-new-icon>
        </div>
      </xt-button>
    </div>
  </template>

  <!-- 添加标记 -->
  <template v-else-if="status !== null &&  status === 'add'">
    <div class="absolute" style="top: 7px;right:-4px;" >
      <xt-button style="width: auto !important;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
        </div>
      </xt-button>
    </div>
  </template>

  <!-- 音乐播放器 -->
  <div class="xt-bg w-full rounded-lg mb-4 flex items-center justify-between" style="padding: 0 22px; height: 54px;">
    <div v-for="item in list">
      <xt-button style="width: auto;" h="0" @click="item.fn">
        <div class="flex items-center justify-center">
          <xt-new-icon :icon="item.icon" size="24" :color="item.color"></xt-new-icon>
        </div>
      </xt-button>
    </div>
  </div>

  <!-- 音量调节区域 -->
  <div class="xt-bg w-full flex items-center justify-between rounded-lg" style="height: 52px;">
    <div class="rounded-tl-lg rounded-bl-lg" style="width:129px;height:52px;background: rgba(255,255,255,0.85);"></div>
    <div class="pr-4">
     <xt-button style="width: auto;" h="0">
       <div class="flex items-center justify-center">
         <xt-new-icon icon="fluent:speaker-2-16-regular" size="24"></xt-new-icon>
       </div>
     </xt-button>
    </div>
  </div>

 </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  /**通过status属性来判断音乐播放器是否可以播放,以及音量是否可以调节**/  
  status:{
    type:String,
    default:'null'
  }
})

const lastSong = () =>{
  // 做上一首音乐的播放交互逻辑
  if(props.status === 'null'){ 
   
  }
  // 阻止上一首切换事件
  else {
    
  }
}

const nextSong = ()=>{
  // 做下一首音乐的播放交互逻辑
  if(props.status === 'null'){ 
   
  }
  // 阻止下一首切换事件
  else {
    
  }
}

const play = () =>{
  // 音乐的播放交互逻辑
  if(props.status === 'null'){ 
   
  }
  // 阻止音乐播放事件
  else {
    
  }
}

const list = ref([
  {
    icon:'fluent:previous-16-filled',
    color:'var(--disable-text)',
    fn:()=>{ lastSong() }
  },
  {
    icon:'fluent:play-16-filled',
    color:'rgba(255,255,255,0.85)',
    fn:()=>{ nextSong() }
  },
  {
    icon:'fluent:next-16-filled',
    color:'var(--disable-text)',
    fn:()=>{ play() }
  },
])


</script>

<style lang="scss" scoped>

</style>

<!-- <div  class="rounded-xl flex flex-col items-center justify-center relative"  v-if="status === 'del'" @click.stop="removeControl($event)">
   
   
   <div class="xt-bg w-full rounded-lg mb-4 flex items-center justify-between" style="padding: 0 22px; height: 54px;">
    <div v-for="item in controlItem.list[0].list">
     <xt-button style="width: auto;" h="0">
       <div class="flex items-center justify-center">
         <xt-new-icon :icon="item.icon" size="24" :color="item.color"></xt-new-icon>
       </div>
     </xt-button>
    </div>
   </div>
   <div class="xt-bg w-full flex items-center justify-between rounded-lg" style="height: 52px;">
     <div class="rounded-tl-lg rounded-bl-lg" style="width:129px;height:52px;background: rgba(255,255,255,0.85);"></div>
     <div class="pr-4">
      <xt-button style="width: auto;" h="0">
        <div class="flex items-center justify-center">
          <xt-new-icon :icon="controlItem.list[1].icon" size="24"></xt-new-icon>
        </div>
      </xt-button>
     </div>
   </div>
  </div>

  <div  class="rounded-xl flex flex-col items-center justify-center relative" style="height:120px;width: 252px;" v-else>
    <div class="xt-bg w-full rounded-lg mb-4 flex items-center justify-between" style="padding: 0 22px; height: 54px;">
      <div v-for="item in controlItem.list[0].list">
       <xt-button style="width: auto;" h="0">
         <div class="flex items-center justify-center">
           <xt-new-icon :icon="item.icon" size="24" :color="item.color"></xt-new-icon>
         </div>
       </xt-button>
      </div>
    </div>
    <div class="xt-bg w-full flex items-center justify-between rounded-lg" style="height: 52px;">
       <div class="rounded-tl-lg rounded-bl-lg" style="width:129px;height:52px;background: rgba(255,255,255,0.85);"></div>
       <div class="pr-4">
        <xt-button style="width: auto;" h="0">
          <div class="flex items-center justify-center">
            <xt-new-icon :icon="controlItem.list[1].icon" size="24"></xt-new-icon>
          </div>
        </xt-button>
       </div>
    </div>
  </div> -->