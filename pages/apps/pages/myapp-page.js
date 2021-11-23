myappTpl =
  `
<div style="width: 100%">
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <a-page-header title="本地导航" sub-title="本地导航可能由于软件重装、卸载、系统重装等原因丢失，建议使用云端导航，此处仅做临时存储使用。">
       <template slot="extra">

       <a-radio-group :value="appList.type" @change="onListTypeChange">
        <a-radio-button value="0">
          <a-icon type="appstore"></a-icon>
        </a-radio-button>
<!--           <a-radio-button value="1">-->
<!--          <a-icon type="table"></a-icon>-->
<!--        </a-radio-button>-->
        <a-radio-button value="2">
          <a-icon type="bars"></a-icon>
        </a-radio-button>
      </a-radio-group>
      </template>
      </a-page-header>
    </a-layout-header>
    <a-layout-content>
      <div style="text-align: left;padding: 10px;margin:20px">
       <div style="float: left">
       <template>
  <a-breadcrumb>
    <a-breadcrumb-item>本地列表</a-breadcrumb-item>
    <a-breadcrumb-item>{{appList.name}}</a-breadcrumb-item>
  </a-breadcrumb>

</template>
       </div>
        <!-- <div style="text-align: center;margin:20px">
          <search />
        </div> -->
        <div>
          <a-card>

            <a-button type="primary" shape="round" class="add-button" slot="extra" @click="showModal">添加网站</a-button>

<div id="main-content" style="max-height: calc( 100vh - 238px);overflow-y: auto">
<template>
  <a-list  v-show="appList.type==='2'" item-layout="horizontal" :data-source="myApps" :pagination="pagination">
    <a-list-item slot="renderItem" slot-scope="item, index">
      <a-list-item-meta
        :description="item.summary"
      >
        <a slot="title" :href="item.url">{{ item.name }}</a>
        <a-avatar
          slot="avatar"
          :src="item.icon"
        />
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>
<div v-show="appList.type==='0'">
 <a-dropdown  v-for="(app, index) in myApps" :trigger="['contextmenu']">
              <a-card-grid class="app" style="cursor: pointer;"
                           @click="addTask(app)">
                <a-avatar shape="square" :size="64" :src="app.icon"
                          style="margin-bottom: 10px;"></a-avatar>
                <a-card-meta :title="app.name">
                </a-card-meta>
              </a-card-grid>
              <a-menu slot="overlay">
                <a-menu-item @click="addApp(app)" key="1">
                  <a-icon type="delete"></a-icon>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-empty v-if="myApps.length==0" description="还未添加任何网站，点击添加网站">

              <a-button type="primary" @click="showModal">
                添加网站
              </a-button>

            </a-empty>
</div>


</div>
          </a-card>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
  <template>
    <div>
      <a-modal v-model="visible" title="添加网站" :footer="null" :width="800">
        <template>
          <a-tabs default-active-key="1" tab-position="top">
            <a-tab-pane key="1">
\t\t\t\t\t\t\t\t\t<span slot="tab">
\t\t\t\t\t\t\t\t\t\t<a-icon type="appstore"></a-icon>
\t\t\t\t\t\t\t\t\t\t全部
\t\t\t\t\t\t\t\t\t</span>
              <a-alert message="点击图标即可添加，添加完毕后，需手动关闭本界面。" type="info" show-icon
                       style="margin-bottom: 10px;"></a-alert>


              <template>
                <div style="width: 750px">

                  <a-tabs default-active-key="productive" tab-position="left"
                          :style="{ height: '600px' }">
                    <a-tab-pane v-for="(type, indexType) in allApps" :key="type.name"
                                :tab="type.title" >

                <div style="overflow-y: auto;max-height: 600px">
                <a-card :title="type.title" style="padding: 10px;">
                        <a-card-grid style="width: 140px;cursor: pointer;"
                                     v-for="(app, indexApp) in type.apps" class="app"
                                     @click="addApp(app)">
                          <a-avatar shape="square" :size="64" :src="app.icon"
                                    style="margin-bottom: 10px;"></a-avatar>
                          <a-card-meta :title="app.name">
                            <template slot="description">
                              {{ app.summary }}
                            </template>
                          </a-card-meta>
                        </a-card-grid>

                      </a-card>
</div>

                    </a-tab-pane>
                  </a-tabs>
                </div>
              </template>
            </a-tab-pane>
            <!-- <a-tab-pane key="2">
                              <span slot="tab">
                                <a-icon type="book"></a-icon>
                                从书签创建
                              </span>
              待开发
            </a-tab-pane>
            <a-tab-pane key="3">
                              <span slot="tab">
                                <a-icon type="folder"></a-icon>
                                从标签创建
                              </span>
              待开发
            </a-tab-pane> -->
            <a-tab-pane key="4">
  <span slot="tab">
  <a-icon type="link"></a-icon>
从URL创建
</span>
              <template>
                <a-form :form="form" @submit="handleSubmit">
                  <a-alert message="网站的图标不需要设置，当你打开一次这个网站之后，系统就会自动获取并更新。" type="info"
                           show-icon style="margin-bottom: 10px;"></a-alert>
                  <a-form-item v-bind="formItemLayout" label="应用名">
\t\t\t\t\t\t\t\t\t\t\t\t<span slot="label">
\t\t\t\t\t\t\t\t\t\t\t\t\t应用名&nbsp;
                          <a-tooltip title="应用名称">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a-icon type="question-circle-o"/>
\t\t\t\t\t\t\t\t\t\t\t\t\t</a-tooltip>
\t\t\t\t\t\t\t\t\t\t\t\t</span>
                    <a-input placeholder="请输入应用名，少于8个字" v-decorator="[
          'name',
          {
            rules: [{ required: true, message: '请输入应用名！', whitespace: true },{max:24,message:'不得超过24个字！'}],
          },
        ]"/>
                  </a-form-item>

                  <a-form-item v-bind="formItemLayout" label="网址">
\t\t\t\t\t\t\t\t\t\t\t\t<span slot="label">
\t\t\t\t\t\t\t\t\t\t\t\t\t网址&nbsp;
                          <a-tooltip title="输入网址，如果不以http://或https://开头，系统会自动加上http://">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a-icon type="question-circle-o"/>
\t\t\t\t\t\t\t\t\t\t\t\t\t</a-tooltip>
\t\t\t\t\t\t\t\t\t\t\t\t</span>

                    <a-auto-complete
                      v-decorator="['url', { rules: [{ required: true, message: '请输入网址！' },{max:512,message:'最多不能超过512个字母！'}] }]"
                      placeholder="输入任意网址，如http://work.thisky.com，以http或https开头"
                      @change="handleWebsiteChange">
                      <template slot="dataSource">
                        <a-select-option v-for="url in autoCompleteResult" :key="url">
                          {{ url }}
                        </a-select-option>
                      </template>
                      <a-input/>
                    </a-auto-complete>
                  </a-form-item>

                  <a-form-item v-bind="formItemLayout" label="应用介绍">
\t\t\t\t\t\t\t\t\t\t\t\t<span slot="label">
\t\t\t\t\t\t\t\t\t\t\t\t\t应用介绍&nbsp;
\t\t\t\t\t\t\t\t\t\t\t\t</span>
                    <template>
                      <a-textarea placeholder="应用介绍，非必填，不超过100字" :rows="4"
                                  v-decorator="['summary', { rules: [{max:100,message:'最多不能超过100个字！'}] }]">
                      </a-textarea>
                    </template>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
                    <a-button style="margin-left: 20px" type="primary" html-type="submit">
                      添加并继续
                    </a-button>
                  </a-form-item>
                </a-form>
              </template>
            </a-tab-pane>
          </a-tabs>
        </template>
      </a-modal>
    </div>
  </template>
</div>

`

