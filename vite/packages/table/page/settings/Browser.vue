<template>
 <div class="line-title">
   内置浏览器设置
 </div>
  <div class="line">
    默认打开网页使用：此配置项暂未生效
    <a-radio-group disabled v-model:value="settings.openUrlBrowser">
      <a-radio value="builtin">内嵌浏览器</a-radio>
      <a-radio value="system">系统默认浏览器</a-radio>
    </a-radio-group>
  </div>
</template>

<script>
import { appStore } from '../../store'
import {mapWritableState} from 'pinia'

export default {
  name: 'Browser',
  computed:{
    ...mapWritableState(appStore,['settings'])
  }
}
</script>

<style scoped>

</style>
