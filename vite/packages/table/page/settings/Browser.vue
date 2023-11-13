<template>
  <div class="line-title">
    内置浏览器设置
  </div>
  <div class="line">
    <a-radio-group v-model:value="openUrlBrowser">
      <a-radio value="inner" style="color: var(--primary-text)">内嵌浏览器</a-radio>
      <a-radio value="system" style="color: var(--primary-text)">系统默认浏览器</a-radio>
    </a-radio-group>
  </div>
</template>

<script>

import { mapWritableState } from 'pinia'
import { browserStore } from '../../store/browser'

export default {
  name: 'Browser',
  data() {
    return {
      openUrlBrowser: 'system'
    }
  },
  computed:{

  },
  async mounted() {
    this.openUrlBrowser = await tsbApi.settings.get('openUrlBrowser') || 'inner'
  },
  watch: {
    openUrlBrowser: {
      handler() {
        tsbApi.settings.set('openUrlBrowser', this.openUrlBrowser)
      }
    }
  }
}
</script>

<style scoped></style>
