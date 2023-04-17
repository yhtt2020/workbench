<template>
  <div  @contextmenu.stop="showDrawer" class="gradient gradient--14" :class="options.className"
       :style="{pointerEvents:(editing?'none':'')}" @click="onCPUIndex" @mouseleave="onMouseOut"
       @mouseenter="onMouseOver">
    <div
      style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;border-radius: 12px;z-index: 888;padding: 1em; backdrop-filter: blur(8px)"
      v-show="showTip"
      v-if="(options.type.includes('CPU')&&runAida64===false)||(options.type.includes('GPU')&&runAida64===false)"
    >
      <div :class="options.noTitle===true?'no-title':'content-title'">
        <div class="left-title" v-if="options.noTitle!==true">
          <Icon :icon="options.icon" class="title-icon"></Icon>
          <div>{{ options.title }}</div>
        </div>
        <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
          <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
        </div>
      </div>
      <div class="content-small text-lg absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span class="mb-2" style="font-size: 0.8em ;line-height: 1.2">需要安装，如图配置AIDA64并运行</span>
        <div class="mb-2">
          <AidaGuide></AidaGuide>
        </div>

        <div class="slot-btn bg-gray-700 pointer mb-2 h-8 w-24 flex justify-center items-center rounded-xl"
             @click="onDownAida">
          <span>立即下载</span>
        </div>
        <div v-if="options.type.includes('Four')" class="flex flex-col items-center">
          <span class="mb-2" style="font-size: 0.8em ;line-height: 1.2">监控游戏「FPS」需要安装并运行RTSS</span>
          <div class="slot-btn bg-gray-700 pointer mb-2 h-10 w-24 flex justify-center items-center rounded-xl"
               @click="onDownRTSS">
            <span>立即下载</span>
          </div>
        </div>
        <span class="text-base text-neutral-300">如果已经启动请等待大约30秒</span>
      </div>
    </div>

    <div :class="options.noTitle===true?'no-title':'content-title'">
      <div class="left-title" v-if="options.noTitle!==true">
        <Icon :icon="options.icon" class="title-icon"></Icon>
        <div class="w-2/3">{{ options.title }}</div>
      </div>
      <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
    </div>
    <slot :customIndex="customIndex"></slot>
  </div>
  <a-drawer
    :contentWrapperStyle="{   backgroundColor:'#1F1F1F',height:'11em',}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="visible"
    @close="onClose"
  >
    <div style="display: flex;flex-direction: row;height: 100%">
      <div class="option" @click="onSetup" v-if="options.type.includes('downDay')">
        <Icon class="icon" icon="shezhi1"></Icon>
        设置
      </div>
      <div class="option" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>
        删除
      </div>
      <div class="option" @click="onCopy" v-if="options.type.includes('CPU')||options.type.includes('GPU')">
        <Icon class="icon" icon="fuzhi"></Icon>
        复制数据
      </div>
    </div>
  </a-drawer>
  <textarea id="textArea" style="opacity: 0;height: 0;width: 0;position: absolute"
            v-if="options.type.includes('CPU')||options.type.includes('GPU')"></textarea>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from '../../store/card'
import { message } from 'ant-design-vue'
import AidaGuide from './supervisory/AidaGuide.vue'

export default {
  components: { AidaGuide },
  data () {
    return {
      visible: false,
      showTip: false
    }
  },
  name: 'HomeComponentSlot',

  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    editing: {
      type: Boolean,
      default: false
    },
    customIndex: {
      type: Number,
      default: 0
    },
    runAida64: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapWritableState(cardStore, ['aidaData']),
  },
  methods: {
    ...mapActions(cardStore, ['removeCustomComponents']),
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    removeCard () {
      this.removeCustomComponents(this.customIndex)
      this.visible = false
    },
    onSetup () {
      switch (this.options.title) {
        case '倒数日':
          this.$router.push({
            name: 'addCardSetting',
            params: {
              name: 'countdownDay',
              cname: '倒数日',
            },
          })
          break
      }

    },
    onCPUIndex () {
      if (this.options.type.includes('CPU') || this.options.type.includes('GPU')) {
        // this.$router.push('CPUIndex')
      }
    },
    onDownAida () {
      ipc.send('addTab', { url: 'https://www.aida64.com/' })
    },
    onDownRTSS () {
      ipc.send('addTab', { url: 'https://www.guru3d.com/files-details/rtss-rivatuner-statistics-server-download.html' })

    },
    onMouseOver () {
      this.showTip = true
    },
    onMouseOut () {
      this.showTip = false
    },
    onCopy () {
      if (this.aidaData) {
        let textArea = document.getElementById('textArea')
        textArea.innerText = JSON.stringify(this.aidaData)
        console.log(textArea)
        textArea.select()
        document.execCommand('copy')
        this.visible = false
        message.info('复制成功！')
      } else {
        message.info('复制失败，请检查是否启动过aida64！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
