<template>
  <xt-mix-menu
    name="title"
    :menus="menus"
  >
    <div style="overflow: hidden">
      <div @click="fixed" :class="{active:alwaysTop}"
           class="flex pointer rounded-bl-xl  btn-top-active  items-center no-drag">
        <Icon icon="Pushpin" style="font-size: 1.2em;zoom:1.1"></Icon>
      </div>
      <div @click="minimize" class="flex  items-center btn-top-active pointer no-drag">
        <MinusOutlined style="font-size: 1.2em;"></MinusOutlined>
      </div>

      <div @click="maximize" class="flex pointer   btn-top-active  items-center no-drag">
        <BorderOutlined style="font-size: 1.2em;zoom:0.9"></BorderOutlined>
      </div>
      <div @click="close" class="flex btn-top-active  pointer items-center no-drag">
        <Icon icon="guanbi" style="font-size: 1.2em;"></Icon>
      </div>
    </div>
  </xt-mix-menu>
</template>

<script>
import { getSign, isMain } from '../js/common/screenUtils'

import { MinusOutlined, BorderOutlined } from '@ant-design/icons-vue'
import RightMenu from './card/RightMenu.vue'
import { mapWritableState } from 'pinia'
import { appStore } from '../store'
import { Modal } from 'ant-design-vue'

export default {
  name: 'WindowController',
  components: {
    RightMenu,
    MinusOutlined,
    BorderOutlined
  },
  data () {
    return {
      menus: [{
        newIcon: 'fluent:eye-off-16-regular',
        title: '隐藏按钮',
        fn: () => {
          Modal.confirm({
            centered: true,
            content: '隐藏窗口控制按钮后，可在设置中重新开启。',
            onOk: () => {
              this.showWindowController = false
            },
            okText: '确认'
          })
        },
      },],
      alwaysTop: false,
    }
  },
  computed: {
    ...mapWritableState(appStore, ['showWindowController']),
  },
  async mounted () {
    this.alwaysTop = await tsbApi.window.isAlwaysOnTop()
  },
  methods: {
    // 关闭按钮
    close () {
      if (isMain()) {
        ipc.send('exitTable')
      } else {
        ipc.send('closeScreen', { fullDomain: getSign() })
      }
    },
    // 窗口放大
    async maximize () {
      if (await tsbApi.window.isMaximized()) {
        tsbApi.window.unMaximize()
        setTimeout(() => {
          document.body.classList.add('window')
        }, 200)
      } else {
        setTimeout(() => {
          document.body.classList.remove('window')
        }, 200)

        tsbApi.window.maximize()
      }
    },
    // 关闭窗口放大
    minimize () {
      tsbApi.window.minimize()
    },
    // 固定
    fixed () {
      this.alwaysTop = !this.alwaysTop
      tsbApi.window.setAlwaysOnTop(this.alwaysTop)
    },
  }
}
</script>

<style scoped lang="scss">
.pointer {
  // background: var(--primary-bg) !important;
  & svg {
    color: var(--primary-text) !important;
  }

}

.anticon {
  color: var(--primary-text) !important;
}

.btn-top-active {
  text-align: center;
  width: 55px;
  display: inline-block;
  padding: 8px;
  line-height: 20px;
  // background: var(--active-bg) ;

  &:hover {
    background: var(--active-bg) !important;
  }
}
</style>
