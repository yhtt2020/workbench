<template>
  <h3>调试模式
  <span style="float:right;font-size: 14px">当前状态 <span :style="{background:this.debugMod?'green':'red'}" style="display: inline-block;border-radius: 100%;width: 10px;height: 10px;" />&nbsp; </span>
  </h3>
  <div style="border: solid #c1c1c1 1px;padding: 10px ;border-radius: 4px;background: white;margin-bottom: 10px">注意：开启调试模式后，将允许进行高级设置，凡是调试模式下特有的设置，都将被标记上调试模式图标 <CodeTwoTone/>。</div>

  开关 <a-tooltip title="仅非系统应用可开启调试模式"><a-switch :disabled="app.isSystemApp" v-model:checked="debugMod"/></a-tooltip>

  <div style="padding: 10px;box-shadow: 0 0 3px #a4a4a4;border-radius: 4px;margin-top: 20px;background: white">

      <h4>什么是开发者模式？</h4>

      <p>如果此应用是您自己开发的应用，可以勾选此选项，勾选后，此应用将运行在开发者模式中，同时将为您解锁更多开发者工具，方便您开发和调试应用。</p>

      <h4>开发者模式有哪些额外的功能？</h4>

      <p>允许您为应用添加更多的设置，包括修改默认主题色、应用包名、应用标题、应用起始url
      允许您使用开发者工具，包括导出应用配置文件，上架应用。</p>

  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone } from '@ant-design/icons-vue'

export default {
  name: 'develop',
  components: {
    CodeTwoTone
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod'])
  },
  methods: {
    ...mapActions(appStore, ['toggleDebug'])
  }
}
</script>

<style scoped>

</style>
