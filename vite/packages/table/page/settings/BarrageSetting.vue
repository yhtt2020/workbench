<template>
<h2>弹幕设置</h2>
  <div class="card" style="padding: 1em;width: 30em">
    <div class="line">
      页面允许渲染弹幕数：<a-input-number v-model:value="settings.barrage.limit"></a-input-number>
    </div>
    <div class="line">
      轨道高度：<a-input-number v-model:value="settings.barrage.height"></a-input-number>
    </div>
    <div class="line">
      同一个弹幕出现次数：<a-input-number v-model:value="settings.barrage.repeat"></a-input-number>
    </div>
    <div class="line">
      弹幕方向：<a-radio-group v-model:value="settings.barrage.direction"><a-radio value="right">从右到左</a-radio> <a-radio value="left">从左到右</a-radio></a-radio-group>
    </div>
    <div class="line">
      与内嵌浏览器当前页面联动：<a-switch v-model:checked="settings.barrage.browserLink"></a-switch>
    </div>
    <div class="line">
      <div @click="refresh" class="btn"><Icon icon="shuaxin"></Icon> 刷新测试</div>
    </div>
  </div>


</template>

<script>
import { appStore } from '../../store'
import {mapWritableState} from 'pinia'
import {message} from 'ant-design-vue'
export default {
  name: 'BarrageSetting',
  computed:{
    ...mapWritableState(appStore,['settings'])
  },
  methods:{
    refresh(){
      window.$manager.setOptions(
        {
          ...this.settings.barrage
        }
      )
      window.$manager.reload()
      message.success('刷新成果')
    }
  }
}
</script>

<style scoped>

</style>
