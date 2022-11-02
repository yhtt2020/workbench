import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import Setting from './page/Setting.vue'
import Develop from './page/settingChildren/Develop.vue'
import Tool from './page/settingChildren/Tool.vue'
import Wizard from './page/settingChildren/Wizard.vue'
import Base from './page/settingChildren/Base.vue'
import Window from './page/settingChildren/Window.vue'
import Auth from './page/settingChildren/Auth.vue'
import Export from './page/settingChildren/Export.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import Optimize from './page/settingChildren/Optimize.vue'
import {createPinia} from 'pinia'

const pinia = createPinia()
const routes = [
  {
    path: '/setting', name: 'setting', component: Setting,
    children: [
      {
        path: '', component: Base
      },
      {
        path: 'optimize', component: Optimize
      },
      {
        path: 'develop', component: Develop
      }, {
        path: 'auth', component: Auth
      },
      {
        path: 'window', component: Window
      },
      {
        path: 'tool', component: Tool
      }, {
        path: 'wizard', component: Wizard
      },
      {
        path: 'export', component: Export
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
createApp(App).use(pinia).use(Antd).use(router).mount('#app')

tools.getWindowArgs(window)


