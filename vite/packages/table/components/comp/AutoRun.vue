<template>
  <span style="font-weight: bold;color: white;color: var(--primary-text)">开机自启动：</span><a-switch  @change="setAutoRun"
    v-model:checked="isAutoRun"></a-switch> <span class="ml-2">可能会被安全软件拦截，请允许</span>
</template>
<script>
export default {
  name: 'AutoRun',
  data() {
    return {
      isAutoRun: false,
    }
  },
  async mounted() {
    this.isAutoRun = await tsbApi.settings.get('autoRun')
  },
  methods: {
    async setAutoRun() {
      await tsbApi.settings.setAutoRun(this.isAutoRun)
    },
  }
}
</script>

<style scoped></style>
