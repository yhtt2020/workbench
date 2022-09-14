import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'

import './styles/flex-class.css' // 引入flex快写样式
import './styles/box.css'
import './styles/text.css'
createApp(App).use(Antd).mount('#app')

