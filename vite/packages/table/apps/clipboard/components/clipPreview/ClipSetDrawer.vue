<template>
  <!-- 设置 -->
  <a-drawer v-model:visible="setShow" title="设置" width="500" placement="right">
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <span class="mb-2 primary-title">剪切板</span>
        <span class="secondary-title">关闭后将停止读取剪切板内容</span>
      </div>
      <a-switch v-model:checked="settings.enable"/>
    </div>
    <span class="primary-title">打开剪切板应用快捷键</span>
    <div class="flex items-center my-6">
      <div class="button-bg px-3 py-2.5 rounded-lg mr-3" style="width: 50%; border: 1px solid var(--divider);">
        <span>{{ instruct }}</span>
      </div>
      <div class="button-bg px-4 py-3 button-active rounded-lg pointer mr-3">
        <span>更换按键</span>
      </div>
      <div class="button-bg px-4 py-3 button-active rounded-lg pointer">
        <span>重置</span>
      </div>
    </div>
    <div class="primary-title mt-4">历史记录容量</div>
    <HorizontalPanel class="mt-2" :navList="historyCapacity" v-model:selectType="defaultCapacity"></HorizontalPanel>
    <div class="primary-title mt-4">每次载入页数</div>
    <HorizontalPanel class="mt-2" :navList="pageSizes" v-model:selectType="pageSizeTab"></HorizontalPanel>
    <div @click="cleanData"
         class="w-full flex items-center button-active pointer justify-center rounded-lg py-3 button-bg my-6">
      <span>清除剪切板记录</span>
    </div>
    <div class="flex my-6 justify-between">
      <div class="flex flex-col">
        <span class="primary-title">代码高亮自动识别</span>
        <span class="secondary-title">开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch v-model:checked="settings.codeHighlight"/>
    </div>
    <div class="flex items-center pointer justify-center bt-bg button-active button-bg primary-title rounded-lg p-3"
         @click="openCodeHighlight">
      <span>代码高亮设置</span>
    </div>
  </a-drawer>

  <!-- 代码高亮设置 -->
  <a-drawer placement="right" width="500" title="代码高亮设置" v-model:visible="clipSetVisible" @close="onClose">
    <div class="flex justify-between mb-6">
      <div class="flex flex-col">
        <span class="primary-title">代码高亮自动识别</span>
        <span class="secondary-title">开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch v-model:checked="settings.codeHighlight"/>
    </div>
    <div class="mb-6 primary-title">默认语言</div>
    <div @click="openLanguageDrawer"
         class="mb-6 bt-bg py-3 button-active button-bg flex items-center rounded-lg pointer justify-center">
      <span>{{ selectLanguage.name }}</span>
    </div>
    <div class="mb-6 primary-title">编辑器主题</div>
    <div @click="openThemeDrawer"
         class="mb-6 py-3 flex items-center bt-bg button-active  button-bg rounded-lg pointer justify-center">
      <span>{{ settings.clipTheme }}</span>
    </div>
    <div class="flex justify-between mb-6">
      <div class="flex flex-col">
        <span class="primary-title">显示行号</span>
        <span class="secondary-title">开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch v-model:checked="settings.showLineNumber"/>
    </div>
    <div class="mb-6 primary-title">缩进单位</div>
    <a-input placeholder="4" class="h-12 " v-model:value="settings.clipSize" @pressEnter="updateIndentUnit($event)"/>
  </a-drawer>

  <!-- 主题色模块 -->
  <HorizontalDrawer :rightSelect="themeType" ref="themeRef"
                    v-model:selectRegion="settings.clipTheme" @getArea="getTheme"
  >
  </HorizontalDrawer>

  <!-- 语言包选择 -->
  <HorizontalDrawer :rightSelect="codeLanguage" v-model:selectRegion="settings.clipMode" ref="languageRef"
                    @getArea="getLanguage"></HorizontalDrawer>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store'
import HorizontalPanel from '../../../../components/HorizontalPanel.vue'
import HorizontalDrawer from '../../../../components/HorizontalDrawer.vue'
import { themeType } from '../../../../js/data/clipTheme'
import { codeLanguage } from '../../../../js/data/clipTheme'
import { message, Modal } from 'ant-design-vue'

