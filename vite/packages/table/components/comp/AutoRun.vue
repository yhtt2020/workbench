<template>
  <div v-if="isGuide" class="w-full">
    <div class="flex justify-between">
      <span class="xt-text">开机自启动：</span>
      <a-switch  @change="setAutoRun" v-model:checked="isAutoRun"></a-switch> 
    </div>
    <span class="xt-text-2 font-14">可能会被安全软件拦截，请允许</span>
  </div>
  <div v-else>
    <span class="xt-text" style="font-weight: bold;">开机自启动：</span>
    <a-switch  @change="setAutoRun" v-model:checked="isAutoRun"></a-switch> 
    <span class="ml-2">可能会被安全软件拦截，请允许</span>
  </div>

</template>
<script>
export default {
  name: 'AutoRun',
  props:['isGuide'],
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
