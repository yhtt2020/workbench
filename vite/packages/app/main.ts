import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import Setting from './page/Setting.vue'
import Develop from './page/settingChildren/Develop.vue'
import Tool from './page/devMod/Tool.vue'
import Wizard from './page/devMod/Wizard.vue'
import Base from './page/settingChildren/Base.vue'
import BaseDev from './page/devMod/Base.vue'
import Window from './page/devMod/Window.vue'
import Auth from './page/settingChildren/Auth.vue'
import AuthDev from './page/devMod/Auth.vue'
import AllDevApps from './page/AllDevApps.vue'
import Export from './page/devMod/Export.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import Optimize from './page/settingChildren/Optimize.vue'
import OptimizeDev from './page/devMod/Optimize.vue'
import DevMod from './page/DevMod.vue'
import {createPinia} from 'pinia'

const pinia = createPinia()
const routes = [

  {
    path: '/setting', name: 'setting', component: Setting,
    children: [
      {
        path: 'auth', component: Auth
      },{
        path: '', component: Base
      },{
        path: 'optimize', component: Optimize
      },
      {
        path: 'develop', component: Develop
      },
    ]
  },
  {
    path: "/allDevApps", component: AllDevApps
  },
  {
    path: '/dev', name: 'dev', component: DevMod,
    children: [


       {
        path: 'optimize', component: OptimizeDev
      },

      {
        path: 'auth', component: AuthDev
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
        path: '', component: BaseDev
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


