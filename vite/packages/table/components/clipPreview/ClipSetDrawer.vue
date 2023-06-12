<template>
  <!-- 右侧设置弹窗开始 -->
  <a-drawer v-model:visible="setShow" title="设置" width="500" placement="right">
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <span class="mb-2 plain-font">剪贴板</span>
        <span class="light-grey-font">关闭后将停止读取剪贴板内容</span>
      </div>
      <a-switch v-model:checked="enable"/>
    </div>
    <span class="plain-font">打开剪贴板应用快捷键</span>
    <div class="flex items-center my-6">
      <span class="mr-3 shortcut-area px-3 py-2.5 rounded-lg" style="background: var(--secondary-bg);">{{ instruct }}</span>
      <span class="px-4 py-3 set-button pointer rounded-lg mr-3" style="background: var(--secondary-bg);">更换按键</span>
      <span class="px-4 py-3 set-button pointer rounded-lg " style="background: var(--secondary-bg);">重置</span>
    </div>
    <span class="plain-font pb-6">历史记录容量</span>
    <HorizontalPanel class="mt-6 mb-6" :navList="historyCapacity" bg-color="drawer-item-select-bg"
      v-model:selectType="defaultCapacity"></HorizontalPanel>
    <div class="w-full flex items-center pointer justify-center rounded-lg py-3" style="background: var(--secondary-bg);">
      <span>清除剪贴板记录</span>
    </div>
    <!-- 控制代码块高亮 -->
    <div class="flex my-6 justify-between">
      <div class="flex flex-col">
        <span class="plain-font">代码高亮自动识别</span>
        <span class="light-grey-font">开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch />
      <!-- v-model:checked="enable" -->
    </div>
    <!-- 代码块高亮设置入口按钮 -->
    <div class="flex items-center pointer justify-center s-item rounded-lg p-3" @click="openCodeHighlight">
      <span class="btn-text">代码高亮设置</span>
    </div>
  </a-drawer>
  <!-- 右侧设置弹窗结束 -->

  <!-- 代码块高亮配置弹窗 -->
  <a-drawer placement="right" width="500" title="代码高亮设置" v-model:visible="clipSetVisible" @close="onClose">
    <div class="flex justify-between mb-6">
      <div class="flex flex-col">
        <span class="plain-font">代码高亮自动识别</span>
        <span>开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch />
    </div>
    <div class="mb-6 plain-font">默认语言</div>
    <div class="mb-6">swift</div>
    <div class="mb-6">编辑器主题</div>
    <div class="mb-6">dracula</div>
    <div class="flex justify-between mb-6">
      <div class="flex flex-col">
        <span class="plain-font">显示行号</span>
        <span>开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch />
    </div>
    <div class="mb-6">缩进单位</div>
    <a-input placeholder="4" />
    <!-- v-model:value="value"  -->
  </a-drawer>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store/clipboard'
import HorizontalPanel from '../../components/HorizontalPanel.vue';

export default {
  components:{
    HorizontalPanel,
  },
  data(){
    return {
      // 控制抽屉打开
      setShow:false,
      // 控制代码高亮设置弹窗
      clipSetVisible:false,
      // 默认的快捷键
      instruct: 'CTRL + ALT + V',
      // 历史记录时间
      historyCapacity: [
        {title: '1天', name: 'day'},
        {title: '1周', name: 'week'},
        {title: '1月', name: 'month'},
        {title: '不限制', name: 'unlimited'}
      ],
      // 默认历史记录时间
      defaultCapacity: {title: '1天', name: 'day'},
    }
  },
  computed:{
    ...mapWritableState(clipboardStore,['enable'])
  },
  methods:{
    ...mapActions(clipboardStore,['start','stop','isRunning','prepare']),
    // 通过该方法可以打开弹窗
    clipOpenShow(){
      this.setShow = true
    },
    // 打开代码高亮
    openCodeHighlight(){
      this.clipSetVisible = true
    },
    // 关闭全部
    onClose(){
      this.clipSetVisible = false
      this.setShow = false
    },
  },
  watch:{
    'enable':{
      handler(newVal, oldVal){
        console.log('剪切板开关',newVal)
        if (newVal) {
          this.prepare()
          this.start()
        }else{
          if (this.clipboardObserver) {
            if (this.isRunning()) {
              this.stop()
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.light-grey-font {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.60);
  font-weight: 500;
}

.plain-font {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.set-button {
  background: #2A2A2A;
}

.btn-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}

.shortcut-area {
  background: #2A2A2A;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 227px;
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

</style>