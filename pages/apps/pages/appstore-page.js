const appstoreTpl =
 ` <div style="width: 100%"><a-layout>
    <a-layout-header style="background: #fff; padding: 0">

      <template>
        <div>
          <a-page-header style="border: none;" title="办公导航"
          :sub-title="'想天办公导航，右键查看详情，网站更新于'+appUpdateTime+'。'">
          <template slot="extra">
            <a-button-group>
              <a-button>
                <a-icon type="appstore"></a-icon>
              </a-button>
              <a-button>  <a-icon type="table"></a-icon></a-button>
              <a-button>  <a-icon type="bars"></a-icon>
              </a-button>

            </a-button-group>
            <a-button icon="shopping-cart" key="3" @click="showDrawerCart()"
            :type="shopcartApps.length>0?'primary':'default'">
            清单
            <a-badge :count="shopcartApps.length" :overflow-count="99"
            :style="{'position':'absolute','top':'0','right':'0'}"
            :number-style="{ backgroundColor: '#52c41a' }">
            <a href="#" class="head-example" />
          </a-badge>
        </a-button>
      </template>
    </a-page-header>
    <br />
  </div>
</template>

</a-layout-header>
<a-layout-content>
  <div style="padding: 20px;text-align: left;padding: 10px;margin:20px">
    <template>
      <div style="width: 100% ;background: white;
    border-radius: 8px;
    padding: 20px;
    min-height: 800px;">
        <a-tabs default-active-key="productive" tab-position="left"
        :style="{ height: '100%' }">
        <a-tab-pane v-for="(type, indexType) in allApps" :key="type.name"
        :tab="type.title">

        <a-card :title="type.title" style="padding: 10px;">
        <a-card-grid
        :class="{'app':true,'app-goods':true,'added':shopcartApps.indexOf(app)!=-1,'in-myApps':checkInMyApps(app)!=-1}"
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

        <a-button v-if="checkInMyApps(app)==-1"
                  style="border-radius: 4px 4px 0 0;text-align: left;"
                  type="primary" icon="shopping-cart"
        @click="addAppToCart(app)" block>
        {{ shopcartApps.indexOf(app)==-1 ?'添加到购物车':'从购物车移除' }}
      </a-button>
      <a-button style="border-radius:0;text-align: left;"
                type="primary" icon="plus-circle"
      @click="addApp(app)" block>
      {{ btnText }}
    </a-button>

    <a-button v-show="checkInMyApps(app)==-1"
              style="border-radius:0;text-align: left;"
              type="primary" icon="branches"
    @click="addApp(app);addTask(app)" block>
    收藏并打开
  </a-button>
  <a-button style="border-radius:0;text-align: left;"
            type="primary" icon="login" @click="addTask(app)"
  block>
  仅打开
</a-button>
<a-button
  style="border-radius:0 0 4px 4px;text-align: left;"
  type="primary" icon="container"
																	@click="selectTask()" block>
选择任务添加
</a-button>
</div>
</div>
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





<!-- 	<p>
  <a-button type="primary" icon="plus-circle" @click="addApp()">
  添加到我的应用
</a-button>
<a-button type="primary" icon="container">
  添加到我的应用并新建任务
</a-button>
</p>
<p>
  <a-button type="primary" icon="container">
    添加到我的应用并添加至选择任务
  </a-button>
</p> -->



</a-drawer>
</template>
<a-drawer :title="'应用清单（'+shopcartApps.length+')'" placement="right" :visible="visibleCart"
@close="onCloseCart" :width="400">
  <template>
  <a-empty v-if="shopcartApps.length==0" description="请选择应用"></a-empty>

<a-card>
  <a-card-grid v-for="app in shopcartApps" style="width:25%;text-align:center">
    <a-avatar :src="app.icon"></a-avatar>
  <p class="cart-title">
    {{ app.name }}
  </p>
</a-card-grid>
</a-card>

<div style="margin-top: 10px;">
  <p>
    <a-button icon="container" type="primary" block v-if="shopcartApps.length!=0"
    @click="selectTask()">
    收藏且添加至任务
  </a-button>
</p>
<p>
  <a-button icon="plus-circle" type="default" block v-if="shopcartApps.length!=0"
  @click="addShopcartApps">
  仅收藏，不打开
</a-button>
</p>
<p>
  <a-button icon="login" type="default" block v-if="shopcartApps.length!=0"
  @click="openShopcart">
  不收藏，整组打开
</a-button>
</p>
<p>
  <a-button icon="rest" type="default" block v-if="shopcartApps.length!=0"
  @click="shopcartApps=[]">
  清空清单
</a-button>
</p>

</div>
</template>
</a-drawer>

</div>
`
module.exports = Vue.component('appstore-page', {
  name: 'appstore-page',
  template: appstoreTpl,
  data () {
    return {
      visible: false,
      shopcartApps: [], //购物车内的app
      currentApp: {}, //点击时的app
      drawerApp: {},
      quickDrawer: {},
      //计算属性，这里加上下划线区分一下
      drawerVisible: false,
      visibleCart: false,
      quickDrawerVisible: false,
      btnText: '添加收藏',
    }
  },
  computed: {
    allApps: {
      get: function() {
        if (typeof window.$appsApiData == 'undefined' || window.$appsApiData == null) {
          return window.nativeData.allApps
        }
        return window.$appsApiData.allApps
      }
    },
    appUpdateTime: {
      get: function() {
        if (typeof window.$appsApiData == 'undefined' || window.$appsApiData == null) {
          return window.nativeData.updateTime
        } else {
          return window.$appsApiData.updateTime
        }

      }
    }
  },
  mounted () {
    this.myApps = []
    this.load()
  },
  methods: {
    showModal () {
      this.visible = true
    },
    load: function () {
      window.$appsRestore.restoreFromDB().then((data) => {
        this.myApps = data
        return data
      }).catch(e => {
        console.log(e)
        this.myApps = []
      })
    },
    showDrawer(app) {
      this.drawerApp = null
      this.drawerApp = app
      console.log(this.drawerApp)
      this.drawerVisible = true;
    },
    showDrawerCart() {
      this.visibleCart = true
    },
    onClose() {
      this.drawerVisible = false
    },
    onCloseCart() {
      this.visibleCart = false
    },
    //移入app时的菜单显示
    show(app) {
      this.currentApp = app
      this.btnText = this.isInMyApps(app) == -1 ? '添加收藏' : '移出收藏'
    },
    hide(obj) {
      this.currentApp = null
    },
    //添加到购物车
    addAppToCart(app) {
      if (this.shopcartApps.indexOf(app) == -1)
        //如果不在，就添加
        this.shopcartApps.push(app)
      else {
        //如果已经有了，就删除
        this.shopcartApps.splice(this.shopcartApps.indexOf(app), 1)
      }
    },
    //判断是否是我的应用
    isInMyApps() {

      if (this.currentApp == null) {
        return -1
      }
      let apps = this.myApps
      let app = this.currentApp
      let findIndex = -1
      apps.forEach(function(item, index) {
        if (item.name == app.name)
          findIndex = index
      })
      return findIndex

    },
    //检查是否在dexie的myapp中
    checkInMyApps(app) {
      if(typeof  this.myApps =='undefined')
        return -1
      let apps = this.myApps
      let findIndex = -1
      apps.forEach(function(item, index) {
        if (item.name == app.name)
          findIndex = index
      })
      return findIndex
    },
    //收藏app
    addApp(app) {
      this.currentApp = app
      this.addCurrentApp()
    },
    addShopcartApps() {
      let addCount = 0
      let hasCount = 0
      let that = this
      this.shopcartApps.forEach(function(app) {
        if (that.isInMyApps(app) == -1) {
          that.myApps.push(app)
          window.$appsRestore.addApp(app)
          addCount++
        } else {
          hasCount++
        }
      })
      let text = '添加了' + addCount + '个应用。'
      if (hasCount > 0) {
        text = '选中' + that.shopcartApps.length + '个应用。由于购物车中' + hasCount + '个应用已经存在，实际添加了' +
          addCount + '个应用。'
      }
      this.shopcartApps=[]
      this.visibleCart=false
      that.$message.success(text)
    },
    //收藏移除app dexie操作
    addCurrentApp() {
      let that = this
      let app = this.currentApp
      let index = this.isInMyApps(app)
      if (index != -1) {
        this.myApps.splice(index, 1)
        that.$message.warning('移除了应用：' + app.name + '')
        window.$appsRestore.deleteApp(app.name)
        this.btnText = '添加收藏'
      } else {
        let apps = this.myApps;
        apps.unshift(app)
        this.myApps = apps
        this.btnText = '移出收藏'
        window.$appsRestore.addApp(app)
        this.$message.success('添加了应用：' + app.name)
      }
    },
    //添加应用到任务栏
    addTask(app) {
      postMessage({
        message: 'addTask',
        name: app.name,
        url: app.url,
        icon: app.icon
      })
      this.$message.success('成功在左侧栏添加了应用：' + app.name + '。')
    }
  }
})