function parseNumber (str) {
  const num = Number(str)
  return isNaN(num) ? 0 : num
}

const appListModel = require('../../util/model/appListModel.js').appListModel
module.exports = Vue.component('myapp-page', {
  name: 'myapp-page',
  template: myappTpl,
  beforeRouteEnter (to, from, next) {
    console.log(to)
    console.log('beforeRouteEnter' + to.query.listId)
    next(vm => {
      vm.myApps = []
      console.log('before enter' + to.query.listId)
      vm.listId = parseNumber(to.query.listId)// 通过 `vm` 访问组件实例
      vm.load()
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.listId = parseNumber(to.query.listId)
    console.log('before update' + to.query.listId)
    this.load()
  },
  data () {
    return {
      pagination:{
        onChange: page => {
          console.log(page);
        },
        pageSize: 10,
        hideOnSinglePage:true
      },
      listId: this.$route.query.listId,
      visible: false,
      type: 0,
      myApps: [],
      appList: {
        name: ''
      },
      //表单布局用字段
      formItemLayout: {
        labelCol: {
          xs: {
            span: 8
          },
          sm: {
            span: 6
          },
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 16
          },
        },
      },
      //表单验证用字段
      confirmDirty: false,
      //表单自动填充用字段
      autoCompleteResult: [],

      //表单专用填充项目
      name: '',
      url: '',
      summary: '',
    }
  },
  computed: {
    allApps: {
      get: function () {
        if (typeof window.$appsApiData == 'undefined' || window.$appsApiData == null) {
          return window.nativeData.allApps
        }
        return window.$appsApiData.allApps
      }
    },
    appUpdateTime: {
      get: function () {
        if (typeof window.$appsApiData == 'undefined' || window.$appsApiData == null) {
          return window.nativeData.updateTime
        } else {
          return window.$appsApiData.updateTime
        }

      }
    }
  },
  mounted () {
    // this.myApps = []
    // this.load()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      name: 'register'
    })
  },
  methods: {//判断是否是我的应用
    //添加应用到任务栏
    addTask (app) {
      postMessage({
        message: 'addTask',
        name: app.name,
        url: app.url,
        icon: app.icon
      })
      this.$message.success('成功在左侧栏添加了应用：' + app.name + '。')
    },
    getAppList () {

    },
    isInMyApps () {

      if (this.currentApp == null) {
        return -1
      }
      let apps = this.myApps
      let app = this.currentApp
      let findIndex = -1
      apps.forEach(function (item, index) {
        if (item.name == app.name)
          findIndex = index
      })
      return findIndex

    },
    addCurrentApp () {
      let that = this
      let app = this.currentApp
      let index = this.isInMyApps(app)
      if (index != -1) {
        this.myApps.splice(index, 1)
        that.$message.warning('移除了应用：' + app.name + '')
        window.$appsRestore.deleteApp(app.name)
        this.btnText = '添加收藏'
      } else {
        let apps = this.myApps
        apps.unshift(app)
        this.myApps = apps
        this.btnText = '移出收藏'

        app.listId = this.listId
        window.$appsRestore.addApp(app)
        this.$message.success('添加了应用：' + app.name)
      }
    },
    addApp (app) {
      this.currentApp = app
      this.addCurrentApp()
    },
    handleSubmit (e) {
      e.preventDefault()
      let that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          const app = {
            'name': values.name,
            'url': values.url,
            'summary': values.summary,
            'icon': '../../icons/default.svg'
          }
          that.addApp(app)

          that.$nextTick(() => {
            that.form.resetFields()

          })
        }
      })
    }, handleWebsiteChange (value) {
      let autoCompleteResult
      if (!value) {
        autoCompleteResult = []
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
      }
      this.autoCompleteResult = autoCompleteResult
    },
    showModal () {
      this.visible = true
    },
    load: function () {
      window.$appsRestore.restoreFromDB(this.listId).then((data) => {
        this.myApps = data
        return data
      }).catch(e => {
        console.log(e)
        this.myApps = []
      })
      console.log(this.listId)
      if (this.listId === 0) {
        this.appList = {
          name: '默认列表',
          type: "0"
        }
      } else {
        const data = appListModel.get(this.listId).catch(err => console.log(err))
        data.then(data => {
          this.appList = null
          this.appList = data
          this.appList.type=String(this.appList.type)
          console.log(this.appList)
        })
      }
    },
    onListTypeChange (e) {
      this.appList.type=e.target.value
      //todo 去保存appList的type
    }
  }
})
