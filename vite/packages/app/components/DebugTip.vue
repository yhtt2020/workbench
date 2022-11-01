<template>
  <a-tooltip :title="getTip.title">
    <div class="tip-hover" style="">
      <CodeTwoTone/>
      {{ getTip.message }}
    </div>
  </a-tooltip>
</template>

<script>

import { CodeTwoTone } from '@ant-design/icons-vue'

const tipMap = {
  'debug_url': {
    title: '调试入口',
    message: '仅开启调试模式可见，如果需要生效，还需同时启用调试入口开关。'
  },
  'default_opt': {
    title: '初始配置',
    message: '初始体验优化，仅安装时生效，后续用户也可以通过还原重置。'
  },
  'use_debug_url': {
    title: '启用调试入口',
    message: '开启后打开应用将被定位到调试入口'
  },
  'package':{
    title:'包名',
    message:'包名是应用唯一可读身份，一般由三段组成。 【前缀】.【公司名】.【应用名】，只有注册了包名的应用，才能够上架市场。'
  }
}
export default {
  name: 'DebugTip',
  components: {
    CodeTwoTone
  },
  props: {
    tip: String
  },

  mounted () {

  },
  computed: {
    getTip () {
      return tipMap[this.tip]
    }
  }
}
</script>

<style scoped lang="scss">
.tip-hover {
  &:hover{
      background: white;
    box-shadow: 0 0 3px #cccccc;
    color: black;
   }
  border-radius: 4px;
  padding: 3px 10px;

  background: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  margin-bottom: 12px;
  margin-top: 6px
}
</style>
