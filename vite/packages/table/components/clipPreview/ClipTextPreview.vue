<template>
  <transition name="fade">
    <div v-if="previewShow" class="preview-container">
      <div class="flex justify-between p-3 w-full h-full">
        <!-- 预览左侧内容开始 -->
        <div class="flex flex-col w-full">
          <!-- 关闭预览 -->
          <div class="flex mb-3 h-12 w-12 s-item rounded-lg no-drag items-center justify-center pointer" @click="closePreview">
            <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
          </div>
          <div class="flex items-center w-full justify-center">
             
          </div>
        </div>
        <!-- 预览左侧内容结束 -->

        <!-- 预览右侧内容开始 -->
        <div class="p-6" style="width: 352px;border-left: 1px solid var(--divider);">456</div>
        <!-- 预览右侧内容结束 -->
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store/clipboard';
import Player from 'xgplayer/dist/simple_player'
export default {
  computed:{
    ...mapWritableState(clipboardStore,['previewShow'])
  },
  methods:{
    ...mapActions(clipboardStore,['isOpenPreview']),
    closePreview(){
      this.isOpenPreview(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(19, 19, 19, 0.35);
  backdrop-filter: blur(60px);
}
</style>