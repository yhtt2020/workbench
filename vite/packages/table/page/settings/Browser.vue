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

export default {
  name: 'Browser',
  data() {
    return {
      openUrlBrowser: 'inner'
    }
  },
  async mounted() {
    this.openUrlBrowser = await tsbApi.settings.get('openUrlBrowser') || 'inner'
    console.log(this.openUrlBrowser)
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
