myappTpl =
  `
<div style="width: 100%">
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <a-page-header title="本地导航" sub-title="本地导航可能由于软件重装、卸载、系统重装等原因丢失，建议使用云端导航，此处仅做临时存储使用。"/>
    </a-layout-header>
    <a-layout-content>
      {{listId}}
      <div style="padding: 20px;text-align: left;padding: 10px;margin:20px">
        <!-- <div style="text-align: center;margin:20px">
          <search />
        </div> -->
        <div>
          <a-card>
            <a class="add-button" slot="extra" @click="showModal">添加网站</a>
            <a-dropdown v-for="(app, index) in myApps" :trigger="['contextmenu']">
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
            <a-card-grid v-else class="app" style="cursor: pointer;" @click="showModal">
              <a-avatar shape="square" :size="64" icon="plus"
                        style="margin-bottom: 10px;"></a-avatar>
              <a-card-meta title="添加">
              </a-card-meta>
            </a-card-grid>
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
                                :tab="type.title">

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

module.exports = Vue.component('myapp-page', {
  name: 'myapp-page',
  template: myappTpl,
  beforeRouteUpdate (to, from, next) {
    this.listId = to.query.listId
  },
  data () {
    return {
      listId: this.$route.query.listId,
      visible: false,
      myApps: [],
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
    this.myApps = []
    this.load()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      name: 'register'
    })
  },
  methods: {
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
      window.$appsRestore.restoreFromDB().then((data) => {
        this.myApps = data
        return data
      }).catch(e => {
        console.log(e)
        this.myApps = []
      })
    }
  }
})
