import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import { createStore } from 'vuex'
import {createRouter,createWebHashHistory} from 'vue-router'
import Detail from './page/Detail.vue'
import Home from './page/Home.vue'
import './styles/flex-class.css' // 引入flex快写样式
import './styles/box.css'
import './styles/text.css'

const store = createStore({
  state () {
    return {
      user: {},
      onlineGrade:{
        crown:0,
        sun:0,
        moon:0,
        star:0
      }
    }
  },
  mutations: {
    setUser (state,user) {
      user.onlineGradeExtra.cumulativeMinutes= user.onlineGradeExtra.cumulativeHours % 60
      user.onlineGradeExtra.cumulativeMinute = user.onlineGradeExtra.minutes
      state.onlineGrade.crown = []
      state.onlineGrade.sun = []
      state.onlineGrade.moon = []
      state.onlineGrade.star = []
      function handleGrade(name){
        for(let i = 0; i < user.onlineGrade[name]; i++) {
          state.onlineGrade[name].push({
            icon: 'file://' +window.globalArgs['app-path']+`/icons/grade/${name}.svg`
          })
        }
      }

      Object.keys(user.onlineGrade).forEach(v => handleGrade(v))
      state.user=user
    }
  }
})
const routes=[
  {
    path:'/',component: Home,
  },
  {
    path:'/detail',component: Detail,name:'detail',
  }
]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})


createApp(App).use(Antd).use(store).use(router).mount('#app')

