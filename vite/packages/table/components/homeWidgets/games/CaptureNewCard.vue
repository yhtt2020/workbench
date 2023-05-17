<template>
  <HomeComponentSlot :options="options" :customData="customData" :customIndex="customIndex" :formulaBar="detailBar" ref="captureNewSlot">
    <div class="flex justify-center items-center mx-5 my-7">
      <div class="flex justify-center pointer  items-center mr-6 flex-col ml-6">
          <span class="px-4 py-4 rounded-full btn-active mb-3 s-item">
            <Icon  icon="camera" style="font-size: 2em;"></Icon>
          </span>
          <span>截屏</span>
      </div>
      <div class="flex justify-center pointer  items-center mr-6 flex-col">
        <span class="px-4 py-4 rounded-full btn-active mb-3 s-item">
          <Icon icon="record-circle-line" style="font-size: 2em;"></Icon>
        </span>
        <span>录制</span>
      </div>
      <div class="flex justify-center  pointer items-center mr-6 flex-col">
        <span class="px-4 py-4 btn-active rounded-full mb-3 s-item">
          <Icon icon="maikefeng1" style="font-size: 2em;"></Icon>
        </span>
        <span>麦克风</span>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <span class="mb-3 s-item w-full pointer btn-active text-center rounded-lg py-3">我的截屏(183)</span>
      <span class="mb-3 s-item w-full pointer btn-active text-center rounded-lg py-3">我的录制(124)</span>
      <span class="mb-2 s-item w-full pointer btn-active text-center rounded-lg py-3" @click="shortcutSet">快捷键设置</span>
      <span class="mb-3 s-item w-full pointer btn-active text-center rounded-lg py-3" @click="shortcutSet">捕获设置</span>
    </div>
  </HomeComponentSlot>
  <a-drawer title="设置" :placement="right"  v-model:visible="captureNewShow" width="500">
    <div class="flex flex-col">
      <span class="mb-6">我的截屏保存地址</span>
      <span class="text-center mb-6 py-3 drawer-item-bg rounded-lg">{{ screenShotAddress }}</span>
      <span class="mb-6">我的录制保存地址</span>
      <span class="text-center mb-6 py-3 drawer-item-bg rounded-lg">设置保存地址</span>
      <span class="mb-6">截屏快捷键</span>
      <div class="flex items-center  mb-6">
        <span class="shortcut-key rounded-lg mr-3">{{ shortcutKey }}</span>
        <span class="mr-3 drawer-item-bg rounded-lg btn-active replace-key pointer">更换按键</span>
        <span class="mr-3 rounded-lg drawer-item-bg btn-active replace-key pointer">重置</span>
      </div>
      <span class="mb-6">录制快捷键</span>
      <div class="flex items-center mb-6">
        <span class="shortcut-key rounded-lg mr-3">{{ recordKey }}</span>
        <span class="mr-3 drawer-item-bg rounded-lg btn-active replace-key pointer">更换按键</span>
        <span class="mr-3 rounded-lg drawer-item-bg btn-active replace-key pointer">重置</span>
      </div>
      <span class="mb-6">是否启用麦克风录制快捷键</span>
      <div class="flex items-center mb-6">
        <span class="shortcut-key rounded-lg mr-3">{{ microphoneKey }}</span>
        <span class="mr-3 rounded-lg drawer-item-bg btn-active replace-key pointer">更换按键</span>
        <span class="mr-3 rounded-lg drawer-item-bg btn-active replace-key pointer">重置</span>
      </div>
    </div>

  </a-drawer>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue';
export default {
  name:'CaptureNewCard',
  components:{
    HomeComponentSlot
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    }
  },
  data(){
    return{
      options:{
        className: 'card',
        title: '捕获',
        icon: 'video',
        type: 'games',
      },
      detailBar:[{icon:"shezhi1",title:'设置',fn:()=>{this.captureNewShow = true;this.$refs.captureNewSlot.visible = false}}],
      captureNewShow:false,
      screenShotAddress:"C:\PROGRAM FILES (X86)\CLIP", // 用于接收截屏获取的地址
      shortcutKey:"CTRL + WIN + G",
      recordKey:"CTRL + WIN + V",
      microphoneKey:"CTRL + WIN + J"
    }
  },
  methods:{
    shortcutSet(){
      this.captureNewShow = true
    }
  }
}
</script>

<style scoped>
.shortcut-key{
  width: 270px;
  padding: 12px 12px;
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}
.replace-key{
  padding: 13px 12px;
}

</style>