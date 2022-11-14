<template>
  <a-layout style="height:calc(100vh)">
    <a-layout-sider theme="light">
      左侧栏
    </a-layout-sider>
    <a-layout-body>
      <router-view></router-view>
    </a-layout-body>
  </a-layout>
</template>

<script>
import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
import { SettingOutlined, LaptopOutlined, SmileOutlined,DownOutlined } from '@ant-design/icons-vue'
import { appStore } from '../store'
import { mapState, mapActions } from 'pinia'
import { CodeTwoTone } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

let { appModel, devAppModel } = window.$models
let appId =
  window.globalArgs['app-id']

export default {
  name: 'Passwords',
  components: {
    SettingOutlined, LaptopOutlined, CodeTwoTone, vueCustomScrollbar, SmileOutlined,DownOutlined
  },
  computed: {
    ...mapState(appStore, [])
  },
  data () {
    return {
      activeNav:['base'],
      user:{
        user_info:{}
      },
      currentDevApp: [],
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      checkNick: false,
    }
  },

  async mounted () {

  },
  methods: {
  }
}
</script>
<style>
body, html {
  overflow: hidden;
  width: 100% !important
}
</style>
<style lang="scss">
h3 {
  &:before {
    content: "";
    display: inline-block;
    background: #0051ff;
    width: 5px;
    border-radius: 3px;
    height: 16px;
    position: absolute;
    bottom: 8px;
    left: -8px;

  }
}
</style>
