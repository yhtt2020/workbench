<template>
  <div v-if="isGuide &&!$useEnv()" class="w-full "  >
    <div class="flex justify-between ">
      <span class="xt-text">开机自启动：</span>
      <a-switch  @change="setAutoRun" v-model:checked="isAutoRun"></a-switch>
    </div>
    <span class="xt-text-2 font-14 ">可能会被安全软件拦截，请允许</span>
  </div>
  <div v-else-if="!$useEnv()">
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
    if (this.$useEnv()) return
    this.isAutoRun = await tsbApi.settings.get('autoRun')
    if(this.isGuide){
      //向导页面直接设置为自启动
      this.isAutoRun=true
      this.setAutoRun()
    }
  },
  methods: {
    async setAutoRun() {
      await tsbApi.settings.setAutoRun(this.isAutoRun)
    },
  }
}
</script>

<style scoped></style>
