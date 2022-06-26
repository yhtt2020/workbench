let vite=require("vite")
const vue = require('@vitejs/plugin-vue')
const path=require('path')
async function buildRender(){
  let options={
    root :process.cwd(),
    build:{
      enableEsbuild:true,
      minify:true,
      outDir:path.join(process.cwd(),"release/bundled")
    },
    plugins:[vue()]
  }
  await vite.build(options)
}
buildRender()
