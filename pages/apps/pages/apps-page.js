const appsTpl =
  ` <div style="width: 100%"><a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <template>
        <div>
          <a-page-header style="border: none;" title="应用导航"
          sub-title="好用的网页应用">
    </a-page-header>
    <br />
  </div>
</template>

</a-layout-header>
<a-layout-content>
  <div style="text-align: left;padding: 10px;margin:20px">
    <template>
      <div style="width: 100% ;background: white;
    border-radius: 8px;
    padding: 20px;
    min-height: 800px;">
        <a-tabs default-active-key="design" tab-position="left"
        :style="{ height: '100%' }">
        <a-tab-pane v-for="(type, indexType) in allApps" :key="type.name" :tab="type.title">
        <a-card :title="type.title" style="padding: 10px;">
        <a-card-grid
        :class="{'app':true,'app-goods':true}"
        style="" v-for="(app, indexApp) in type.apps"
        @mouseenter="show(app)" @mouseleave="hide()"
        @contextmenu.prevent.native="showDrawer(app)">
        <a-avatar shape="square" :size="64" :src="app.icon"
        style="margin-bottom: 10px;"></a-avatar>
      <a-card-meta :title="app.name">
      <template slot="description">
        {{ app.summary }}
      </template>
    </a-card-meta>
     <div class="mask" v-show='currentApp== app '>
      <div class="inner-wrapper" style="">
      <a-button style="border-radius: 4px 4px 0 0;text-align: left;"
                type="primary" icon="plus-circle"
      @click="installApp(app,true)" block>
      {{ btnText }}
    </a-button>

    <a-button
              style="border-radius:0 0 4px 4px;text-align: left;"
              type="primary" icon="branches"
    @click="installApp(app);" block>
    安装并打开
  </a-button>
</div>
</div>
    </a-card-grid>
    </a-card>
    </a-tab-pane>
    </a-tabs>


</a-card-grid>
</a-tab-pane>
</a-card>
</a-tabs>
</div>
</template>
</div>
</a-layout-content>
</a-layout>
<template>
  <a-drawer title="应用详情" width="640" placement="right" :closable="false" :visible="drawerVisible"
  @close="onClose">
  <a-row type="flex">
    <a-col flex="128px">
      <a-avatar shape="square" :size="100" :src="drawerApp.icon"></a-avatar>
  </a-col>
  <a-col flex="auto">
    <h3>
      {{drawerApp.name}}
    </h3>
    <p>
      <a-icon type="link"></a-icon>
      <a :href="drawerApp.url" target="_blank">{{drawerApp.url}}</a>
  </p>
  <p>
    <a-icon type="bulb"></a-icon> {{drawerApp.summary}}
  </p>
  <p>
    <a-icon type="like"></a-icon> 推荐指数：<template>
    <a-rate v-model="drawerApp.star" default-value="3"></a-rate>
  </template>
  </p>
  <p>
    <a-icon type="api"></a-icon> 对接方式：URL打开（不支持数据对接）
  </p>
</a-col>
</a-row>

</a-drawer>
</template>
</div>
`
module.exports = Vue.component('apps-page', {
  name: 'apps-page',
  template: appsTpl,
  data () {
    return {
      visible: false,
      currentApp: {}, //点击时的app
      drawerApp: {},
      quickDrawer: {},
      //计算属性，这里加上下划线区分一下
      drawerVisible: false,
      visibleCart: false,
      quickDrawerVisible: false,
      btnText: '安装到应用',
      app: {}
    }
  },
  computed: {
    allApps: {
      get: function () {
        if (typeof window.$appsApiData2 == 'undefined' || window.$appsApiData2 == null) {
          return window.nativeData2.allApps
        }
        return window.$appsApiData2.allApps
      }
    },
    appUpdateTime: {
      get: function () {
        if (typeof window.$appsApiData2 == 'undefined' || window.$appsApiData2 == null) {
          return window.nativeData2.updateTime
        } else {
          return window.$appsApiData2.updateTime
        }

      }
    }
  },
  mounted () {
    this.myApps = []
    this.load()
  },
  methods: {
    installApp(app,background=false){
      let standAloneAppModel=require('../../util/model/standAloneAppModel.js')
      let option={
        name: app.name,
        logo: app.icon,
        summary:   app.summary,
        type:'web',
        themeColor: '#ccc',
        settings: {
          bounds:{
            width:1200,
            height:800
          }
        },
        showInSideBar: false
      }
      standAloneAppModel.install(app.url,option).then(success=>{
        this.$message.success('安装了应用：' + app.name+'，可在我的应用中查看。')
        ipc.send('installApp',{id:success,background:background})
      },err=>{
        this.$message.error('安装了应用：' + app.name+'，可在我的应用中查看。')
      })
    },
    showModal () {
      this.visible = true
    },
    load: function () {
      // window.$appsRestore.restoreFromDB().then((data) => {
      //   this.myApps = data
      //   return data
      // }).catch(e => {
      //   console.log(e)
      //   this.myApps = []
      // })
    },
    showDrawer (app) {
      this.drawerApp = null
      this.drawerApp = app
      this.drawerVisible = true
    },
    onClose () {
      this.drawerVisible = false
    },
    //移入app时的菜单显示
    show (app) {
      this.currentApp = app
    },
    hide (obj) {
      this.currentApp = null
    },
  }
})
