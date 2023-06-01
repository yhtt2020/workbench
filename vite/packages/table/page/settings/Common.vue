<template>
  <div class="line-title  ">界面缩放</div>
  <ZoomUI></ZoomUI>

  <template v-if="isMain">
    <div class="line-title">使用习惯</div>
    <div class="line">
      <AutoRun />
    </div>
    <div class="line">
      双击托盘菜单默认打开：
      <a-radio-group v-model:value="trayOpen">
        <a-radio value="worktable" style="color: var(--font-color)">工作台</a-radio>
        <a-radio value="browser" style="color: var(--font-color)">浏览器</a-radio>
      </a-radio-group>
    </div>
    <div class="line">
      在任务栏显示工作台：
      <a-switch v-model:checked="showInTaskBar"></a-switch>
    </div>
  </template>
</template>

<script>
import ZoomUI from '../../components/comp/ZoomUI.vue'
import { appStore } from '../../store'
import { mapWritableState } from 'pinia'
import AutoRun from '../../components/comp/AutoRun.vue'
import { isMain } from '../../js/common/screenUtils'
import Template from '../../../user/pages/Template.vue'

export default {
  name: 'Common',
  components: { Template, AutoRun, ZoomUI },
  data() {
    return {
      trayOpen: '',
      showInTaskBar: false,
    }
  },
  computed: {
    ...mapWritableState(appStore, ['settings']),
    isMain
  },
  async mounted() {
    this.trayOpen = await tsbApi.settings.get('trayOpen') || 'table'
    let showInTaskBar = await tsbApi.settings.get('showInTaskBar')
    if (showInTaskBar === undefined) {
      this.showInTaskBar = true
    } else {
      this.showInTaskBar = showInTaskBar
    }

  },
  watch: {
    'trayOpen': {
      handler: async (value) => {
        await tsbApi.settings.set('trayOpen', value)
      }
    },
    'showInTaskBar': {
      handler: async (value) => {
        await tsbApi.settings.set('showInTaskBar', value)
      }
    }
  }
}
</script>

<style scoped>
.unfit {
  color: orangered
}
</style>
