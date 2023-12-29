<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex justify-between mb-2">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:settings-16-regular" :size="isModal ? 20 : 24 "  class="mr-2"></xt-new-icon>
        <span class="xt-font xt-text font-400" :class="isModal ? 'font-14':'font-16'">设置</span>
      </div>
      <div class="flex items-center justify-center">
        <xt-button w="145" :h="isModal ? 32 : 40" style="border-radius: 8px;" :class="isModal ? 'mr-2':'xt-bg'"  @click="resetPapersSettings">
          <div class="flex items-center justify-center">
            <xt-new-icon icon="fluent:arrow-clockwise-16-regular" :size="isModal ? 16 : 20" class="mr-2"></xt-new-icon>
            <span  class="xt-font xt-text font-400" :class="isModal ? 'font-14':'font-16'">恢复默认设置</span>
          </div>
        </xt-button>
        <ClosePaperButton v-if="isModal"/>
      </div>
    </div>

    <div class="flex-1 h-4/5">
      <PaperSettingDetail :isModal="isModal" @updatePaper="selectSource"/>
    </div>
  </div>
</template>

<script>
import { appStore } from '../../store'
import { mapWritableState, mapActions } from 'pinia'
import { paperStore } from '../../store/paper'
import {Icon as iconify} from '@iconify/vue'

import ClosePaperButton from './components/close/ClosePaperButton.vue';
import PaperSettingDetail from './components/content/PaperSettingDetail.vue';

export default {
  name: 'Setting',

  props:['isModal'],

  computed: {
    ...mapWritableState(paperStore, ['settings'])
  },

  components:{ 
    ClosePaperButton,PaperSettingDetail
  },

  data() {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },

    }
  },

  mounted() {
    if (!this.settings) {
      this.resetPapersSettings()
    }
  },

  methods: {
    ...mapActions(paperStore, ['resetPapersSettings']),

    async showSaveDialog() {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择下载壁纸的目录', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.savePath = savePath[0]
      } else {
      }
    },

    selectSource(source){
      this.settings.wallSource=source
    }
  },

}
</script>

<style scoped lang="scss">
.select-item{
  background: var(--secondary-bg);
  padding: 10px;
  border-radius: 10px;
  box-sizing: content-box;
  border:1px solid #00000000;
  cursor: pointer;
  &:hover{
   opacity: 0.8;
  }
  &.active{
    border:1px solid var(--active-bg);
  }
}
.card{
  height:250px;
}

</style>