export default {
  components: {
    HorizontalPanel,
    HorizontalDrawer
  },
  data () {
    return {
      // 控制抽屉打开
      setShow: false,
      themeType,   // 代码块主题选择
      codeLanguage, // 代码块语言包选择
      // 控制代码高亮设置弹窗
      clipSetVisible: false,
      // 默认的快捷键
      instruct: 'CTRL + ALT + V',
      // 历史记录时间
      historyCapacity: [
        { title: '1天', name: 'day' },
        { title: '1周', name: 'week' },
        { title: '1月', name: 'month' },
        { title: '不限制', name: 'unlimited' }
      ],
      pageSizes: [
        { title: '10', name: '10' },
        {
          title: '15', name: '15'
        },
        {
          title: '20', name: '20'
        },
        {
          title: '30', name: '30'
        }
      ],
      // 默认历史记录时间
      defaultCapacity: { title: '1天', name: 'day' },
      pageSizeTab: {}
    }
  },
  computed: {
    ...mapWritableState(clipboardStore, [
      'settings'
    ]),
    selectLanguage () {
      const index = this.codeLanguage.find(el => {
        return el.abbr === this.settings.clipMode
      })
      return index
    }
  },
  mounted () {
    this.pageSizeTab = this.pageSizes.find(s => {
      return String(s.name) === String(this.settings.pageSize)
    })
  },
  methods: {
    ...mapActions(clipboardStore,
      [
        'start', 'stop', 'isRunning', 'prepare',
        'isClipLineNumber', 'isSetCodeHighlight',
        'updateClipSize', 'updateTheme', 'changeClipMode',
        'clean','isRunning'
      ]
    ),
    // 通过该方法可以打开弹窗
    clipOpenShow () {
      this.setShow = true
    },
    //清理数据
    async cleanData () {
      Modal.confirm({
        content: '确认清空全部记录？此操作不会删除收藏内的内容。',
        centered: true,
        okText: '删除',
        onOk: async () => {
          let rs = await this.clean()
          message.success('记录删除成功')
        }
      })

    },
    // 打开代码高亮
    openCodeHighlight () {
      this.clipSetVisible = true
    },
    // 关闭全部
    onClose () {
      this.clipSetVisible = false
    },
    // 修改缩进单位配置
    updateIndentUnit (e) {
      this.updateClipSize(e.target.value)
    },
    // 选择主题
    openThemeDrawer () {
      this.$refs.themeRef.openDrawer()
    },
    // 选择代码语言
    openLanguageDrawer () {
      this.$refs.languageRef.openDrawer()
    },
    // 修改主题
    getTheme (item) {
      // console.log('修改主题',item);
      this.updateTheme(item.name)
    },
    // 修改语言包
    getLanguage (item) {
      // console.log('修改语言',item);
      this.changeClipMode(item.abbr)
    }
  },
  watch: {
    'settings.enable': {
      handler (newVal, oldVal) {
        // console.log('剪切板开关',newVal)
        if (newVal) {
          //是切换到了启用
          this.start()
        } else {
          //切换到了禁止
          if (this.isRunning()) {
            console.log('禁用')
            this.stop()
          }
        }
      }
    },
    // 是否默认代码高亮
    'settings.clipSetShow': {
      handler (newVal, oldVal) {
        this.isSetCodeHighlight(newVal)
      }
    },
    // 是否显示行号
    'settings.showLineNumber': {
      handler (newVal, oldVal) {
        this.isClipLineNumber(newVal)
      }
    },
    'pageSizeTab': {
      handler (newVal) {
        this.settings.pageSize = Number(newVal.name)
      }
    },
    'defaultCapacity': {
      handler (newVal) {
        const values = {
          'day': 86400,
          'week': 604800,
          'month': 2678400,
          'unlimited': 0
        }
        this.settings.historyCapacity = values[newVal.name]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.secondary-title { // 次要标题

  font-size: 14px;
  color: var(--secondary-text);
  font-weight: 500;
}

.primary-title { // 主要标题

  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.button-bg {
  background: var(--secondary-bg);
}

.button-active {
  &:active {
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }

  &:hover {
    background: rgba(42, 42, 42, 0.25);
  }
}

.ant-input {
  border-radius: 12px !important;
  border: 1px solid var(--divider);
}
</style>
