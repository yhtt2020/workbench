import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path=require('path')
// https://vitejs.dev/config/
const pkg:string=__dirname
function getPath(name){
  return path.resolve(pkg,'html',name+'.html')
}
const htmls=[
  'index',//无任何作用
  'icon',//图标选择器
  'extension',//扩展插件
  'task',//选择任务，暂存任务
  'settings',//设置页面
  'barrage',//弹幕插件
  'user',//用户空间选择
  'tray',//托盘
  'frame',//应用外框
  'app',//应用管理
  'kee',//密码弹窗
  'table',//工作台
  'search',//全局搜索
  'toolbox'//工具箱
]
let inputs={}
htmls.forEach(html=>{
  inputs[html]=getPath(html)
})
export default defineConfig({
  plugins: [vue(),require('tailwindcss'),
    require('autoprefixer')],
  base:'./',
  build:{
    //sourcemap:true,//不打包sourcemap
    rollupOptions:{

      input :inputs,
      output:{
        manualChunks: {
          vandor: ['vue', 'ant-design-vue', 'perfect-scrollbar','@ant-design/icons-vue','vue-router','vuex'],//提取公共部分的插件，防止部分插件无法加载
        }
      }
    }
  },

})
