<template>
  <div style="font-size: 18px">
    <h3 style="text-align: center;">添加自定义按钮</h3>
    <div v-if="tab==='icon'">
      <IconList @onSelect="setIcon"></IconList>
    </div>
    <div v-if="tab==='action'">
      <DeckAction @click="this.tab='input'"></DeckAction>
    </div>
    <div v-if="tab==='input'">
      <div class="line">
        <a-input v-model:value="title" size="large" placeholder="输入按钮名称"></a-input>
      </div>
      <div class="line-title">图标</div>
      <div class="line">
        <a-radio-group v-model:value="type">
          <a-radio value="icon">
            图标按钮
          </a-radio>
          <a-radio value="text">
            文字按钮
          </a-radio>
        </a-radio-group>
      </div>

      <div v-if="type==='text'">
        <div class="line">
          按钮文字： <a-input style="width: 20em" v-model:value="iconText" placeholder="输入文字"></a-input>
        </div>
        <div class="line">
         字体大小： <a-input-number placeholder="字体大小" v-model:value="iconFontSize"></a-input-number>
        </div>
        <div class="line">
          效果预览：
          <div class="text-icon" :style="{'font-size':iconFontSize+'px'}">
            {{ iconText }}
          </div>
        </div>
      </div>

      <div v-else class="line"><span style="margin-right: 1em"><CustomIcon v-if="icon" style="font-size: 60px"
                                                                                 :icon="icon"></CustomIcon>

      <a-avatar v-else :size="60"></a-avatar></span>

        <div class="btn" @click="tab='icon'">选择图标</div>
      </div>
      <div class="line-title">功能</div>
      <div>
        <a-button @click="tab='action'">添加</a-button>
      </div>
      <div></div>
    </div>
  </div>
  <div style="text-align: center">
    <a-button type="primary" @click="doAdd">添加</a-button>
  </div>
</template>

<script>
import IconList from '../../../components/comp/IconList.vue'
import CustomIcon from '../../../components/comp/CustomIcon.vue'
import DeckAction from '../../../components/comp/DeckAction.vue'
import { message } from 'ant-design-vue'

export default {
  name: 'DeckAdd',
  emits: ['add'],
  data () {
    return {
      tab: 'input',
      type: 'icon',
      iconFontSize:20,
      iconText: '',
      showIconList: false,

      icon: null,
      title: '',
      fn: []//功能
    }
  },
  components: { DeckAction, CustomIcon, IconList },
  methods: {
    setIcon (icon) {
      console.log(icon)
      this.icon = icon
      this.tab = 'input'
    },
    doAdd () {
      if (!this.title) {
        message.error('请输入按钮名称')
        return
      }
      if (this.icon === null) {
        message.error('请选择图标')
        return
      }
      let button = {
        title: this.title,
        icon: this.icon,
        fn: this.fn,
        id: Date.now(),
        type: this.type,
        iconFontSize:this.iconFontSize,
        iconText:this.iconText,
      }
      this.$emit('add', button)
    }
  }
}
</script>

<style scoped>
.line {
  margin-top: 1em;
  margin-bottom: 1em;
}

.text-icon {
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #0a84ff;
  color: white;
  padding: 0.2em;
  text-align: center;
  border-radius: 0.2em;
  overflow: hidden;
  word-break: break-all;

}
</style>
