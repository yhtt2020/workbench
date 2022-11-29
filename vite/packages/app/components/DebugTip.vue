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
    message:'包名是应用唯一可读身份，一般由三段组成。 【前缀】.【公司名】.【应用名】，只有注册了包名的应用，才能够上架市场。包名不注册是不可以直接上架的。在上架的时候会要求唯一包名。'
  },
  'logo':{
    title:'logo',
    message:'应用图标必须为png，建议尺寸256*256，将被自动复制到项目目录下logo.png'
  },
  'local_dir':{
    title:'本地目录',
    message:'本地目录，用于生成manifest.json文件，不选择则无法生成路径和打包项目。',

},
  'open_source':{
    title:'是否开源',
    message:'此项不是必须的，如果您的应用同时开源，可以勾选后填写开源地址，将被展现在应用设置和应用市场页面上。'
  },
  'os_summary':{
    title:'开源说明',
    message:'请写清楚开源协议，以及附加条款，方便其他用户全面了解应用的情况。'
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
