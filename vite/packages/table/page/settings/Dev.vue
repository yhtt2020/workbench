<template>
  <div
  >
    <div class="line-title">开发设置</div>
    <div class="line xt-text-2">
      开发者模式仅用于开发者调试工作台使用。开启开发者模式后，可能导致软件不稳定。请谨慎开启。
    </div>
    <div class="line">
      开启开发者模式：
      <a-switch v-model:checked="settings.enableDev"></a-switch>
    </div>
    <template v-if="settings.enableDev">
      <div class="line-title">开发者工具</div>
      <div class="line">
        <xt-button @click="openDevTool" :w="140" :h="40" type="theme">打开开发者工具</xt-button>
      </div>
    </template>

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
import { message } from 'ant-design-vue'

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
  methods:{
    openDevTool(){
      ipc.send('openDevTool')
    },
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
