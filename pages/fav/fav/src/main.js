import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import './assets/css/side-bar.css'
import 'ant-design-vue/dist/antd.css'
import store from './store'
createApp(App).use(Antd).use(store).mount('#app')
