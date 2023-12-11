<template>
  <div :class="options.className" :style="{pointerEvents:(editing?'none':'')}">
    <div class="content-title">
      <div class="left-title">
        <Icon :icon="options.icon" class="title-icon"></Icon>
        <div style="font-size: 1em">{{ options.title }}</div>
      </div>
      <div class="right-title" @click.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
    </div>

    <div @click="go" class="pointer">
      <slot></slot>
    </div>

  </div>
  <a-drawer
    :contentWrapperStyle="{ padding:10,marginLeft:'2.5%',
    backgroundColor:'#1F1F1F',width: '95%',height:'11em',borderRadius:'5%'}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="visible"
    @close="onClose"
  >
    <div style="display: flex;flex-direction: row;height: 100%">

      <div class="option" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>
        删除
      </div>
      <div class="option" @click="onCopy">
        <Icon class="icon" icon="fuzhi"></Icon>
        复制数据
      </div>
    </div>
  </a-drawer>
  <textarea id="textArea" style="opacity: 0;height: 0;width: 0;position: absolute"></textarea>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from '../../../store/card'
import { message } from 'ant-design-vue'
import { inspectorStore } from '../../../store/inspector'

export default {
  data () {
    return {
      visible: false,
    }
  },
  name: 'SupervisorySlot',
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
    }
  },
  computed: {
    ...mapWritableState(cardStore, ['aidaData']),

  },
  mounted () {
    this.startInspect()
  },
  unmounted () {
    this.stopInspect()
  },
  methods: {
    ...mapActions(cardStore, ['removeCard']),
    ...mapActions(inspectorStore, ['startInspect', 'stopInspect']),
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    removeCard () {
      this.removeCard(this.customIndex)
      this.visible = false
    },
    onCopy () {
      if (this.aidaData) {
        let textArea = document.getElementById('textArea')
        textArea.innerText = JSON.stringify(this.aidaData)
        textArea.select()
        document.execCommand('copy')
        this.visible = false
        message.info('复制成功！')
      } else {
        message.info('复制失败，请检查是否启动过aida64！')
      }
    },
    go () {
      this.$router.push({ name: 'inspector' })
    }
  }
}
</script>
