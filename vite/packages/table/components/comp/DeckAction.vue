<template>
  <!--  <SecondPanel size="small" @changeTab="change" :menus="menus">-->

  <!--  </SecondPanel>-->

  <back-btn @click="back"></back-btn>
  <a-tabs style="margin-top: 4em" v-model:activeKey="activeTab" tab-position="left">
    <a-tab-pane key="browser" tab="浏览器">
      <div class="action">
        打开网页
      </div>
      <div class="action">
        创建新标签组
      </div>
      <div class="action">
        打开密码管理器
      </div>
      <div class="action">
        打开某个插件
      </div>
      <div class="action">
        打开浏览器设置
      </div>
    </a-tab-pane>
    <a-tab-pane key="tip" tab="提示">
      <div class="action">
        弹窗提示
      </div>
    </a-tab-pane>
    <a-tab-pane key="audio" tab="系统设置">
      <div class="action">
        调大音量
      </div>
      <div class="action">
        调小音量
      </div>
      <div class="action">
        静音
      </div>
      <div class="action">
        调高亮度
      </div>
      <div class="action">
        调低亮度
      </div>
    </a-tab-pane>
    <a-tab-pane key="keys" tab="键鼠">
      <div class="action">
        模拟鼠标
      </div>
      <div class="action">
        模拟按键
      </div>
    </a-tab-pane>
    <a-tab-pane key="app" tab="应用">
      <div class="action">
        打开系统内应用
      </div>
      <div class="action">
        打开轻应用
      </div>
      <div class="action">
        打开酷应用
      </div>
    </a-tab-pane>
    <a-tab-pane key="cmd" tab="命令行">
      <div class="action">
        执行命令行程序
      </div>
      <div class="action">
        执行cmd命令
      </div>
      <div class="action">
        执行nircmd命令
      </div>
      <p>选择一个外部命令行工具，并执行相应的命令行，支持单行和多行，推荐使用nircmd之类的工具。具体可查看<a>此处帮助</a>。
      </p>
      <div class="line">
        选择命令行工具
      </div>
      <div class="line">
        <a-input-group compact>
          <a-input style="width: calc(320px - 120px)" placeholder="选择命令行工具"></a-input>
          <a-button type="primary" >浏览</a-button>
        </a-input-group>
      </div>
      <div class="line">
        命令行
      </div>
      <div class="line">
        <a-textarea placeholder="输入命令行"></a-textarea>
      </div>
    </a-tab-pane>
  </a-tabs>

  <div>

  </div>
</template>

<script>
import SecondPanel from '../SecondPanel.vue'
import BackBtn from './BackBtn.vue'

export default {
  name: 'DeckAction',
  data () {
    return {
      activeTab:'cmd',
      menus: [
        {
          title: '浏览器',
          index: 'browser'
        },
        {
          title: '提示',
          index: 'tip'
        },
        {
          title: '音频',
          index: 'sound'
        }, {
          title: '键鼠',
          index: 'key'
        }, {
          title: '应用',
          index: 'app'
        }, {
          title: '命令行',
          index: 'console'
        }
      ]
    }
  },
  components: { BackBtn, SecondPanel },
  methods: {
    change (tab) {
      console.log(tab)
    },
    back(){
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.action{
 border-radius: 0.4em;
  border:1px solid #4f4f4f;
  display: inline-block;
  text-align: center;
  border-left: 4px solid #0a84ff;
  line-height: 2;
  font-size: 1.1em;
  padding: 0.3em 0.8em;
  color: #111111;
  margin-right: 1em;
  margin-bottom: 1em;
  background: #b9b9b9;
  cursor: pointer;
}
</style>
