<template>
  <div
  >
    <div class="line-title">界面缩放</div>
    <ZoomUI></ZoomUI>
    <div class="line-title">工作台界面</div>
    <div v-if="!isMain" class="line">
      显示顶部栏：
      <a-switch v-model:checked="settings.showTopPanel"></a-switch>
    </div>
    <template v-if="settings.showTopPanel">
      <div class="line">
        顶部栏显示日期时间：
        <a-switch v-model:checked="settings.showTopbarTime"></a-switch>
      </div>
      <div class="line">
        顶部栏显示天气（需先设置城市）：
        <a-switch v-model:checked="settings.showTopbarWeather"></a-switch>
      </div>
    </template>

    <div class="line-title">使用习惯</div>
    <template v-if="isMain">

      <div class="line">
        <AutoRun/>
      </div>
      <div class="line">
        双击托盘菜单默认打开：
        <a-radio-group v-model:value="trayOpen">
          <!-- 后期可删 -->
          <a-radio value="table" style="color: var(--primary-text)">工作台</a-radio>
          <a-radio value="browser" style="color: var(--primary-text)">浏览器</a-radio>
        </a-radio-group>
      </div>
      <div class="line">
        在任务栏显示工作台：
        <a-switch v-model:checked="showInTaskBar"></a-switch>
      </div>

    </template>
    <div class='line flex w-full'>
      <div style='width:120px'> 右键菜单模式：</div>
      <xt-radio v-model:data='rightModel' :list='rightMenuList'/>
    </div>
  </div>

</template>

<script>
import ZoomUI from '../../components/comp/ZoomUI.vue'
import { appStore } from '../../store'
import { mapWritableState } from 'pinia'
import AutoRun from '../../components/comp/AutoRun.vue'
import { isMain } from '../../js/common/screenUtils'
import Template from '../../../user/pages/Template.vue'
import { useWidgetStore } from '../../components/card/store.ts'

export default {
  name: 'Common',
  components: { Template, AutoRun, ZoomUI },
  data () {
    return {
      trayOpen: '',
      showInTaskBar: false,
      rightMenuList: [
        {
          name: '下拉菜单',
          value: 'follow'
        },
        {
          name: '抽屉菜单',
          value: 'default'
        }
      ]
    }
  },
  computed: {
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    isMain
  },
  async mounted () {
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
