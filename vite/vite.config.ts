import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path=require('path')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    rollupOptions:{
      input :{
        'icon':path.resolve(__dirname,'icon.html'),
        'index':path.resolve(__dirname,'index.html')
      }
    }
  }
})
