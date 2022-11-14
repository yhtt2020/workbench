<template>
  <div style="height: 45px;padding: 10px">
    <a-row gutter="20">
      <a-col>
        <a-select placeholder="当前站点">

        </a-select>
      </a-col>
      <a-col>
        <a-input-search
          v-model:value="value"
          placeholder="搜索"
          style="width: 200px"
          @search="onSearch"
        />
      </a-col>
      <a-col>
        <a-button type="primary">
          新建密码
        </a-button>
      </a-col>
    </a-row>



  </div>
  <a-layout style="height:calc(100vh - 45px)">
    <a-layout-sider theme="light" style="padding: 20px">
      <a-list item-layout="horizontal" :data-source="passwords">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              :description="item.description"
            >
              <template #title>
                <a href="https://www.antdv.com/">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-layout-sider>
    <a-layout-body style="padding: 10px">
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
      passwords:[
        {
          title:'禅道账号',
          description:'Francisio_Phillps'
        },
        {
          title:'禅道账号',
          description:'Francisio_Phillps'
        },
        {
          title:'禅道账号',
          description:'Francisio_Phillps'
        },
        {
          title:'禅道账号',
          description:'Francisio_Phillps'
        },
        {
          title:'禅道账号',
          description:'Francisio_Phillps'
        }
      ]
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
