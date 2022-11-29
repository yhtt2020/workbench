import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path=require('path')
// https://vitejs.dev/config/
const pkg:string=__dirname
function getPath(name){
  return path.resolve(pkg,'/html/'+name+'.html')
}
const htmls=[
  'icon','index','extension','task','settings','barrage','user','tray','frame','app','kee'
]
let inputs={}
htmls.forEach(html=>{
  inputs[html]=getPath(html)
})
export default defineConfig({
  plugins: [vue()],
  base:'./',
  build:{
    rollupOptions:{
      input :inputs,
      output:{
        manualChunks: {
          vandor: ['vue', 'ant-design-vue', 'perfect-scrollbar','@ant-design/icons-vue','vue-router','vuex'],//提取公共部分的插件，防止部分插件无法加载
        }
      }
    }
  }
})
